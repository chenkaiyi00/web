(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
 * Angular Carousel - Mobile friendly touch carousel for AngularJS
 * @version v1.0.0 - 2015-10-09
 * @link http://revolunet.github.com/angular-carousel
 * @author Julien Bouquillon <julien@revolunet.com>
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */
/*global angular */

/*
Angular touch carousel with CSS GPU accel and slide buffering
http://github.com/revolunet/angular-carousel

*/

angular.module('angular-carousel', [
    'ngTouch',
    'angular-carousel.shifty'
]);

angular.module('angular-carousel')

.directive('rnCarouselAutoSlide', ['$interval', function($interval) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
        var stopAutoPlay = function() {
            if (scope.autoSlider) {
                $interval.cancel(scope.autoSlider);
                scope.autoSlider = null;
            }
        };
        var restartTimer = function() {
            scope.autoSlide();
        };

        scope.$watch('carouselIndex', restartTimer);

        if (attrs.hasOwnProperty('rnCarouselPauseOnHover') && attrs.rnCarouselPauseOnHover !== 'false'){
            element.on('mouseenter', stopAutoPlay);
            element.on('mouseleave', restartTimer);
        }

        scope.$on('$destroy', function(){
            stopAutoPlay();
            element.off('mouseenter', stopAutoPlay);
            element.off('mouseleave', restartTimer);
        });
    }
  };
}]);

angular.module('angular-carousel')

.directive('rnCarouselIndicators', ['$parse', function($parse) {
  return {
    restrict: 'A',
    scope: {
      slides: '=',
      index: '=rnCarouselIndex'
    },
    templateUrl: 'carousel-indicators.html',
    link: function(scope, iElement, iAttributes) {
      var indexModel = $parse(iAttributes.rnCarouselIndex);
      scope.goToSlide = function(index) {
        indexModel.assign(scope.$parent.$parent, index);
      };
    }
  };
}]);

angular.module('angular-carousel').run(['$templateCache', function($templateCache) {
  $templateCache.put('carousel-indicators.html',
      '<div class="rn-carousel-indicator">\n' +
        '<span ng-repeat="slide in slides" ng-class="{active: $index==index}" ng-click="goToSlide($index)">●</span>' +
      '</div>'
  );
}]);

(function() {
    "use strict";

    angular.module('angular-carousel')

    .service('DeviceCapabilities', function() {

        // TODO: merge in a single function

        // detect supported CSS property
        function detectTransformProperty() {
            var transformProperty = 'transform',
                safariPropertyHack = 'webkitTransform';
            if (typeof document.body.style[transformProperty] !== 'undefined') {

                ['webkit', 'moz', 'o', 'ms'].every(function (prefix) {
                    var e = '-' + prefix + '-transform';
                    if (typeof document.body.style[e] !== 'undefined') {
                        transformProperty = e;
                        return false;
                    }
                    return true;
                });
            } else if (typeof document.body.style[safariPropertyHack] !== 'undefined') {
                transformProperty = '-webkit-transform';
            } else {
                transformProperty = undefined;
            }
            return transformProperty;
        }

        //Detect support of translate3d
        function detect3dSupport() {
            var el = document.createElement('p'),
                has3d,
                transforms = {
                    'webkitTransform': '-webkit-transform',
                    'msTransform': '-ms-transform',
                    'transform': 'transform'
                };
            // Add it to the body to get the computed style
            document.body.insertBefore(el, null);
            for (var t in transforms) {
                if (el.style[t] !== undefined) {
                    el.style[t] = 'translate3d(1px,1px,1px)';
                    has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
                }
            }
            document.body.removeChild(el);
            return (has3d !== undefined && has3d.length > 0 && has3d !== "none");
        }

        return {
            has3d: detect3dSupport(),
            transformProperty: detectTransformProperty()
        };

    })

    .service('computeCarouselSlideStyle', ["DeviceCapabilities", function(DeviceCapabilities) {
        // compute transition transform properties for a given slide and global offset
        return function(slideIndex, offset, transitionType) {
            var style = {
                    display: 'inline-block'
                },
                opacity,
                absoluteLeft = (slideIndex * 100) + offset,
                slideTransformValue = DeviceCapabilities.has3d ? 'translate3d(' + absoluteLeft + '%, 0, 0)' : 'translate3d(' + absoluteLeft + '%, 0)',
                distance = ((100 - Math.abs(absoluteLeft)) / 100);

            if (!DeviceCapabilities.transformProperty) {
                // fallback to default slide if transformProperty is not available
                style['margin-left'] = absoluteLeft + '%';
            } else {
                if (transitionType == 'fadeAndSlide') {
                    style[DeviceCapabilities.transformProperty] = slideTransformValue;
                    opacity = 0;
                    if (Math.abs(absoluteLeft) < 100) {
                        opacity = 0.3 + distance * 0.7;
                    }
                    style.opacity = opacity;
                } else if (transitionType == 'hexagon') {
                    var transformFrom = 100,
                        degrees = 0,
                        maxDegrees = 60 * (distance - 1);

                    transformFrom = offset < (slideIndex * -100) ? 100 : 0;
                    degrees = offset < (slideIndex * -100) ? maxDegrees : -maxDegrees;
                    style[DeviceCapabilities.transformProperty] = slideTransformValue + ' ' + 'rotateY(' + degrees + 'deg)';
                    style[DeviceCapabilities.transformProperty + '-origin'] = transformFrom + '% 50%';
                } else if (transitionType == 'zoom') {
                    style[DeviceCapabilities.transformProperty] = slideTransformValue;
                    var scale = 1;
                    if (Math.abs(absoluteLeft) < 100) {
                        scale = 1 + ((1 - distance) * 2);
                    }
                    style[DeviceCapabilities.transformProperty] += ' scale(' + scale + ')';
                    style[DeviceCapabilities.transformProperty + '-origin'] = '50% 50%';
                    opacity = 0;
                    if (Math.abs(absoluteLeft) < 100) {
                        opacity = 0.3 + distance * 0.7;
                    }
                    style.opacity = opacity;
                } else {
                    style[DeviceCapabilities.transformProperty] = slideTransformValue;
                }
            }
            return style;
        };
    }])

    .service('createStyleString', function() {
        return function(object) {
            var styles = [];
            angular.forEach(object, function(value, key) {
                styles.push(key + ':' + value);
            });
            return styles.join(';');
        };
    })

    .directive('rnCarousel', ['$swipe', '$window', '$document', '$parse', '$compile', '$timeout', '$interval', 'computeCarouselSlideStyle', 'createStyleString', 'Tweenable',
        function($swipe, $window, $document, $parse, $compile, $timeout, $interval, computeCarouselSlideStyle, createStyleString, Tweenable) {
            // internal ids to allow multiple instances
            var carouselId = 0,
                // in absolute pixels, at which distance the slide stick to the edge on release
                rubberTreshold = 3;

            var requestAnimationFrame = $window.requestAnimationFrame || $window.webkitRequestAnimationFrame || $window.mozRequestAnimationFrame;

            function getItemIndex(collection, target, defaultIndex) {
                var result = defaultIndex;
                collection.every(function(item, index) {
                    if (angular.equals(item, target)) {
                        result = index;
                        return false;
                    }
                    return true;
                });
                return result;
            }

            return {
                restrict: 'A',
                scope: true,
                compile: function(tElement, tAttributes) {
                    // use the compile phase to customize the DOM
                    var firstChild = tElement[0].querySelector('li'),
                        firstChildAttributes = (firstChild) ? firstChild.attributes : [],
                        isRepeatBased = false,
                        isBuffered = false,
                        repeatItem,
                        repeatCollection;

                    // try to find an ngRepeat expression
                    // at this point, the attributes are not yet normalized so we need to try various syntax
                    ['ng-repeat', 'data-ng-repeat', 'ng:repeat', 'x-ng-repeat'].every(function(attr) {
                        var repeatAttribute = firstChildAttributes[attr];
                        if (angular.isDefined(repeatAttribute)) {
                            // ngRepeat regexp extracted from angular 1.2.7 src
                            var exprMatch = repeatAttribute.value.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),
                                trackProperty = exprMatch[3];

                            repeatItem = exprMatch[1];
                            repeatCollection = exprMatch[2];

                            if (repeatItem) {
                                if (angular.isDefined(tAttributes['rnCarouselBuffered'])) {
                                    // update the current ngRepeat expression and add a slice operator if buffered
                                    isBuffered = true;
                                    repeatAttribute.value = repeatItem + ' in ' + repeatCollection + '|carouselSlice:carouselBufferIndex:carouselBufferSize';
                                    if (trackProperty) {
                                        repeatAttribute.value += ' track by ' + trackProperty;
                                    }
                                }
                                isRepeatBased = true;
                                return false;
                            }
                        }
                        return true;
                    });

                    return function(scope, iElement, iAttributes, containerCtrl) {

                        carouselId++;

                        var defaultOptions = {
                            transitionType: iAttributes.rnCarouselTransition || 'slide',
                            transitionEasing: iAttributes.rnCarouselEasing || 'easeTo',
                            transitionDuration: parseInt(iAttributes.rnCarouselDuration, 10) || 300,
                            isSequential: true,
                            autoSlideDuration: 3,
                            bufferSize: 5,
                            /* in container % how much we need to drag to trigger the slide change */
                            moveTreshold: 0.1,
                            defaultIndex: 0
                        };

                        // TODO
                        var options = angular.extend({}, defaultOptions);

                        var pressed,
                            startX,
                            isIndexBound = false,
                            offset = 0,
                            destination,
                            swipeMoved = false,
                            //animOnIndexChange = true,
                            currentSlides = [],
                            elWidth = null,
                            elX = null,
                            animateTransitions = true,
                            intialState = true,
                            animating = false,
                            mouseUpBound = false,
                            locked = false;

                        //rn-swipe-disabled =true will only disable swipe events
                        if(iAttributes.rnSwipeDisabled !== "true") {
                            $swipe.bind(iElement, {
                                start: swipeStart,
                                move: swipeMove,
                                end: swipeEnd,
                                cancel: function(event) {
                                    swipeEnd({}, event);
                                }
                            });
                        }

                        function getSlidesDOM() {
                            return iElement[0].querySelectorAll('ul[rn-carousel] > li');
                        }

                        function documentMouseUpEvent(event) {
                            // in case we click outside the carousel, trigger a fake swipeEnd
                            swipeMoved = true;
                            swipeEnd({
                                x: event.clientX,
                                y: event.clientY
                            }, event);
                        }

                        function updateSlidesPosition(offset) {
                            // manually apply transformation to carousel childrens
                            // todo : optim : apply only to visible items
                            var x = scope.carouselBufferIndex * 100 + offset;
                            angular.forEach(getSlidesDOM(), function(child, index) {
                                child.style.cssText = createStyleString(computeCarouselSlideStyle(index, x, options.transitionType));
                            });
                        }

                        scope.nextSlide = function(slideOptions) {
                            var index = scope.carouselIndex + 1;
                            if (index > currentSlides.length - 1) {
                                index = 0;
                            }
                            if (!locked) {
                                goToSlide(index, slideOptions);
                            }
                        };

                        scope.prevSlide = function(slideOptions) {
                            var index = scope.carouselIndex - 1;
                            if (index < 0) {
                                index = currentSlides.length - 1;
                            }
                            goToSlide(index, slideOptions);
                        };

                        function goToSlide(index, slideOptions) {
                            //console.log('goToSlide', arguments);
                            // move a to the given slide index
                            if (index === undefined) {
                                index = scope.carouselIndex;
                            }

                            slideOptions = slideOptions || {};
                            if (slideOptions.animate === false || options.transitionType === 'none') {
                                locked = false;
                                offset = index * -100;
                                scope.carouselIndex = index;
                                updateBufferIndex();
                                return;
                            }

                            locked = true;
                            var tweenable = new Tweenable();
                            tweenable.tween({
                                from: {
                                    'x': offset
                                },
                                to: {
                                    'x': index * -100
                                },
                                duration: options.transitionDuration,
                                easing: options.transitionEasing,
                                step: function(state) {
                                    updateSlidesPosition(state.x);
                                },
                                finish: function() {
                                    scope.$apply(function() {
                                        scope.carouselIndex = index;
                                        offset = index * -100;
                                        updateBufferIndex();
                                        $timeout(function () {
                                          locked = false;
                                        }, 0, false);
                                    });
                                }
                            });
                        }

                        function getContainerWidth() {
                            var rect = iElement[0].getBoundingClientRect();
                            return rect.width ? rect.width : rect.right - rect.left;
                        }

                        function updateContainerWidth() {
                            elWidth = getContainerWidth();
                        }

                        function bindMouseUpEvent() {
                            if (!mouseUpBound) {
                              mouseUpBound = true;
                              $document.bind('mouseup', documentMouseUpEvent);
                            }
                        }

                        function unbindMouseUpEvent() {
                            if (mouseUpBound) {
                              mouseUpBound = false;
                              $document.unbind('mouseup', documentMouseUpEvent);
                            }
                        }

                        function swipeStart(coords, event) {
                            // console.log('swipeStart', coords, event);
                            if (locked || currentSlides.length <= 1) {
                                return;
                            }
                            updateContainerWidth();
                            elX = iElement[0].querySelector('li').getBoundingClientRect().left;
                            pressed = true;
                            startX = coords.x;
                            return false;
                        }

                        function swipeMove(coords, event) {
                            //console.log('swipeMove', coords, event);
                            var x, delta;
                            bindMouseUpEvent();
                            if (pressed) {
                                x = coords.x;
                                delta = startX - x;
                                if (delta > 2 || delta < -2) {
                                    swipeMoved = true;
                                    var moveOffset = offset + (-delta * 100 / elWidth);
                                    updateSlidesPosition(moveOffset);
                                }
                            }
                            return false;
                        }

                        var init = true;
                        scope.carouselIndex = 0;

                        if (!isRepeatBased) {
                            // fake array when no ng-repeat
                            currentSlides = [];
                            angular.forEach(getSlidesDOM(), function(node, index) {
                                currentSlides.push({id: index});
                            });
                        }

                        if (iAttributes.rnCarouselControls!==undefined) {
                            // dont use a directive for this
                            var canloop = ((isRepeatBased ? scope.$eval(repeatCollection.replace('::', '')).length : currentSlides.length) > 1) ? angular.isDefined(tAttributes['rnCarouselControlsAllowLoop']) : false;
                            var nextSlideIndexCompareValue = isRepeatBased ? '(' + repeatCollection.replace('::', '') + ').length - 1' : currentSlides.length - 1;
                            var tpl = '<div class="rn-carousel-controls">\n' +
                                '  <span class="rn-carousel-control rn-carousel-control-prev" ng-click="prevSlide()" ng-if="carouselIndex > 0 || ' + canloop + '"></span>\n' +
                                '  <span class="rn-carousel-control rn-carousel-control-next" ng-click="nextSlide()" ng-if="carouselIndex < ' + nextSlideIndexCompareValue + ' || ' + canloop + '"></span>\n' +
                                '</div>';
                            iElement.parent().append($compile(angular.element(tpl))(scope));
                        }

                        if (iAttributes.rnCarouselAutoSlide!==undefined) {
                            var duration = parseInt(iAttributes.rnCarouselAutoSlide, 10) || options.autoSlideDuration;
                            scope.autoSlide = function() {
                                if (scope.autoSlider) {
                                    $interval.cancel(scope.autoSlider);
                                    scope.autoSlider = null;
                                }
                                scope.autoSlider = $interval(function() {
                                    if (!locked && !pressed) {
                                        scope.nextSlide();
                                    }
                                }, duration * 1000);
                            };
                        }

                        if (iAttributes.rnCarouselDefaultIndex) {
                            var defaultIndexModel = $parse(iAttributes.rnCarouselDefaultIndex);
                            options.defaultIndex = defaultIndexModel(scope.$parent) || 0;
                        }

                        if (iAttributes.rnCarouselIndex) {
                            var updateParentIndex = function(value) {
                                indexModel.assign(scope.$parent, value);
                            };
                            var indexModel = $parse(iAttributes.rnCarouselIndex);
                            if (angular.isFunction(indexModel.assign)) {
                                /* check if this property is assignable then watch it */
                                scope.$watch('carouselIndex', function(newValue) {
                                    updateParentIndex(newValue);
                                });
                                scope.$parent.$watch(indexModel, function(newValue, oldValue) {

                                    if (newValue !== undefined && newValue !== null) {
                                        if (currentSlides && currentSlides.length > 0 && newValue >= currentSlides.length) {
                                            newValue = currentSlides.length - 1;
                                            updateParentIndex(newValue);
                                        } else if (currentSlides && newValue < 0) {
                                            newValue = 0;
                                            updateParentIndex(newValue);
                                        }
                                        if (!locked) {
                                            goToSlide(newValue, {
                                                animate: !init
                                            });
                                        }
                                        init = false;
                                    }
                                });
                                isIndexBound = true;

                                if (options.defaultIndex) {
                                    goToSlide(options.defaultIndex, {
                                        animate: !init
                                    });
                                }
                            } else if (!isNaN(iAttributes.rnCarouselIndex)) {
                                /* if user just set an initial number, set it */
                                goToSlide(parseInt(iAttributes.rnCarouselIndex, 10), {
                                    animate: false
                                });
                            }
                        } else {
                            goToSlide(options.defaultIndex, {
                                animate: !init
                            });
                            init = false;
                        }

                        if (iAttributes.rnCarouselLocked) {
                            scope.$watch(iAttributes.rnCarouselLocked, function(newValue, oldValue) {
                                // only bind swipe when it's not switched off
                                if(newValue === true) {
                                    locked = true;
                                } else {
                                    locked = false;
                                }
                            });
                        }

                        if (isRepeatBased) {
                            // use rn-carousel-deep-watch to fight the Angular $watchCollection weakness : https://github.com/angular/angular.js/issues/2621
                            // optional because it have some performance impacts (deep watch)
                            var deepWatch = (iAttributes.rnCarouselDeepWatch!==undefined);

                            scope[deepWatch?'$watch':'$watchCollection'](repeatCollection, function(newValue, oldValue) {
                                //console.log('repeatCollection', currentSlides);
                                currentSlides = newValue;
                                // if deepWatch ON ,manually compare objects to guess the new position
                                if (deepWatch && angular.isArray(newValue)) {
                                    var activeElement = oldValue[scope.carouselIndex];
                                    var newIndex = getItemIndex(newValue, activeElement, scope.carouselIndex);
                                    goToSlide(newIndex, {animate: false});
                                } else {
                                    goToSlide(scope.carouselIndex, {animate: false});
                                }
                            }, true);
                        }

                        function swipeEnd(coords, event, forceAnimation) {
                            //  console.log('swipeEnd', 'scope.carouselIndex', scope.carouselIndex);
                            // Prevent clicks on buttons inside slider to trigger "swipeEnd" event on touchend/mouseup
                            // console.log(iAttributes.rnCarouselOnInfiniteScroll);
                            if (event && !swipeMoved) {
                                return;
                            }
                            unbindMouseUpEvent();
                            pressed = false;
                            swipeMoved = false;
                            destination = startX - coords.x;
                            if (destination===0) {
                                return;
                            }
                            if (locked) {
                                return;
                            }
                            offset += (-destination * 100 / elWidth);
                            if (options.isSequential) {
                                var minMove = options.moveTreshold * elWidth,
                                    absMove = -destination,
                                    slidesMove = -Math[absMove >= 0 ? 'ceil' : 'floor'](absMove / elWidth),
                                    shouldMove = Math.abs(absMove) > minMove;

                                if (currentSlides && (slidesMove + scope.carouselIndex) >= currentSlides.length) {
                                    slidesMove = currentSlides.length - 1 - scope.carouselIndex;
                                }
                                if ((slidesMove + scope.carouselIndex) < 0) {
                                    slidesMove = -scope.carouselIndex;
                                }
                                var moveOffset = shouldMove ? slidesMove : 0;

                                destination = (scope.carouselIndex + moveOffset);

                                goToSlide(destination);
                                if(iAttributes.rnCarouselOnInfiniteScrollRight!==undefined && slidesMove === 0 && scope.carouselIndex !== 0) {
                                    $parse(iAttributes.rnCarouselOnInfiniteScrollRight)(scope)
                                    goToSlide(0);
                                }
                                if(iAttributes.rnCarouselOnInfiniteScrollLeft!==undefined && slidesMove === 0 && scope.carouselIndex === 0 && moveOffset === 0) {
                                    $parse(iAttributes.rnCarouselOnInfiniteScrollLeft)(scope)
                                    goToSlide(currentSlides.length);
                                }

                            } else {
                                scope.$apply(function() {
                                    scope.carouselIndex = parseInt(-offset / 100, 10);
                                    updateBufferIndex();
                                });

                            }

                        }

                        scope.$on('$destroy', function() {
                            unbindMouseUpEvent();
                        });

                        scope.carouselBufferIndex = 0;
                        scope.carouselBufferSize = options.bufferSize;

                        function updateBufferIndex() {
                            // update and cap te buffer index
                            var bufferIndex = 0;
                            var bufferEdgeSize = (scope.carouselBufferSize - 1) / 2;
                            if (isBuffered) {
                                if (scope.carouselIndex <= bufferEdgeSize) {
                                    // first buffer part
                                    bufferIndex = 0;
                                } else if (currentSlides && currentSlides.length < scope.carouselBufferSize) {
                                    // smaller than buffer
                                    bufferIndex = 0;
                                } else if (currentSlides && scope.carouselIndex > currentSlides.length - scope.carouselBufferSize) {
                                    // last buffer part
                                    bufferIndex = currentSlides.length - scope.carouselBufferSize;
                                } else {
                                    // compute buffer start
                                    bufferIndex = scope.carouselIndex - bufferEdgeSize;
                                }

                                scope.carouselBufferIndex = bufferIndex;
                                $timeout(function() {
                                    updateSlidesPosition(offset);
                                }, 0, false);
                            } else {
                                $timeout(function() {
                                    updateSlidesPosition(offset);
                                }, 0, false);
                            }
                        }

                        function onOrientationChange() {
                            updateContainerWidth();
                            goToSlide();
                        }

                        // handle orientation change
                        var winEl = angular.element($window);
                        winEl.bind('orientationchange', onOrientationChange);
                        winEl.bind('resize', onOrientationChange);

                        scope.$on('$destroy', function() {
                            unbindMouseUpEvent();
                            winEl.unbind('orientationchange', onOrientationChange);
                            winEl.unbind('resize', onOrientationChange);
                        });
                    };
                }
            };
        }
    ]);
})();



angular.module('angular-carousel.shifty', [])

.factory('Tweenable', function() {

    /*! shifty - v1.3.4 - 2014-10-29 - http://jeremyckahn.github.io/shifty */
  ;(function (root) {

  /*!
   * Shifty Core
   * By Jeremy Kahn - jeremyckahn@gmail.com
   */

  var Tweenable = (function () {

    'use strict';

    // Aliases that get defined later in this function
    var formula;

    // CONSTANTS
    var DEFAULT_SCHEDULE_FUNCTION;
    var DEFAULT_EASING = 'linear';
    var DEFAULT_DURATION = 500;
    var UPDATE_TIME = 1000 / 60;

    var _now = Date.now
         ? Date.now
         : function () {return +new Date();};

    var now = typeof SHIFTY_DEBUG_NOW !== 'undefined' ? SHIFTY_DEBUG_NOW : _now;

    if (typeof window !== 'undefined') {
      // requestAnimationFrame() shim by Paul Irish (modified for Shifty)
      // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
      DEFAULT_SCHEDULE_FUNCTION = window.requestAnimationFrame
         || window.webkitRequestAnimationFrame
         || window.oRequestAnimationFrame
         || window.msRequestAnimationFrame
         || (window.mozCancelRequestAnimationFrame
         && window.mozRequestAnimationFrame)
         || setTimeout;
    } else {
      DEFAULT_SCHEDULE_FUNCTION = setTimeout;
    }

    function noop () {
      // NOOP!
    }

    /*!
     * Handy shortcut for doing a for-in loop. This is not a "normal" each
     * function, it is optimized for Shifty.  The iterator function only receives
     * the property name, not the value.
     * @param {Object} obj
     * @param {Function(string)} fn
     */
    function each (obj, fn) {
      var key;
      for (key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          fn(key);
        }
      }
    }

    /*!
     * Perform a shallow copy of Object properties.
     * @param {Object} targetObject The object to copy into
     * @param {Object} srcObject The object to copy from
     * @return {Object} A reference to the augmented `targetObj` Object
     */
    function shallowCopy (targetObj, srcObj) {
      each(srcObj, function (prop) {
        targetObj[prop] = srcObj[prop];
      });

      return targetObj;
    }

    /*!
     * Copies each property from src onto target, but only if the property to
     * copy to target is undefined.
     * @param {Object} target Missing properties in this Object are filled in
     * @param {Object} src
     */
    function defaults (target, src) {
      each(src, function (prop) {
        if (typeof target[prop] === 'undefined') {
          target[prop] = src[prop];
        }
      });
    }

    /*!
     * Calculates the interpolated tween values of an Object for a given
     * timestamp.
     * @param {Number} forPosition The position to compute the state for.
     * @param {Object} currentState Current state properties.
     * @param {Object} originalState: The original state properties the Object is
     * tweening from.
     * @param {Object} targetState: The destination state properties the Object
     * is tweening to.
     * @param {number} duration: The length of the tween in milliseconds.
     * @param {number} timestamp: The UNIX epoch time at which the tween began.
     * @param {Object} easing: This Object's keys must correspond to the keys in
     * targetState.
     */
    function tweenProps (forPosition, currentState, originalState, targetState,
      duration, timestamp, easing) {
      var normalizedPosition = (forPosition - timestamp) / duration;

      var prop;
      for (prop in currentState) {
        if (currentState.hasOwnProperty(prop)) {
          currentState[prop] = tweenProp(originalState[prop],
            targetState[prop], formula[easing[prop]], normalizedPosition);
        }
      }

      return currentState;
    }

    /*!
     * Tweens a single property.
     * @param {number} start The value that the tween started from.
     * @param {number} end The value that the tween should end at.
     * @param {Function} easingFunc The easing curve to apply to the tween.
     * @param {number} position The normalized position (between 0.0 and 1.0) to
     * calculate the midpoint of 'start' and 'end' against.
     * @return {number} The tweened value.
     */
    function tweenProp (start, end, easingFunc, position) {
      return start + (end - start) * easingFunc(position);
    }

    /*!
     * Applies a filter to Tweenable instance.
     * @param {Tweenable} tweenable The `Tweenable` instance to call the filter
     * upon.
     * @param {String} filterName The name of the filter to apply.
     */
    function applyFilter (tweenable, filterName) {
      var filters = Tweenable.prototype.filter;
      var args = tweenable._filterArgs;

      each(filters, function (name) {
        if (typeof filters[name][filterName] !== 'undefined') {
          filters[name][filterName].apply(tweenable, args);
        }
      });
    }

    var timeoutHandler_endTime;
    var timeoutHandler_currentTime;
    var timeoutHandler_isEnded;
    var timeoutHandler_offset;
    /*!
     * Handles the update logic for one step of a tween.
     * @param {Tweenable} tweenable
     * @param {number} timestamp
     * @param {number} duration
     * @param {Object} currentState
     * @param {Object} originalState
     * @param {Object} targetState
     * @param {Object} easing
     * @param {Function(Object, *, number)} step
     * @param {Function(Function,number)}} schedule
     */
    function timeoutHandler (tweenable, timestamp, duration, currentState,
      originalState, targetState, easing, step, schedule) {
      timeoutHandler_endTime = timestamp + duration;
      timeoutHandler_currentTime = Math.min(now(), timeoutHandler_endTime);
      timeoutHandler_isEnded =
        timeoutHandler_currentTime >= timeoutHandler_endTime;

      timeoutHandler_offset = duration - (
          timeoutHandler_endTime - timeoutHandler_currentTime);

      if (tweenable.isPlaying() && !timeoutHandler_isEnded) {
        tweenable._scheduleId = schedule(tweenable._timeoutHandler, UPDATE_TIME);

        applyFilter(tweenable, 'beforeTween');
        tweenProps(timeoutHandler_currentTime, currentState, originalState,
          targetState, duration, timestamp, easing);
        applyFilter(tweenable, 'afterTween');

        step(currentState, tweenable._attachment, timeoutHandler_offset);
      } else if (timeoutHandler_isEnded) {
        step(targetState, tweenable._attachment, timeoutHandler_offset);
        tweenable.stop(true);
      }
    }


    /*!
     * Creates a usable easing Object from either a string or another easing
     * Object.  If `easing` is an Object, then this function clones it and fills
     * in the missing properties with "linear".
     * @param {Object} fromTweenParams
     * @param {Object|string} easing
     */
    function composeEasingObject (fromTweenParams, easing) {
      var composedEasing = {};

      if (typeof easing === 'string') {
        each(fromTweenParams, function (prop) {
          composedEasing[prop] = easing;
        });
      } else {
        each(fromTweenParams, function (prop) {
          if (!composedEasing[prop]) {
            composedEasing[prop] = easing[prop] || DEFAULT_EASING;
          }
        });
      }

      return composedEasing;
    }

    /**
     * Tweenable constructor.
     * @param {Object=} opt_initialState The values that the initial tween should start at if a "from" object is not provided to Tweenable#tween.
     * @param {Object=} opt_config See Tweenable.prototype.setConfig()
     * @constructor
     */
    function Tweenable (opt_initialState, opt_config) {
      this._currentState = opt_initialState || {};
      this._configured = false;
      this._scheduleFunction = DEFAULT_SCHEDULE_FUNCTION;

      // To prevent unnecessary calls to setConfig do not set default configuration here.
      // Only set default configuration immediately before tweening if none has been set.
      if (typeof opt_config !== 'undefined') {
        this.setConfig(opt_config);
      }
    }

    /**
     * Configure and start a tween.
     * @param {Object=} opt_config See Tweenable.prototype.setConfig()
     * @return {Tweenable}
     */
    Tweenable.prototype.tween = function (opt_config) {
      if (this._isTweening) {
        return this;
      }

      // Only set default config if no configuration has been set previously and none is provided now.
      if (opt_config !== undefined || !this._configured) {
        this.setConfig(opt_config);
      }

      this._timestamp = now();
      this._start(this.get(), this._attachment);
      return this.resume();
    };

    /**
     * Sets the tween configuration. `config` may have the following options:
     *
     * - __from__ (_Object=_): Starting position.  If omitted, the current state is used.
     * - __to__ (_Object=_): Ending position.
     * - __duration__ (_number=_): How many milliseconds to animate for.
     * - __start__ (_Function(Object)_): Function to execute when the tween begins.  Receives the state of the tween as the first parameter. Attachment is the second parameter.
     * - __step__ (_Function(Object, *, number)_): Function to execute on every tick.  Receives the state of the tween as the first parameter. Attachment is the second parameter, and the time elapsed since the start of the tween is the third parameter. This function is not called on the final step of the animation, but `finish` is.
     * - __finish__ (_Function(Object, *)_): Function to execute upon tween completion.  Receives the state of the tween as the first parameter. Attachment is the second parameter.
     * - __easing__ (_Object|string=_): Easing curve name(s) to use for the tween.
     * - __attachment__ (_Object|string|any=_): Value that is attached to this instance and passed on to the step/start/finish methods.
     * @param {Object} config
     * @return {Tweenable}
     */
    Tweenable.prototype.setConfig = function (config) {
      config = config || {};
      this._configured = true;

      // Attach something to this Tweenable instance (e.g.: a DOM element, an object, a string, etc.);
      this._attachment = config.attachment;

      // Init the internal state
      this._pausedAtTime = null;
      this._scheduleId = null;
      this._start = config.start || noop;
      this._step = config.step || noop;
      this._finish = config.finish || noop;
      this._duration = config.duration || DEFAULT_DURATION;
      this._currentState = config.from || this.get();
      this._originalState = this.get();
      this._targetState = config.to || this.get();

      // Aliases used below
      var currentState = this._currentState;
      var targetState = this._targetState;

      // Ensure that there is always something to tween to.
      defaults(targetState, currentState);

      this._easing = composeEasingObject(
        currentState, config.easing || DEFAULT_EASING);

      this._filterArgs =
        [currentState, this._originalState, targetState, this._easing];

      applyFilter(this, 'tweenCreated');
      return this;
    };

    /**
     * Gets the current state.
     * @return {Object}
     */
    Tweenable.prototype.get = function () {
      return shallowCopy({}, this._currentState);
    };

    /**
     * Sets the current state.
     * @param {Object} state
     */
    Tweenable.prototype.set = function (state) {
      this._currentState = state;
    };

    /**
     * Pauses a tween.  Paused tweens can be resumed from the point at which they were paused.  This is different than [`stop()`](#stop), as that method causes a tween to start over when it is resumed.
     * @return {Tweenable}
     */
    Tweenable.prototype.pause = function () {
      this._pausedAtTime = now();
      this._isPaused = true;
      return this;
    };

    /**
     * Resumes a paused tween.
     * @return {Tweenable}
     */
    Tweenable.prototype.resume = function () {
      if (this._isPaused) {
        this._timestamp += now() - this._pausedAtTime;
      }

      this._isPaused = false;
      this._isTweening = true;

      var self = this;
      this._timeoutHandler = function () {
        timeoutHandler(self, self._timestamp, self._duration, self._currentState,
          self._originalState, self._targetState, self._easing, self._step,
          self._scheduleFunction);
      };

      this._timeoutHandler();

      return this;
    };

    /**
     * Move the state of the animation to a specific point in the tween's timeline.
     * If the animation is not running, this will cause the `step` handlers to be
     * called.
     * @param {millisecond} millisecond The millisecond of the animation to seek to.
     * @return {Tweenable}
     */
    Tweenable.prototype.seek = function (millisecond) {
      this._timestamp = now() - millisecond;

      if (!this.isPlaying()) {
        this._isTweening = true;
        this._isPaused = false;

        // If the animation is not running, call timeoutHandler to make sure that
        // any step handlers are run.
        timeoutHandler(this, this._timestamp, this._duration, this._currentState,
          this._originalState, this._targetState, this._easing, this._step,
          this._scheduleFunction);

        this._timeoutHandler();
        this.pause();
      }

      return this;
    };

    /**
     * Stops and cancels a tween.
     * @param {boolean=} gotoEnd If false or omitted, the tween just stops at its current state, and the "finish" handler is not invoked.  If true, the tweened object's values are instantly set to the target values, and "finish" is invoked.
     * @return {Tweenable}
     */
    Tweenable.prototype.stop = function (gotoEnd) {
      this._isTweening = false;
      this._isPaused = false;
      this._timeoutHandler = noop;

      (root.cancelAnimationFrame            ||
        root.webkitCancelAnimationFrame     ||
        root.oCancelAnimationFrame          ||
        root.msCancelAnimationFrame         ||
        root.mozCancelRequestAnimationFrame ||
        root.clearTimeout)(this._scheduleId);

      if (gotoEnd) {
        shallowCopy(this._currentState, this._targetState);
        applyFilter(this, 'afterTweenEnd');
        this._finish.call(this, this._currentState, this._attachment);
      }

      return this;
    };

    /**
     * Returns whether or not a tween is running.
     * @return {boolean}
     */
    Tweenable.prototype.isPlaying = function () {
      return this._isTweening && !this._isPaused;
    };

    /**
     * Sets a custom schedule function.
     *
     * If a custom function is not set the default one is used [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window.requestAnimationFrame) if available, otherwise [`setTimeout`](https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout)).
     *
     * @param {Function(Function,number)} scheduleFunction The function to be called to schedule the next frame to be rendered
     */
    Tweenable.prototype.setScheduleFunction = function (scheduleFunction) {
      this._scheduleFunction = scheduleFunction;
    };

    /**
     * `delete`s all "own" properties.  Call this when the `Tweenable` instance is no longer needed to free memory.
     */
    Tweenable.prototype.dispose = function () {
      var prop;
      for (prop in this) {
        if (this.hasOwnProperty(prop)) {
          delete this[prop];
        }
      }
    };

    /*!
     * Filters are used for transforming the properties of a tween at various
     * points in a Tweenable's life cycle.  See the README for more info on this.
     */
    Tweenable.prototype.filter = {};

    /*!
     * This object contains all of the tweens available to Shifty.  It is extendible - simply attach properties to the Tweenable.prototype.formula Object following the same format at linear.
     *
     * `pos` should be a normalized `number` (between 0 and 1).
     */
    Tweenable.prototype.formula = {
      linear: function (pos) {
        return pos;
      }
    };

    formula = Tweenable.prototype.formula;

    shallowCopy(Tweenable, {
      'now': now
      ,'each': each
      ,'tweenProps': tweenProps
      ,'tweenProp': tweenProp
      ,'applyFilter': applyFilter
      ,'shallowCopy': shallowCopy
      ,'defaults': defaults
      ,'composeEasingObject': composeEasingObject
    });

    root.Tweenable = Tweenable;
    return Tweenable;

  } ());

  /*!
   * All equations are adapted from Thomas Fuchs' [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/penner.js).
   *
   * Based on Easing Equations (c) 2003 [Robert Penner](http://www.robertpenner.com/), all rights reserved. This work is [subject to terms](http://www.robertpenner.com/easing_terms_of_use.html).
   */

  /*!
   *  TERMS OF USE - EASING EQUATIONS
   *  Open source under the BSD License.
   *  Easing Equations (c) 2003 Robert Penner, all rights reserved.
   */

  ;(function () {

    Tweenable.shallowCopy(Tweenable.prototype.formula, {
      easeInQuad: function (pos) {
        return Math.pow(pos, 2);
      },

      easeOutQuad: function (pos) {
        return -(Math.pow((pos - 1), 2) - 1);
      },

      easeInOutQuad: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,2);}
        return -0.5 * ((pos -= 2) * pos - 2);
      },

      easeInCubic: function (pos) {
        return Math.pow(pos, 3);
      },

      easeOutCubic: function (pos) {
        return (Math.pow((pos - 1), 3) + 1);
      },

      easeInOutCubic: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,3);}
        return 0.5 * (Math.pow((pos - 2),3) + 2);
      },

      easeInQuart: function (pos) {
        return Math.pow(pos, 4);
      },

      easeOutQuart: function (pos) {
        return -(Math.pow((pos - 1), 4) - 1);
      },

      easeInOutQuart: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
        return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
      },

      easeInQuint: function (pos) {
        return Math.pow(pos, 5);
      },

      easeOutQuint: function (pos) {
        return (Math.pow((pos - 1), 5) + 1);
      },

      easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,5);}
        return 0.5 * (Math.pow((pos - 2),5) + 2);
      },

      easeInSine: function (pos) {
        return -Math.cos(pos * (Math.PI / 2)) + 1;
      },

      easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
      },

      easeInOutSine: function (pos) {
        return (-0.5 * (Math.cos(Math.PI * pos) - 1));
      },

      easeInExpo: function (pos) {
        return (pos === 0) ? 0 : Math.pow(2, 10 * (pos - 1));
      },

      easeOutExpo: function (pos) {
        return (pos === 1) ? 1 : -Math.pow(2, -10 * pos) + 1;
      },

      easeInOutExpo: function (pos) {
        if (pos === 0) {return 0;}
        if (pos === 1) {return 1;}
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(2,10 * (pos - 1));}
        return 0.5 * (-Math.pow(2, -10 * --pos) + 2);
      },

      easeInCirc: function (pos) {
        return -(Math.sqrt(1 - (pos * pos)) - 1);
      },

      easeOutCirc: function (pos) {
        return Math.sqrt(1 - Math.pow((pos - 1), 2));
      },

      easeInOutCirc: function (pos) {
        if ((pos /= 0.5) < 1) {return -0.5 * (Math.sqrt(1 - pos * pos) - 1);}
        return 0.5 * (Math.sqrt(1 - (pos -= 2) * pos) + 1);
      },

      easeOutBounce: function (pos) {
        if ((pos) < (1 / 2.75)) {
          return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
          return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
          return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
          return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
      },

      easeInBack: function (pos) {
        var s = 1.70158;
        return (pos) * pos * ((s + 1) * pos - s);
      },

      easeOutBack: function (pos) {
        var s = 1.70158;
        return (pos = pos - 1) * pos * ((s + 1) * pos + s) + 1;
      },

      easeInOutBack: function (pos) {
        var s = 1.70158;
        if ((pos /= 0.5) < 1) {return 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s));}
        return 0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
      },

      elastic: function (pos) {
        return -1 * Math.pow(4,-8 * pos) * Math.sin((pos * 6 - 1) * (2 * Math.PI) / 2) + 1;
      },

      swingFromTo: function (pos) {
        var s = 1.70158;
        return ((pos /= 0.5) < 1) ? 0.5 * (pos * pos * (((s *= (1.525)) + 1) * pos - s)) :
            0.5 * ((pos -= 2) * pos * (((s *= (1.525)) + 1) * pos + s) + 2);
      },

      swingFrom: function (pos) {
        var s = 1.70158;
        return pos * pos * ((s + 1) * pos - s);
      },

      swingTo: function (pos) {
        var s = 1.70158;
        return (pos -= 1) * pos * ((s + 1) * pos + s) + 1;
      },

      bounce: function (pos) {
        if (pos < (1 / 2.75)) {
          return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
          return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
          return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
          return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
      },

      bouncePast: function (pos) {
        if (pos < (1 / 2.75)) {
          return (7.5625 * pos * pos);
        } else if (pos < (2 / 2.75)) {
          return 2 - (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
        } else if (pos < (2.5 / 2.75)) {
          return 2 - (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
        } else {
          return 2 - (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
        }
      },

      easeFromTo: function (pos) {
        if ((pos /= 0.5) < 1) {return 0.5 * Math.pow(pos,4);}
        return -0.5 * ((pos -= 2) * Math.pow(pos,3) - 2);
      },

      easeFrom: function (pos) {
        return Math.pow(pos,4);
      },

      easeTo: function (pos) {
        return Math.pow(pos,0.25);
      }
    });

  }());

  /*!
   * The Bezier magic in this file is adapted/copied almost wholesale from
   * [Scripty2](https://github.com/madrobby/scripty2/blob/master/src/effects/transitions/cubic-bezier.js),
   * which was adapted from Apple code (which probably came from
   * [here](http://opensource.apple.com/source/WebCore/WebCore-955.66/platform/graphics/UnitBezier.h)).
   * Special thanks to Apple and Thomas Fuchs for much of this code.
   */

  /*!
   *  Copyright (c) 2006 Apple Computer, Inc. All rights reserved.
   *
   *  Redistribution and use in source and binary forms, with or without
   *  modification, are permitted provided that the following conditions are met:
   *
   *  1. Redistributions of source code must retain the above copyright notice,
   *  this list of conditions and the following disclaimer.
   *
   *  2. Redistributions in binary form must reproduce the above copyright notice,
   *  this list of conditions and the following disclaimer in the documentation
   *  and/or other materials provided with the distribution.
   *
   *  3. Neither the name of the copyright holder(s) nor the names of any
   *  contributors may be used to endorse or promote products derived from
   *  this software without specific prior written permission.
   *
   *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
   *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO,
   *  THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
   *  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE
   *  FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
   *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
   *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
   *  ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
   *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
   *  SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
   */
  ;(function () {
    // port of webkit cubic bezier handling by http://www.netzgesta.de/dev/
    function cubicBezierAtTime(t,p1x,p1y,p2x,p2y,duration) {
      var ax = 0,bx = 0,cx = 0,ay = 0,by = 0,cy = 0;
      function sampleCurveX(t) {return ((ax * t + bx) * t + cx) * t;}
      function sampleCurveY(t) {return ((ay * t + by) * t + cy) * t;}
      function sampleCurveDerivativeX(t) {return (3.0 * ax * t + 2.0 * bx) * t + cx;}
      function solveEpsilon(duration) {return 1.0 / (200.0 * duration);}
      function solve(x,epsilon) {return sampleCurveY(solveCurveX(x,epsilon));}
      function fabs(n) {if (n >= 0) {return n;}else {return 0 - n;}}
      function solveCurveX(x,epsilon) {
        var t0,t1,t2,x2,d2,i;
        for (t2 = x, i = 0; i < 8; i++) {x2 = sampleCurveX(t2) - x; if (fabs(x2) < epsilon) {return t2;} d2 = sampleCurveDerivativeX(t2); if (fabs(d2) < 1e-6) {break;} t2 = t2 - x2 / d2;}
        t0 = 0.0; t1 = 1.0; t2 = x; if (t2 < t0) {return t0;} if (t2 > t1) {return t1;}
        while (t0 < t1) {x2 = sampleCurveX(t2); if (fabs(x2 - x) < epsilon) {return t2;} if (x > x2) {t0 = t2;}else {t1 = t2;} t2 = (t1 - t0) * 0.5 + t0;}
        return t2; // Failure.
      }
      cx = 3.0 * p1x; bx = 3.0 * (p2x - p1x) - cx; ax = 1.0 - cx - bx; cy = 3.0 * p1y; by = 3.0 * (p2y - p1y) - cy; ay = 1.0 - cy - by;
      return solve(t, solveEpsilon(duration));
    }
    /*!
     *  getCubicBezierTransition(x1, y1, x2, y2) -> Function
     *
     *  Generates a transition easing function that is compatible
     *  with WebKit's CSS transitions `-webkit-transition-timing-function`
     *  CSS property.
     *
     *  The W3C has more information about
     *  <a href="http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag">
     *  CSS3 transition timing functions</a>.
     *
     *  @param {number} x1
     *  @param {number} y1
     *  @param {number} x2
     *  @param {number} y2
     *  @return {function}
     */
    function getCubicBezierTransition (x1, y1, x2, y2) {
      return function (pos) {
        return cubicBezierAtTime(pos,x1,y1,x2,y2,1);
      };
    }
    // End ported code

    /**
     * Creates a Bezier easing function and attaches it to `Tweenable.prototype.formula`.  This function gives you total control over the easing curve.  Matthew Lein's [Ceaser](http://matthewlein.com/ceaser/) is a useful tool for visualizing the curves you can make with this function.
     *
     * @param {string} name The name of the easing curve.  Overwrites the old easing function on Tweenable.prototype.formula if it exists.
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @return {function} The easing function that was attached to Tweenable.prototype.formula.
     */
    Tweenable.setBezierFunction = function (name, x1, y1, x2, y2) {
      var cubicBezierTransition = getCubicBezierTransition(x1, y1, x2, y2);
      cubicBezierTransition.x1 = x1;
      cubicBezierTransition.y1 = y1;
      cubicBezierTransition.x2 = x2;
      cubicBezierTransition.y2 = y2;

      return Tweenable.prototype.formula[name] = cubicBezierTransition;
    };


    /**
     * `delete`s an easing function from `Tweenable.prototype.formula`.  Be careful with this method, as it `delete`s whatever easing formula matches `name` (which means you can delete default Shifty easing functions).
     *
     * @param {string} name The name of the easing function to delete.
     * @return {function}
     */
    Tweenable.unsetBezierFunction = function (name) {
      delete Tweenable.prototype.formula[name];
    };

  })();

  ;(function () {

    function getInterpolatedValues (
      from, current, targetState, position, easing) {
      return Tweenable.tweenProps(
        position, current, from, targetState, 1, 0, easing);
    }

    // Fake a Tweenable and patch some internals.  This approach allows us to
    // skip uneccessary processing and object recreation, cutting down on garbage
    // collection pauses.
    var mockTweenable = new Tweenable();
    mockTweenable._filterArgs = [];

    /**
     * Compute the midpoint of two Objects.  This method effectively calculates a specific frame of animation that [Tweenable#tween](shifty.core.js.html#tween) does many times over the course of a tween.
     *
     * Example:
     *
     *     var interpolatedValues = Tweenable.interpolate({
     *       width: '100px',
     *       opacity: 0,
     *       color: '#fff'
     *     }, {
     *       width: '200px',
     *       opacity: 1,
     *       color: '#000'
     *     }, 0.5);
     *
     *     console.log(interpolatedValues);
     *     // {opacity: 0.5, width: "150px", color: "rgb(127,127,127)"}
     *
     * @param {Object} from The starting values to tween from.
     * @param {Object} targetState The ending values to tween to.
     * @param {number} position The normalized position value (between 0.0 and 1.0) to interpolate the values between `from` and `to` for.  `from` represents 0 and `to` represents `1`.
     * @param {string|Object} easing The easing curve(s) to calculate the midpoint against.  You can reference any easing function attached to `Tweenable.prototype.formula`.  If omitted, this defaults to "linear".
     * @return {Object}
     */
    Tweenable.interpolate = function (from, targetState, position, easing) {
      var current = Tweenable.shallowCopy({}, from);
      var easingObject = Tweenable.composeEasingObject(
        from, easing || 'linear');

      mockTweenable.set({});

      // Alias and reuse the _filterArgs array instead of recreating it.
      var filterArgs = mockTweenable._filterArgs;
      filterArgs.length = 0;
      filterArgs[0] = current;
      filterArgs[1] = from;
      filterArgs[2] = targetState;
      filterArgs[3] = easingObject;

      // Any defined value transformation must be applied
      Tweenable.applyFilter(mockTweenable, 'tweenCreated');
      Tweenable.applyFilter(mockTweenable, 'beforeTween');

      var interpolatedValues = getInterpolatedValues(
        from, current, targetState, position, easingObject);

      // Transform values back into their original format
      Tweenable.applyFilter(mockTweenable, 'afterTween');

      return interpolatedValues;
    };

  }());

  /**
   * Adds string interpolation support to Shifty.
   *
   * The Token extension allows Shifty to tween numbers inside of strings.  Among
   * other things, this allows you to animate CSS properties.  For example, you
   * can do this:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(45px)'},
   *       to: { transform: 'translateX(90xp)'}
   *     });
   *
   * ` `
   * `translateX(45)` will be tweened to `translateX(90)`.  To demonstrate:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(45px)'},
   *       to: { transform: 'translateX(90px)'},
   *       step: function (state) {
   *         console.log(state.transform);
   *       }
   *     });
   *
   * ` `
   * The above snippet will log something like this in the console:
   *
   *     translateX(60.3px)
   *     ...
   *     translateX(76.05px)
   *     ...
   *     translateX(90px)
   *
   * ` `
   * Another use for this is animating colors:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { color: 'rgb(0,255,0)'},
   *       to: { color: 'rgb(255,0,255)'},
   *       step: function (state) {
   *         console.log(state.color);
   *       }
   *     });
   *
   * ` `
   * The above snippet will log something like this:
   *
   *     rgb(84,170,84)
   *     ...
   *     rgb(170,84,170)
   *     ...
   *     rgb(255,0,255)
   *
   * ` `
   * This extension also supports hexadecimal colors, in both long (`#ff00ff`)
   * and short (`#f0f`) forms.  Be aware that hexadecimal input values will be
   * converted into the equivalent RGB output values.  This is done to optimize
   * for performance.
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { color: '#0f0'},
   *       to: { color: '#f0f'},
   *       step: function (state) {
   *         console.log(state.color);
   *       }
   *     });
   *
   * ` `
   * This snippet will generate the same output as the one before it because
   * equivalent values were supplied (just in hexadecimal form rather than RGB):
   *
   *     rgb(84,170,84)
   *     ...
   *     rgb(170,84,170)
   *     ...
   *     rgb(255,0,255)
   *
   * ` `
   * ` `
   * ## Easing support
   *
   * Easing works somewhat differently in the Token extension.  This is because
   * some CSS properties have multiple values in them, and you might need to
   * tween each value along its own easing curve.  A basic example:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(0px) translateY(0px)'},
   *       to: { transform:   'translateX(100px) translateY(100px)'},
   *       easing: { transform: 'easeInQuad' },
   *       step: function (state) {
   *         console.log(state.transform);
   *       }
   *     });
   *
   * ` `
   * The above snippet create values like this:
   *
   *     translateX(11.560000000000002px) translateY(11.560000000000002px)
   *     ...
   *     translateX(46.24000000000001px) translateY(46.24000000000001px)
   *     ...
   *     translateX(100px) translateY(100px)
   *
   * ` `
   * In this case, the values for `translateX` and `translateY` are always the
   * same for each step of the tween, because they have the same start and end
   * points and both use the same easing curve.  We can also tween `translateX`
   * and `translateY` along independent curves:
   *
   *     var tweenable = new Tweenable();
   *     tweenable.tween({
   *       from: { transform: 'translateX(0px) translateY(0px)'},
   *       to: { transform:   'translateX(100px) translateY(100px)'},
   *       easing: { transform: 'easeInQuad bounce' },
   *       step: function (state) {
   *         console.log(state.transform);
   *       }
   *     });
   *
   * ` `
   * The above snippet create values like this:
   *
   *     translateX(10.89px) translateY(82.355625px)
   *     ...
   *     translateX(44.89000000000001px) translateY(86.73062500000002px)
   *     ...
   *     translateX(100px) translateY(100px)
   *
   * ` `
   * `translateX` and `translateY` are not in sync anymore, because `easeInQuad`
   * was specified for `translateX` and `bounce` for `translateY`.  Mixing and
   * matching easing curves can make for some interesting motion in your
   * animations.
   *
   * The order of the space-separated easing curves correspond the token values
   * they apply to.  If there are more token values than easing curves listed,
   * the last easing curve listed is used.
   */
  function token () {
    // Functionality for this extension runs implicitly if it is loaded.
  } /*!*/

  // token function is defined above only so that dox-foundation sees it as
  // documentation and renders it.  It is never used, and is optimized away at
  // build time.

  ;(function (Tweenable) {

    /*!
     * @typedef {{
     *   formatString: string
     *   chunkNames: Array.<string>
     * }}
     */
    var formatManifest;

    // CONSTANTS

    var R_NUMBER_COMPONENT = /(\d|\-|\.)/;
    var R_FORMAT_CHUNKS = /([^\-0-9\.]+)/g;
    var R_UNFORMATTED_VALUES = /[0-9.\-]+/g;
    var R_RGB = new RegExp(
      'rgb\\(' + R_UNFORMATTED_VALUES.source +
      (/,\s*/.source) + R_UNFORMATTED_VALUES.source +
      (/,\s*/.source) + R_UNFORMATTED_VALUES.source + '\\)', 'g');
    var R_RGB_PREFIX = /^.*\(/;
    var R_HEX = /#([0-9]|[a-f]){3,6}/gi;
    var VALUE_PLACEHOLDER = 'VAL';

    // HELPERS

    var getFormatChunksFrom_accumulator = [];
    /*!
     * @param {Array.number} rawValues
     * @param {string} prefix
     *
     * @return {Array.<string>}
     */
    function getFormatChunksFrom (rawValues, prefix) {
      getFormatChunksFrom_accumulator.length = 0;

      var rawValuesLength = rawValues.length;
      var i;

      for (i = 0; i < rawValuesLength; i++) {
        getFormatChunksFrom_accumulator.push('_' + prefix + '_' + i);
      }

      return getFormatChunksFrom_accumulator;
    }

    /*!
     * @param {string} formattedString
     *
     * @return {string}
     */
    function getFormatStringFrom (formattedString) {
      var chunks = formattedString.match(R_FORMAT_CHUNKS);

      if (!chunks) {
        // chunks will be null if there were no tokens to parse in
        // formattedString (for example, if formattedString is '2').  Coerce
        // chunks to be useful here.
        chunks = ['', ''];

        // If there is only one chunk, assume that the string is a number
        // followed by a token...
        // NOTE: This may be an unwise assumption.
      } else if (chunks.length === 1 ||
          // ...or if the string starts with a number component (".", "-", or a
          // digit)...
          formattedString[0].match(R_NUMBER_COMPONENT)) {
        // ...prepend an empty string here to make sure that the formatted number
        // is properly replaced by VALUE_PLACEHOLDER
        chunks.unshift('');
      }

      return chunks.join(VALUE_PLACEHOLDER);
    }

    /*!
     * Convert all hex color values within a string to an rgb string.
     *
     * @param {Object} stateObject
     *
     * @return {Object} The modified obj
     */
    function sanitizeObjectForHexProps (stateObject) {
      Tweenable.each(stateObject, function (prop) {
        var currentProp = stateObject[prop];

        if (typeof currentProp === 'string' && currentProp.match(R_HEX)) {
          stateObject[prop] = sanitizeHexChunksToRGB(currentProp);
        }
      });
    }

    /*!
     * @param {string} str
     *
     * @return {string}
     */
    function  sanitizeHexChunksToRGB (str) {
      return filterStringChunks(R_HEX, str, convertHexToRGB);
    }

    /*!
     * @param {string} hexString
     *
     * @return {string}
     */
    function convertHexToRGB (hexString) {
      var rgbArr = hexToRGBArray(hexString);
      return 'rgb(' + rgbArr[0] + ',' + rgbArr[1] + ',' + rgbArr[2] + ')';
    }

    var hexToRGBArray_returnArray = [];
    /*!
     * Convert a hexadecimal string to an array with three items, one each for
     * the red, blue, and green decimal values.
     *
     * @param {string} hex A hexadecimal string.
     *
     * @returns {Array.<number>} The converted Array of RGB values if `hex` is a
     * valid string, or an Array of three 0's.
     */
    function hexToRGBArray (hex) {

      hex = hex.replace(/#/, '');

      // If the string is a shorthand three digit hex notation, normalize it to
      // the standard six digit notation
      if (hex.length === 3) {
        hex = hex.split('');
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
      }

      hexToRGBArray_returnArray[0] = hexToDec(hex.substr(0, 2));
      hexToRGBArray_returnArray[1] = hexToDec(hex.substr(2, 2));
      hexToRGBArray_returnArray[2] = hexToDec(hex.substr(4, 2));

      return hexToRGBArray_returnArray;
    }

    /*!
     * Convert a base-16 number to base-10.
     *
     * @param {Number|String} hex The value to convert
     *
     * @returns {Number} The base-10 equivalent of `hex`.
     */
    function hexToDec (hex) {
      return parseInt(hex, 16);
    }

    /*!
     * Runs a filter operation on all chunks of a string that match a RegExp
     *
     * @param {RegExp} pattern
     * @param {string} unfilteredString
     * @param {function(string)} filter
     *
     * @return {string}
     */
    function filterStringChunks (pattern, unfilteredString, filter) {
      var pattenMatches = unfilteredString.match(pattern);
      var filteredString = unfilteredString.replace(pattern, VALUE_PLACEHOLDER);

      if (pattenMatches) {
        var pattenMatchesLength = pattenMatches.length;
        var currentChunk;

        for (var i = 0; i < pattenMatchesLength; i++) {
          currentChunk = pattenMatches.shift();
          filteredString = filteredString.replace(
            VALUE_PLACEHOLDER, filter(currentChunk));
        }
      }

      return filteredString;
    }

    /*!
     * Check for floating point values within rgb strings and rounds them.
     *
     * @param {string} formattedString
     *
     * @return {string}
     */
    function sanitizeRGBChunks (formattedString) {
      return filterStringChunks(R_RGB, formattedString, sanitizeRGBChunk);
    }

    /*!
     * @param {string} rgbChunk
     *
     * @return {string}
     */
    function sanitizeRGBChunk (rgbChunk) {
      var numbers = rgbChunk.match(R_UNFORMATTED_VALUES);
      var numbersLength = numbers.length;
      var sanitizedString = rgbChunk.match(R_RGB_PREFIX)[0];

      for (var i = 0; i < numbersLength; i++) {
        sanitizedString += parseInt(numbers[i], 10) + ',';
      }

      sanitizedString = sanitizedString.slice(0, -1) + ')';

      return sanitizedString;
    }

    /*!
     * @param {Object} stateObject
     *
     * @return {Object} An Object of formatManifests that correspond to
     * the string properties of stateObject
     */
    function getFormatManifests (stateObject) {
      var manifestAccumulator = {};

      Tweenable.each(stateObject, function (prop) {
        var currentProp = stateObject[prop];

        if (typeof currentProp === 'string') {
          var rawValues = getValuesFrom(currentProp);

          manifestAccumulator[prop] = {
            'formatString': getFormatStringFrom(currentProp)
            ,'chunkNames': getFormatChunksFrom(rawValues, prop)
          };
        }
      });

      return manifestAccumulator;
    }

    /*!
     * @param {Object} stateObject
     * @param {Object} formatManifests
     */
    function expandFormattedProperties (stateObject, formatManifests) {
      Tweenable.each(formatManifests, function (prop) {
        var currentProp = stateObject[prop];
        var rawValues = getValuesFrom(currentProp);
        var rawValuesLength = rawValues.length;

        for (var i = 0; i < rawValuesLength; i++) {
          stateObject[formatManifests[prop].chunkNames[i]] = +rawValues[i];
        }

        delete stateObject[prop];
      });
    }

    /*!
     * @param {Object} stateObject
     * @param {Object} formatManifests
     */
    function collapseFormattedProperties (stateObject, formatManifests) {
      Tweenable.each(formatManifests, function (prop) {
        var currentProp = stateObject[prop];
        var formatChunks = extractPropertyChunks(
          stateObject, formatManifests[prop].chunkNames);
        var valuesList = getValuesList(
          formatChunks, formatManifests[prop].chunkNames);
        currentProp = getFormattedValues(
          formatManifests[prop].formatString, valuesList);
        stateObject[prop] = sanitizeRGBChunks(currentProp);
      });
    }

    /*!
     * @param {Object} stateObject
     * @param {Array.<string>} chunkNames
     *
     * @return {Object} The extracted value chunks.
     */
    function extractPropertyChunks (stateObject, chunkNames) {
      var extractedValues = {};
      var currentChunkName, chunkNamesLength = chunkNames.length;

      for (var i = 0; i < chunkNamesLength; i++) {
        currentChunkName = chunkNames[i];
        extractedValues[currentChunkName] = stateObject[currentChunkName];
        delete stateObject[currentChunkName];
      }

      return extractedValues;
    }

    var getValuesList_accumulator = [];
    /*!
     * @param {Object} stateObject
     * @param {Array.<string>} chunkNames
     *
     * @return {Array.<number>}
     */
    function getValuesList (stateObject, chunkNames) {
      getValuesList_accumulator.length = 0;
      var chunkNamesLength = chunkNames.length;

      for (var i = 0; i < chunkNamesLength; i++) {
        getValuesList_accumulator.push(stateObject[chunkNames[i]]);
      }

      return getValuesList_accumulator;
    }

    /*!
     * @param {string} formatString
     * @param {Array.<number>} rawValues
     *
     * @return {string}
     */
    function getFormattedValues (formatString, rawValues) {
      var formattedValueString = formatString;
      var rawValuesLength = rawValues.length;

      for (var i = 0; i < rawValuesLength; i++) {
        formattedValueString = formattedValueString.replace(
          VALUE_PLACEHOLDER, +rawValues[i].toFixed(4));
      }

      return formattedValueString;
    }

    /*!
     * Note: It's the duty of the caller to convert the Array elements of the
     * return value into numbers.  This is a performance optimization.
     *
     * @param {string} formattedString
     *
     * @return {Array.<string>|null}
     */
    function getValuesFrom (formattedString) {
      return formattedString.match(R_UNFORMATTED_VALUES);
    }

    /*!
     * @param {Object} easingObject
     * @param {Object} tokenData
     */
    function expandEasingObject (easingObject, tokenData) {
      Tweenable.each(tokenData, function (prop) {
        var currentProp = tokenData[prop];
        var chunkNames = currentProp.chunkNames;
        var chunkLength = chunkNames.length;
        var easingChunks = easingObject[prop].split(' ');
        var lastEasingChunk = easingChunks[easingChunks.length - 1];

        for (var i = 0; i < chunkLength; i++) {
          easingObject[chunkNames[i]] = easingChunks[i] || lastEasingChunk;
        }

        delete easingObject[prop];
      });
    }

    /*!
     * @param {Object} easingObject
     * @param {Object} tokenData
     */
    function collapseEasingObject (easingObject, tokenData) {
      Tweenable.each(tokenData, function (prop) {
        var currentProp = tokenData[prop];
        var chunkNames = currentProp.chunkNames;
        var chunkLength = chunkNames.length;
        var composedEasingString = '';

        for (var i = 0; i < chunkLength; i++) {
          composedEasingString += ' ' + easingObject[chunkNames[i]];
          delete easingObject[chunkNames[i]];
        }

        easingObject[prop] = composedEasingString.substr(1);
      });
    }

    Tweenable.prototype.filter.token = {
      'tweenCreated': function (currentState, fromState, toState, easingObject) {
        sanitizeObjectForHexProps(currentState);
        sanitizeObjectForHexProps(fromState);
        sanitizeObjectForHexProps(toState);
        this._tokenData = getFormatManifests(currentState);
      },

      'beforeTween': function (currentState, fromState, toState, easingObject) {
        expandEasingObject(easingObject, this._tokenData);
        expandFormattedProperties(currentState, this._tokenData);
        expandFormattedProperties(fromState, this._tokenData);
        expandFormattedProperties(toState, this._tokenData);
      },

      'afterTween': function (currentState, fromState, toState, easingObject) {
        collapseFormattedProperties(currentState, this._tokenData);
        collapseFormattedProperties(fromState, this._tokenData);
        collapseFormattedProperties(toState, this._tokenData);
        collapseEasingObject(easingObject, this._tokenData);
      }
    };

  } (Tweenable));

  }(window));

  return window.Tweenable;
});

(function() {
    "use strict";

    angular.module('angular-carousel')

    .filter('carouselSlice', function() {
        return function(collection, start, size) {
            if (angular.isArray(collection)) {
                return collection.slice(start, start + size);
            } else if (angular.isObject(collection)) {
                // dont try to slice collections :)
                return collection;
            }
        };
    });

})();

},{}],2:[function(require,module,exports){
require('./src/angular-local-storage.js');
module.exports = 'LocalStorageModule';

},{"./src/angular-local-storage.js":3}],3:[function(require,module,exports){
var isDefined = angular.isDefined,
  isUndefined = angular.isUndefined,
  isNumber = angular.isNumber,
  isObject = angular.isObject,
  isArray = angular.isArray,
  extend = angular.extend,
  toJson = angular.toJson;

angular
  .module('LocalStorageModule', [])
  .provider('localStorageService', function() {
    // You should set a prefix to avoid overwriting any local storage variables from the rest of your app
    // e.g. localStorageServiceProvider.setPrefix('yourAppName');
    // With provider you can use config as this:
    // myApp.config(function (localStorageServiceProvider) {
    //    localStorageServiceProvider.prefix = 'yourAppName';
    // });
    this.prefix = 'ls';

    // You could change web storage type localstorage or sessionStorage
    this.storageType = 'localStorage';

    // Cookie options (usually in case of fallback)
    // expiry = Number of days before cookies expire // 0 = Does not expire
    // path = The web path the cookie represents
    this.cookie = {
      expiry: 30,
      path: '/'
    };

    // Send signals for each of the following actions?
    this.notify = {
      setItem: true,
      removeItem: false
    };

    // Setter for the prefix
    this.setPrefix = function(prefix) {
      this.prefix = prefix;
      return this;
    };

    // Setter for the storageType
    this.setStorageType = function(storageType) {
      this.storageType = storageType;
      return this;
    };

    // Setter for cookie config
    this.setStorageCookie = function(exp, path) {
      this.cookie.expiry = exp;
      this.cookie.path = path;
      return this;
    };

    // Setter for cookie domain
    this.setStorageCookieDomain = function(domain) {
      this.cookie.domain = domain;
      return this;
    };

    // Setter for notification config
    // itemSet & itemRemove should be booleans
    this.setNotify = function(itemSet, itemRemove) {
      this.notify = {
        setItem: itemSet,
        removeItem: itemRemove
      };
      return this;
    };

    this.$get = ['$rootScope', '$window', '$document', '$parse', function($rootScope, $window, $document, $parse) {
      var self = this;
      var prefix = self.prefix;
      var cookie = self.cookie;
      var notify = self.notify;
      var storageType = self.storageType;
      var webStorage;

      // When Angular's $document is not available
      if (!$document) {
        $document = document;
      } else if ($document[0]) {
        $document = $document[0];
      }

      // If there is a prefix set in the config lets use that with an appended period for readability
      if (prefix.substr(-1) !== '.') {
        prefix = !!prefix ? prefix + '.' : '';
      }
      var deriveQualifiedKey = function(key) {
        return prefix + key;
      };
      // Checks the browser to see if local storage is supported
      var browserSupportsLocalStorage = (function () {
        try {
          var supported = (storageType in $window && $window[storageType] !== null);

          // When Safari (OS X or iOS) is in private browsing mode, it appears as though localStorage
          // is available, but trying to call .setItem throws an exception.
          //
          // "QUOTA_EXCEEDED_ERR: DOM Exception 22: An attempt was made to add something to storage
          // that exceeded the quota."
          var key = deriveQualifiedKey('__' + Math.round(Math.random() * 1e7));
          if (supported) {
            webStorage = $window[storageType];
            webStorage.setItem(key, '');
            webStorage.removeItem(key);
          }

          return supported;
        } catch (e) {
          storageType = 'cookie';
          $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
          return false;
        }
      }());

      // Directly adds a value to local storage
      // If local storage is not available in the browser use cookies
      // Example use: localStorageService.add('library','angular');
      var addToLocalStorage = function (key, value) {
        // Let's convert undefined values to null to get the value consistent
        if (isUndefined(value)) {
          value = null;
        } else {
          value = toJson(value);
        }

        // If this browser does not support local storage use cookies
        if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
          if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
          }

          if (notify.setItem) {
            $rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: 'cookie'});
          }
          return addToCookies(key, value);
        }

        try {
          if (webStorage) {
            webStorage.setItem(deriveQualifiedKey(key), value);
          }
          if (notify.setItem) {
            $rootScope.$broadcast('LocalStorageModule.notification.setitem', {key: key, newvalue: value, storageType: self.storageType});
          }
        } catch (e) {
          $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
          return addToCookies(key, value);
        }
        return true;
      };

      // Directly get a value from local storage
      // Example use: localStorageService.get('library'); // returns 'angular'
      var getFromLocalStorage = function (key) {

        if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
          if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning','LOCAL_STORAGE_NOT_SUPPORTED');
          }

          return getFromCookies(key);
        }

        var item = webStorage ? webStorage.getItem(deriveQualifiedKey(key)) : null;
        // angular.toJson will convert null to 'null', so a proper conversion is needed
        // FIXME not a perfect solution, since a valid 'null' string can't be stored
        if (!item || item === 'null') {
          return null;
        }

        try {
          return JSON.parse(item);
        } catch (e) {
          return item;
        }
      };

      // Remove an item from local storage
      // Example use: localStorageService.remove('library'); // removes the key/value pair of library='angular'
      var removeFromLocalStorage = function () {
        var i, key;
        for (i=0; i<arguments.length; i++) {
          key = arguments[i];
          if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
            if (!browserSupportsLocalStorage) {
              $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
            }

            if (notify.removeItem) {
              $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {key: key, storageType: 'cookie'});
            }
            removeFromCookies(key);
          }
          else {
            try {
              webStorage.removeItem(deriveQualifiedKey(key));
              if (notify.removeItem) {
                $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {
                  key: key,
                  storageType: self.storageType
                });
              }
            } catch (e) {
              $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
              removeFromCookies(key);
            }
          }
        }
      };

      // Return array of keys for local storage
      // Example use: var keys = localStorageService.keys()
      var getKeysForLocalStorage = function () {

        if (!browserSupportsLocalStorage) {
          $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
          return false;
        }

        var prefixLength = prefix.length;
        var keys = [];
        for (var key in webStorage) {
          // Only return keys that are for this app
          if (key.substr(0,prefixLength) === prefix) {
            try {
              keys.push(key.substr(prefixLength));
            } catch (e) {
              $rootScope.$broadcast('LocalStorageModule.notification.error', e.Description);
              return [];
            }
          }
        }
        return keys;
      };

      // Remove all data for this app from local storage
      // Also optionally takes a regular expression string and removes the matching key-value pairs
      // Example use: localStorageService.clearAll();
      // Should be used mostly for development purposes
      var clearAllFromLocalStorage = function (regularExpression) {

        // Setting both regular expressions independently
        // Empty strings result in catchall RegExp
        var prefixRegex = !!prefix ? new RegExp('^' + prefix) : new RegExp();
        var testRegex = !!regularExpression ? new RegExp(regularExpression) : new RegExp();

        if (!browserSupportsLocalStorage || self.storageType === 'cookie') {
          if (!browserSupportsLocalStorage) {
            $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
          }
          return clearAllFromCookies();
        }

        var prefixLength = prefix.length;

        for (var key in webStorage) {
          // Only remove items that are for this app and match the regular expression
          if (prefixRegex.test(key) && testRegex.test(key.substr(prefixLength))) {
            try {
              removeFromLocalStorage(key.substr(prefixLength));
            } catch (e) {
              $rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
              return clearAllFromCookies();
            }
          }
        }
        return true;
      };

      // Checks the browser to see if cookies are supported
      var browserSupportsCookies = (function() {
        try {
          return $window.navigator.cookieEnabled ||
          ("cookie" in $document && ($document.cookie.length > 0 ||
            ($document.cookie = "test").indexOf.call($document.cookie, "test") > -1));
          } catch (e) {
            $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
            return false;
          }
        }());

        // Directly adds a value to cookies
        // Typically used as a fallback is local storage is not available in the browser
        // Example use: localStorageService.cookie.add('library','angular');
        var addToCookies = function (key, value, daysToExpiry) {

          if (isUndefined(value)) {
            return false;
          } else if(isArray(value) || isObject(value)) {
            value = toJson(value);
          }

          if (!browserSupportsCookies) {
            $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
            return false;
          }

          try {
            var expiry = '',
            expiryDate = new Date(),
            cookieDomain = '';

            if (value === null) {
              // Mark that the cookie has expired one day ago
              expiryDate.setTime(expiryDate.getTime() + (-1 * 24 * 60 * 60 * 1000));
              expiry = "; expires=" + expiryDate.toGMTString();
              value = '';
            } else if (isNumber(daysToExpiry) && daysToExpiry !== 0) {
              expiryDate.setTime(expiryDate.getTime() + (daysToExpiry * 24 * 60 * 60 * 1000));
              expiry = "; expires=" + expiryDate.toGMTString();
            } else if (cookie.expiry !== 0) {
              expiryDate.setTime(expiryDate.getTime() + (cookie.expiry * 24 * 60 * 60 * 1000));
              expiry = "; expires=" + expiryDate.toGMTString();
            }
            if (!!key) {
              var cookiePath = "; path=" + cookie.path;
              if(cookie.domain){
                cookieDomain = "; domain=" + cookie.domain;
              }
              $document.cookie = deriveQualifiedKey(key) + "=" + encodeURIComponent(value) + expiry + cookiePath + cookieDomain;
            }
          } catch (e) {
            $rootScope.$broadcast('LocalStorageModule.notification.error',e.message);
            return false;
          }
          return true;
        };

        // Directly get a value from a cookie
        // Example use: localStorageService.cookie.get('library'); // returns 'angular'
        var getFromCookies = function (key) {
          if (!browserSupportsCookies) {
            $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
            return false;
          }

          var cookies = $document.cookie && $document.cookie.split(';') || [];
          for(var i=0; i < cookies.length; i++) {
            var thisCookie = cookies[i];
            while (thisCookie.charAt(0) === ' ') {
              thisCookie = thisCookie.substring(1,thisCookie.length);
            }
            if (thisCookie.indexOf(deriveQualifiedKey(key) + '=') === 0) {
              var storedValues = decodeURIComponent(thisCookie.substring(prefix.length + key.length + 1, thisCookie.length));
              try {
                return JSON.parse(storedValues);
              } catch(e) {
                return storedValues;
              }
            }
          }
          return null;
        };

        var removeFromCookies = function (key) {
          addToCookies(key,null);
        };

        var clearAllFromCookies = function () {
          var thisCookie = null, thisKey = null;
          var prefixLength = prefix.length;
          var cookies = $document.cookie.split(';');
          for(var i = 0; i < cookies.length; i++) {
            thisCookie = cookies[i];

            while (thisCookie.charAt(0) === ' ') {
              thisCookie = thisCookie.substring(1, thisCookie.length);
            }

            var key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));
            removeFromCookies(key);
          }
        };

        var getStorageType = function() {
          return storageType;
        };

        // Add a listener on scope variable to save its changes to local storage
        // Return a function which when called cancels binding
        var bindToScope = function(scope, key, def, lsKey) {
          lsKey = lsKey || key;
          var value = getFromLocalStorage(lsKey);

          if (value === null && isDefined(def)) {
            value = def;
          } else if (isObject(value) && isObject(def)) {
            value = extend(value, def);
          }

          $parse(key).assign(scope, value);

          return scope.$watch(key, function(newVal) {
            addToLocalStorage(lsKey, newVal);
          }, isObject(scope[key]));
        };

        // Return localStorageService.length
        // ignore keys that not owned
        var lengthOfLocalStorage = function() {
          var count = 0;
          var storage = $window[storageType];
          for(var i = 0; i < storage.length; i++) {
            if(storage.key(i).indexOf(prefix) === 0 ) {
              count++;
            }
          }
          return count;
        };

        return {
          isSupported: browserSupportsLocalStorage,
          getStorageType: getStorageType,
          set: addToLocalStorage,
          add: addToLocalStorage, //DEPRECATED
          get: getFromLocalStorage,
          keys: getKeysForLocalStorage,
          remove: removeFromLocalStorage,
          clearAll: clearAllFromLocalStorage,
          bind: bindToScope,
          deriveKey: deriveQualifiedKey,
          length: lengthOfLocalStorage,
          cookie: {
            isSupported: browserSupportsCookies,
            set: addToCookies,
            add: addToCookies, //DEPRECATED
            get: getFromCookies,
            remove: removeFromCookies,
            clearAll: clearAllFromCookies
          }
        };
      }];
  });

},{}],4:[function(require,module,exports){
/**
 * @license AngularJS v1.5.3
 * (c) 2010-2016 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

/* global ngTouchClickDirectiveFactory: false,
 */

/**
 * @ngdoc module
 * @name ngTouch
 * @description
 *
 * # ngTouch
 *
 * The `ngTouch` module provides touch events and other helpers for touch-enabled devices.
 * The implementation is based on jQuery Mobile touch event handling
 * ([jquerymobile.com](http://jquerymobile.com/)).
 *
 *
 * See {@link ngTouch.$swipe `$swipe`} for usage.
 *
 * <div doc-module-components="ngTouch"></div>
 *
 */

// define ngTouch module
/* global -ngTouch */
var ngTouch = angular.module('ngTouch', []);

ngTouch.provider('$touch', $TouchProvider);

function nodeName_(element) {
  return angular.lowercase(element.nodeName || (element[0] && element[0].nodeName));
}

/**
 * @ngdoc provider
 * @name $touchProvider
 *
 * @description
 * The `$touchProvider` allows enabling / disabling {@link ngTouch.ngClick ngTouch's ngClick directive}.
 */
$TouchProvider.$inject = ['$provide', '$compileProvider'];
function $TouchProvider($provide, $compileProvider) {

  /**
   * @ngdoc method
   * @name  $touchProvider#ngClickOverrideEnabled
   *
   * @param {boolean=} enabled update the ngClickOverrideEnabled state if provided, otherwise just return the
   * current ngClickOverrideEnabled state
   * @returns {*} current value if used as getter or itself (chaining) if used as setter
   *
   * @kind function
   *
   * @description
   * Call this method to enable/disable {@link ngTouch.ngClick ngTouch's ngClick directive}. If enabled,
   * the default ngClick directive will be replaced by a version that eliminates the 300ms delay for
   * click events on browser for touch-devices.
   *
   * The default is `false`.
   *
   */
  var ngClickOverrideEnabled = false;
  var ngClickDirectiveAdded = false;
  this.ngClickOverrideEnabled = function(enabled) {
    if (angular.isDefined(enabled)) {

      if (enabled && !ngClickDirectiveAdded) {
        ngClickDirectiveAdded = true;

        // Use this to identify the correct directive in the delegate
        ngTouchClickDirectiveFactory.$$moduleName = 'ngTouch';
        $compileProvider.directive('ngClick', ngTouchClickDirectiveFactory);

        $provide.decorator('ngClickDirective', ['$delegate', function($delegate) {
          if (ngClickOverrideEnabled) {
            // drop the default ngClick directive
            $delegate.shift();
          } else {
            // drop the ngTouch ngClick directive if the override has been re-disabled (because
            // we cannot de-register added directives)
            var i = $delegate.length - 1;
            while (i >= 0) {
              if ($delegate[i].$$moduleName === 'ngTouch') {
                $delegate.splice(i, 1);
                break;
              }
              i--;
            }
          }

          return $delegate;
        }]);
      }

      ngClickOverrideEnabled = enabled;
      return this;
    }

    return ngClickOverrideEnabled;
  };

  /**
  * @ngdoc service
  * @name $touch
  * @kind object
  *
  * @description
  * Provides the {@link ngTouch.$touch#ngClickOverrideEnabled `ngClickOverrideEnabled`} method.
  *
  */
  this.$get = function() {
    return {
      /**
       * @ngdoc method
       * @name  $touch#ngClickOverrideEnabled
       *
       * @returns {*} current value of `ngClickOverrideEnabled` set in the {@link ngTouch.$touchProvider $touchProvider},
       * i.e. if {@link ngTouch.ngClick ngTouch's ngClick} directive is enabled.
       *
       * @kind function
       */
      ngClickOverrideEnabled: function() {
        return ngClickOverrideEnabled;
      }
    };
  };

}

/* global ngTouch: false */

    /**
     * @ngdoc service
     * @name $swipe
     *
     * @description
     * The `$swipe` service is a service that abstracts the messier details of hold-and-drag swipe
     * behavior, to make implementing swipe-related directives more convenient.
     *
     * Requires the {@link ngTouch `ngTouch`} module to be installed.
     *
     * `$swipe` is used by the `ngSwipeLeft` and `ngSwipeRight` directives in `ngTouch`.
     *
     * # Usage
     * The `$swipe` service is an object with a single method: `bind`. `bind` takes an element
     * which is to be watched for swipes, and an object with four handler functions. See the
     * documentation for `bind` below.
     */

ngTouch.factory('$swipe', [function() {
  // The total distance in any direction before we make the call on swipe vs. scroll.
  var MOVE_BUFFER_RADIUS = 10;

  var POINTER_EVENTS = {
    'mouse': {
      start: 'mousedown',
      move: 'mousemove',
      end: 'mouseup'
    },
    'touch': {
      start: 'touchstart',
      move: 'touchmove',
      end: 'touchend',
      cancel: 'touchcancel'
    }
  };

  function getCoordinates(event) {
    var originalEvent = event.originalEvent || event;
    var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
    var e = (originalEvent.changedTouches && originalEvent.changedTouches[0]) || touches[0];

    return {
      x: e.clientX,
      y: e.clientY
    };
  }

  function getEvents(pointerTypes, eventType) {
    var res = [];
    angular.forEach(pointerTypes, function(pointerType) {
      var eventName = POINTER_EVENTS[pointerType][eventType];
      if (eventName) {
        res.push(eventName);
      }
    });
    return res.join(' ');
  }

  return {
    /**
     * @ngdoc method
     * @name $swipe#bind
     *
     * @description
     * The main method of `$swipe`. It takes an element to be watched for swipe motions, and an
     * object containing event handlers.
     * The pointer types that should be used can be specified via the optional
     * third argument, which is an array of strings `'mouse'` and `'touch'`. By default,
     * `$swipe` will listen for `mouse` and `touch` events.
     *
     * The four events are `start`, `move`, `end`, and `cancel`. `start`, `move`, and `end`
     * receive as a parameter a coordinates object of the form `{ x: 150, y: 310 }` and the raw
     * `event`. `cancel` receives the raw `event` as its single parameter.
     *
     * `start` is called on either `mousedown` or `touchstart`. After this event, `$swipe` is
     * watching for `touchmove` or `mousemove` events. These events are ignored until the total
     * distance moved in either dimension exceeds a small threshold.
     *
     * Once this threshold is exceeded, either the horizontal or vertical delta is greater.
     * - If the horizontal distance is greater, this is a swipe and `move` and `end` events follow.
     * - If the vertical distance is greater, this is a scroll, and we let the browser take over.
     *   A `cancel` event is sent.
     *
     * `move` is called on `mousemove` and `touchmove` after the above logic has determined that
     * a swipe is in progress.
     *
     * `end` is called when a swipe is successfully completed with a `touchend` or `mouseup`.
     *
     * `cancel` is called either on a `touchcancel` from the browser, or when we begin scrolling
     * as described above.
     *
     */
    bind: function(element, eventHandlers, pointerTypes) {
      // Absolute total movement, used to control swipe vs. scroll.
      var totalX, totalY;
      // Coordinates of the start position.
      var startCoords;
      // Last event's position.
      var lastPos;
      // Whether a swipe is active.
      var active = false;

      pointerTypes = pointerTypes || ['mouse', 'touch'];
      element.on(getEvents(pointerTypes, 'start'), function(event) {
        startCoords = getCoordinates(event);
        active = true;
        totalX = 0;
        totalY = 0;
        lastPos = startCoords;
        eventHandlers['start'] && eventHandlers['start'](startCoords, event);
      });
      var events = getEvents(pointerTypes, 'cancel');
      if (events) {
        element.on(events, function(event) {
          active = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
        });
      }

      element.on(getEvents(pointerTypes, 'move'), function(event) {
        if (!active) return;

        // Android will send a touchcancel if it thinks we're starting to scroll.
        // So when the total distance (+ or - or both) exceeds 10px in either direction,
        // we either:
        // - On totalX > totalY, we send preventDefault() and treat this as a swipe.
        // - On totalY > totalX, we let the browser handle it as a scroll.

        if (!startCoords) return;
        var coords = getCoordinates(event);

        totalX += Math.abs(coords.x - lastPos.x);
        totalY += Math.abs(coords.y - lastPos.y);

        lastPos = coords;

        if (totalX < MOVE_BUFFER_RADIUS && totalY < MOVE_BUFFER_RADIUS) {
          return;
        }

        // One of totalX or totalY has exceeded the buffer, so decide on swipe vs. scroll.
        if (totalY > totalX) {
          // Allow native scrolling to take over.
          active = false;
          eventHandlers['cancel'] && eventHandlers['cancel'](event);
          return;
        } else {
          // Prevent the browser from scrolling.
          event.preventDefault();
          eventHandlers['move'] && eventHandlers['move'](coords, event);
        }
      });

      element.on(getEvents(pointerTypes, 'end'), function(event) {
        if (!active) return;
        active = false;
        eventHandlers['end'] && eventHandlers['end'](getCoordinates(event), event);
      });
    }
  };
}]);

/* global ngTouch: false,
  nodeName_: false
*/

/**
 * @ngdoc directive
 * @name ngClick
 * @deprecated
 *
 * @description
 * <div class="alert alert-danger">
 * **DEPRECATION NOTICE**: Beginning with Angular 1.5, this directive is deprecated and by default **disabled**.
 * The directive will receive no further support and might be removed from future releases.
 * If you need the directive, you can enable it with the {@link ngTouch.$touchProvider $touchProvider#ngClickOverrideEnabled}
 * function. We also recommend that you migrate to [FastClick](https://github.com/ftlabs/fastclick).
 * To learn more about the 300ms delay, this [Telerik article](http://developer.telerik.com/featured/300-ms-click-delay-ios-8/)
 * gives a good overview.
 * </div>
 * A more powerful replacement for the default ngClick designed to be used on touchscreen
 * devices. Most mobile browsers wait about 300ms after a tap-and-release before sending
 * the click event. This version handles them immediately, and then prevents the
 * following click event from propagating.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * This directive can fall back to using an ordinary click event, and so works on desktop
 * browsers as well as mobile.
 *
 * This directive also sets the CSS class `ng-click-active` while the element is being held
 * down (by a mouse click or touch) so you can restyle the depressed element if you wish.
 *
 * @element ANY
 * @param {expression} ngClick {@link guide/expression Expression} to evaluate
 * upon tap. (Event object is available as `$event`)
 *
 * @example
    <example module="ngClickExample" deps="angular-touch.js">
      <file name="index.html">
        <button ng-click="count = count + 1" ng-init="count=0">
          Increment
        </button>
        count: {{ count }}
      </file>
      <file name="script.js">
        angular.module('ngClickExample', ['ngTouch']);
      </file>
    </example>
 */

var ngTouchClickDirectiveFactory = ['$parse', '$timeout', '$rootElement',
    function($parse, $timeout, $rootElement) {
  var TAP_DURATION = 750; // Shorter than 750ms is a tap, longer is a taphold or drag.
  var MOVE_TOLERANCE = 12; // 12px seems to work in most mobile browsers.
  var PREVENT_DURATION = 2500; // 2.5 seconds maximum from preventGhostClick call to click
  var CLICKBUSTER_THRESHOLD = 25; // 25 pixels in any dimension is the limit for busting clicks.

  var ACTIVE_CLASS_NAME = 'ng-click-active';
  var lastPreventedTime;
  var touchCoordinates;
  var lastLabelClickCoordinates;


  // TAP EVENTS AND GHOST CLICKS
  //
  // Why tap events?
  // Mobile browsers detect a tap, then wait a moment (usually ~300ms) to see if you're
  // double-tapping, and then fire a click event.
  //
  // This delay sucks and makes mobile apps feel unresponsive.
  // So we detect touchstart, touchcancel and touchend ourselves and determine when
  // the user has tapped on something.
  //
  // What happens when the browser then generates a click event?
  // The browser, of course, also detects the tap and fires a click after a delay. This results in
  // tapping/clicking twice. We do "clickbusting" to prevent it.
  //
  // How does it work?
  // We attach global touchstart and click handlers, that run during the capture (early) phase.
  // So the sequence for a tap is:
  // - global touchstart: Sets an "allowable region" at the point touched.
  // - element's touchstart: Starts a touch
  // (- touchcancel ends the touch, no click follows)
  // - element's touchend: Determines if the tap is valid (didn't move too far away, didn't hold
  //   too long) and fires the user's tap handler. The touchend also calls preventGhostClick().
  // - preventGhostClick() removes the allowable region the global touchstart created.
  // - The browser generates a click event.
  // - The global click handler catches the click, and checks whether it was in an allowable region.
  //     - If preventGhostClick was called, the region will have been removed, the click is busted.
  //     - If the region is still there, the click proceeds normally. Therefore clicks on links and
  //       other elements without ngTap on them work normally.
  //
  // This is an ugly, terrible hack!
  // Yeah, tell me about it. The alternatives are using the slow click events, or making our users
  // deal with the ghost clicks, so I consider this the least of evils. Fortunately Angular
  // encapsulates this ugly logic away from the user.
  //
  // Why not just put click handlers on the element?
  // We do that too, just to be sure. If the tap event caused the DOM to change,
  // it is possible another element is now in that position. To take account for these possibly
  // distinct elements, the handlers are global and care only about coordinates.

  // Checks if the coordinates are close enough to be within the region.
  function hit(x1, y1, x2, y2) {
    return Math.abs(x1 - x2) < CLICKBUSTER_THRESHOLD && Math.abs(y1 - y2) < CLICKBUSTER_THRESHOLD;
  }

  // Checks a list of allowable regions against a click location.
  // Returns true if the click should be allowed.
  // Splices out the allowable region from the list after it has been used.
  function checkAllowableRegions(touchCoordinates, x, y) {
    for (var i = 0; i < touchCoordinates.length; i += 2) {
      if (hit(touchCoordinates[i], touchCoordinates[i + 1], x, y)) {
        touchCoordinates.splice(i, i + 2);
        return true; // allowable region
      }
    }
    return false; // No allowable region; bust it.
  }

  // Global click handler that prevents the click if it's in a bustable zone and preventGhostClick
  // was called recently.
  function onClick(event) {
    if (Date.now() - lastPreventedTime > PREVENT_DURATION) {
      return; // Too old.
    }

    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    // Work around desktop Webkit quirk where clicking a label will fire two clicks (on the label
    // and on the input element). Depending on the exact browser, this second click we don't want
    // to bust has either (0,0), negative coordinates, or coordinates equal to triggering label
    // click event
    if (x < 1 && y < 1) {
      return; // offscreen
    }
    if (lastLabelClickCoordinates &&
        lastLabelClickCoordinates[0] === x && lastLabelClickCoordinates[1] === y) {
      return; // input click triggered by label click
    }
    // reset label click coordinates on first subsequent click
    if (lastLabelClickCoordinates) {
      lastLabelClickCoordinates = null;
    }
    // remember label click coordinates to prevent click busting of trigger click event on input
    if (nodeName_(event.target) === 'label') {
      lastLabelClickCoordinates = [x, y];
    }

    // Look for an allowable region containing this click.
    // If we find one, that means it was created by touchstart and not removed by
    // preventGhostClick, so we don't bust it.
    if (checkAllowableRegions(touchCoordinates, x, y)) {
      return;
    }

    // If we didn't find an allowable region, bust the click.
    event.stopPropagation();
    event.preventDefault();

    // Blur focused form elements
    event.target && event.target.blur && event.target.blur();
  }


  // Global touchstart handler that creates an allowable region for a click event.
  // This allowable region can be removed by preventGhostClick if we want to bust it.
  function onTouchStart(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var x = touches[0].clientX;
    var y = touches[0].clientY;
    touchCoordinates.push(x, y);

    $timeout(function() {
      // Remove the allowable region.
      for (var i = 0; i < touchCoordinates.length; i += 2) {
        if (touchCoordinates[i] == x && touchCoordinates[i + 1] == y) {
          touchCoordinates.splice(i, i + 2);
          return;
        }
      }
    }, PREVENT_DURATION, false);
  }

  // On the first call, attaches some event handlers. Then whenever it gets called, it creates a
  // zone around the touchstart where clicks will get busted.
  function preventGhostClick(x, y) {
    if (!touchCoordinates) {
      $rootElement[0].addEventListener('click', onClick, true);
      $rootElement[0].addEventListener('touchstart', onTouchStart, true);
      touchCoordinates = [];
    }

    lastPreventedTime = Date.now();

    checkAllowableRegions(touchCoordinates, x, y);
  }

  // Actual linking function.
  return function(scope, element, attr) {
    var clickHandler = $parse(attr.ngClick),
        tapping = false,
        tapElement,  // Used to blur the element after a tap.
        startTime,   // Used to check if the tap was held too long.
        touchStartX,
        touchStartY;

    function resetState() {
      tapping = false;
      element.removeClass(ACTIVE_CLASS_NAME);
    }

    element.on('touchstart', function(event) {
      tapping = true;
      tapElement = event.target ? event.target : event.srcElement; // IE uses srcElement.
      // Hack for Safari, which can target text nodes instead of containers.
      if (tapElement.nodeType == 3) {
        tapElement = tapElement.parentNode;
      }

      element.addClass(ACTIVE_CLASS_NAME);

      startTime = Date.now();

      // Use jQuery originalEvent
      var originalEvent = event.originalEvent || event;
      var touches = originalEvent.touches && originalEvent.touches.length ? originalEvent.touches : [originalEvent];
      var e = touches[0];
      touchStartX = e.clientX;
      touchStartY = e.clientY;
    });

    element.on('touchcancel', function(event) {
      resetState();
    });

    element.on('touchend', function(event) {
      var diff = Date.now() - startTime;

      // Use jQuery originalEvent
      var originalEvent = event.originalEvent || event;
      var touches = (originalEvent.changedTouches && originalEvent.changedTouches.length) ?
          originalEvent.changedTouches :
          ((originalEvent.touches && originalEvent.touches.length) ? originalEvent.touches : [originalEvent]);
      var e = touches[0];
      var x = e.clientX;
      var y = e.clientY;
      var dist = Math.sqrt(Math.pow(x - touchStartX, 2) + Math.pow(y - touchStartY, 2));

      if (tapping && diff < TAP_DURATION && dist < MOVE_TOLERANCE) {
        // Call preventGhostClick so the clickbuster will catch the corresponding click.
        preventGhostClick(x, y);

        // Blur the focused element (the button, probably) before firing the callback.
        // This doesn't work perfectly on Android Chrome, but seems to work elsewhere.
        // I couldn't get anything to work reliably on Android Chrome.
        if (tapElement) {
          tapElement.blur();
        }

        if (!angular.isDefined(attr.disabled) || attr.disabled === false) {
          element.triggerHandler('click', [event]);
        }
      }

      resetState();
    });

    // Hack for iOS Safari's benefit. It goes searching for onclick handlers and is liable to click
    // something else nearby.
    element.onclick = function(event) { };

    // Actual click handler.
    // There are three different kinds of clicks, only two of which reach this point.
    // - On desktop browsers without touch events, their clicks will always come here.
    // - On mobile browsers, the simulated "fast" click will call this.
    // - But the browser's follow-up slow click will be "busted" before it reaches this handler.
    // Therefore it's safe to use this directive on both mobile and desktop.
    element.on('click', function(event, touchend) {
      scope.$apply(function() {
        clickHandler(scope, {$event: (touchend || event)});
      });
    });

    element.on('mousedown', function(event) {
      element.addClass(ACTIVE_CLASS_NAME);
    });

    element.on('mousemove mouseup', function(event) {
      element.removeClass(ACTIVE_CLASS_NAME);
    });

  };
}];

/* global ngTouch: false */

/**
 * @ngdoc directive
 * @name ngSwipeLeft
 *
 * @description
 * Specify custom behavior when an element is swiped to the left on a touchscreen device.
 * A leftward swipe is a quick, right-to-left slide of the finger.
 * Though ngSwipeLeft is designed for touch-based devices, it will work with a mouse click and drag
 * too.
 *
 * To disable the mouse click and drag functionality, add `ng-swipe-disable-mouse` to
 * the `ng-swipe-left` or `ng-swipe-right` DOM Element.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * @element ANY
 * @param {expression} ngSwipeLeft {@link guide/expression Expression} to evaluate
 * upon left swipe. (Event object is available as `$event`)
 *
 * @example
    <example module="ngSwipeLeftExample" deps="angular-touch.js">
      <file name="index.html">
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </file>
      <file name="script.js">
        angular.module('ngSwipeLeftExample', ['ngTouch']);
      </file>
    </example>
 */

/**
 * @ngdoc directive
 * @name ngSwipeRight
 *
 * @description
 * Specify custom behavior when an element is swiped to the right on a touchscreen device.
 * A rightward swipe is a quick, left-to-right slide of the finger.
 * Though ngSwipeRight is designed for touch-based devices, it will work with a mouse click and drag
 * too.
 *
 * Requires the {@link ngTouch `ngTouch`} module to be installed.
 *
 * @element ANY
 * @param {expression} ngSwipeRight {@link guide/expression Expression} to evaluate
 * upon right swipe. (Event object is available as `$event`)
 *
 * @example
    <example module="ngSwipeRightExample" deps="angular-touch.js">
      <file name="index.html">
        <div ng-show="!showActions" ng-swipe-left="showActions = true">
          Some list content, like an email in the inbox
        </div>
        <div ng-show="showActions" ng-swipe-right="showActions = false">
          <button ng-click="reply()">Reply</button>
          <button ng-click="delete()">Delete</button>
        </div>
      </file>
      <file name="script.js">
        angular.module('ngSwipeRightExample', ['ngTouch']);
      </file>
    </example>
 */

function makeSwipeDirective(directiveName, direction, eventName) {
  ngTouch.directive(directiveName, ['$parse', '$swipe', function($parse, $swipe) {
    // The maximum vertical delta for a swipe should be less than 75px.
    var MAX_VERTICAL_DISTANCE = 75;
    // Vertical distance should not be more than a fraction of the horizontal distance.
    var MAX_VERTICAL_RATIO = 0.3;
    // At least a 30px lateral motion is necessary for a swipe.
    var MIN_HORIZONTAL_DISTANCE = 30;

    return function(scope, element, attr) {
      var swipeHandler = $parse(attr[directiveName]);

      var startCoords, valid;

      function validSwipe(coords) {
        // Check that it's within the coordinates.
        // Absolute vertical distance must be within tolerances.
        // Horizontal distance, we take the current X - the starting X.
        // This is negative for leftward swipes and positive for rightward swipes.
        // After multiplying by the direction (-1 for left, +1 for right), legal swipes
        // (ie. same direction as the directive wants) will have a positive delta and
        // illegal ones a negative delta.
        // Therefore this delta must be positive, and larger than the minimum.
        if (!startCoords) return false;
        var deltaY = Math.abs(coords.y - startCoords.y);
        var deltaX = (coords.x - startCoords.x) * direction;
        return valid && // Short circuit for already-invalidated swipes.
            deltaY < MAX_VERTICAL_DISTANCE &&
            deltaX > 0 &&
            deltaX > MIN_HORIZONTAL_DISTANCE &&
            deltaY / deltaX < MAX_VERTICAL_RATIO;
      }

      var pointerTypes = ['touch'];
      if (!angular.isDefined(attr['ngSwipeDisableMouse'])) {
        pointerTypes.push('mouse');
      }
      $swipe.bind(element, {
        'start': function(coords, event) {
          startCoords = coords;
          valid = true;
        },
        'cancel': function(event) {
          valid = false;
        },
        'end': function(coords, event) {
          if (validSwipe(coords)) {
            scope.$apply(function() {
              element.triggerHandler(eventName);
              swipeHandler(scope, {$event: event});
            });
          }
        }
      }, pointerTypes);
    };
  }]);
}

// Left is negative X-coordinate, right is positive.
makeSwipeDirective('ngSwipeLeft', -1, 'swipeleft');
makeSwipeDirective('ngSwipeRight', 1, 'swiperight');



})(window, window.angular);

},{}],5:[function(require,module,exports){
require('./angular-touch');
module.exports = 'ngTouch';

},{"./angular-touch":4}],6:[function(require,module,exports){
"use strict";
angular.module('myApp', [ require('angular-local-storage')])
.config(function ($locationProvider) { //config your locationProvider
       $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
     });
  })
.config(['$httpProvider', function($httpProvider) {
    //initialize get if not there
    if (!$httpProvider.defaults.headers.get) {
        $httpProvider.defaults.headers.get = {};    
    }    



    //disable IE ajax request caching
    $httpProvider.defaults.headers.get['If-Modified-Since'] = 'Mon, 26 Jul 1997 05:00:00 GMT';
    // extra
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get['Pragma'] = 'no-cache';
}])
 .constant("baseURL","http://xx-jia.com/")
 .filter('comment', function() {
  return function(input, rate) {
    var out = [];

     if (rate=='low'){ //low
        for (var i = 0; i < input.length; i++) {
          if (input[i].rate==1) {
                out.push(input[i]);
          }        
i       }
     }else if(rate=='medium'){//medium
        for (var i = 0; i < input.length; i++) {
          if (input[i].rate==2||input[i].rate==3) {
                out.push(input[i]);
          }        
       }
     }else if(rate=='high'){
        for (var i = 0; i < input.length; i++) {
          if (input[i].rate==4||input[i].rate==5) {
                out.push(input[i]);
          }        
       }
     }else{
      return input;
     }
    return out;
  };
})
.directive('youlike',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/index/youlike.html'
  };
}])
.directive('productinfo',[ function() {
  return {
    restrict: 'E',
    templateUrl:'/directives/detail/productinfo.html'
  };
}])
.directive('comment',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/detail/comment.html'
  };
}])
.directive('cartyou',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/cart/cartyou.html'
  };
}])
.directive('cartno',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/cart/cartno.html'
  };
}])
.directive('confirmorder',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/confirmorder.html'
  };
}])
.directive('orderfinish',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/orderfinish.html'
  };
}])
.directive('orderprolist',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/orderprolist.html'
  };
}])
.directive('orderlist',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/orderlist.html'
  };
}])
.directive('orderdetail',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/orderdetail.html'
  };
}])
.directive('ordernotlog',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/order/ordernotlog.html'
  };
}])
.directive('chooseaddr',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/addr/chooseaddr.html'
  };
}])
.directive('usermenulist',[ function() {
  return {
    restrict: 'E',
    templateUrl:'directives/user/menulist.html'
  };
}]);
},{"angular-carousel":1,"angular-local-storage":2,"angular-touch":5}]},{},[6]);
