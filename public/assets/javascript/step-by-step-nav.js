// app/assets/javascript/step-by-step-nav.js
window.NHSUK = window.NHSUK || {};
window.NHSUK.Modules = window.NHSUK.Modules || {};
(function(Modules) {
  "use strict";
  Modules.AppStepNav = function() {
    var actions = {};
    var rememberShownStep = false;
    var stepNavSize;
    var sessionStoreLink = "nhsuk-step-nav-active-link";
    var activeLinkClass = "app-step-nav__list-item--active";
    var activeStepClass = "app-step-nav__step--active";
    var activeLinkHref = "#content";
    var uniqueId;
    this.start = function($element) {
      $element.addClass("app-step-nav--active");
      $element.removeClass("js-hidden");
      stepNavSize = $element.hasClass("app-step-nav--large") ? "Big" : "Small";
      rememberShownStep = !!$element.filter("[data-remember]").length && stepNavSize === "Big";
      var $steps = $element.find(".js-step");
      var $stepHeaders = $element.find(".js-toggle-panel");
      var totalSteps = $element.find(".js-panel").length;
      var totalLinks = $element.find("app-step-nav__link").length;
      var $showOrHideAllButton;
      uniqueId = $element.data("id") || false;
      if (uniqueId) {
        sessionStoreLink = sessionStoreLink + "_" + uniqueId;
      }
      var stepNavTracker = new StepNavTracker(totalSteps, totalLinks, uniqueId);
      getTextForInsertedElements();
      addButtonstoSteps();
      addShowHideAllButton();
      addShowHideToggle();
      addAriaControlsAttrForShowHideAllButton();
      ensureOnlyOneActiveLink();
      showPreviouslyOpenedSteps();
      bindToggleForSteps(stepNavTracker);
      bindToggleShowHideAllButton(stepNavTracker);
      bindComponentLinkClicks(stepNavTracker);
      function getTextForInsertedElements() {
        actions.showText = $element.attr("data-show-text");
        actions.hideText = $element.attr("data-hide-text");
        actions.showAllText = $element.attr("data-show-all-text");
        actions.hideAllText = $element.attr("data-hide-all-text");
      }
      function addShowHideAllButton() {
        $element.prepend('<div class="app-step-nav__controls"><button aria-expanded="false" class="app-step-nav__button app-step-nav__button--controls js-step-controls-button">' + actions.showAllText + "</button></div>");
      }
      function addShowHideToggle() {
        $stepHeaders.each(function() {
          var linkText = actions.showText;
          if (headerIsOpen($(this))) {
            linkText = actions.hideText;
          }
          if (!$(this).find(".js-toggle-link").length) {
            $(this).find(".js-step-title-button").append(
              '<span class="app-step-nav__toggle-link js-toggle-link" aria-hidden="true" hidden></span>'
            );
          }
        });
      }
      function headerIsOpen($stepHeader) {
        return typeof $stepHeader.closest(".js-step").data("show") !== "undefined";
      }
      function addAriaControlsAttrForShowHideAllButton() {
        var ariaControlsValue = $element.find(".js-panel").first().attr("id");
        $showOrHideAllButton = $element.find(".js-step-controls-button");
        $showOrHideAllButton.attr("aria-controls", ariaControlsValue);
      }
      function setAllStepsShownState(isShown) {
        var data = [];
        $.each($steps, function() {
          var stepView = new StepView($(this));
          stepView.setIsShown(isShown);
          if (isShown) {
            data.push($(this).attr("id"));
          }
        });
        if (isShown) {
          saveToSessionStorage(uniqueId, JSON.stringify(data));
        } else {
          removeFromSessionStorage(uniqueId);
        }
      }
      function showPreviouslyOpenedSteps() {
        var data = loadFromSessionStorage(uniqueId) || [];
        $.each($steps, function() {
          var id = $(this).attr("id");
          var stepView = new StepView($(this));
          if (rememberShownStep && data.indexOf(id) > -1 || typeof $(this).attr("data-show") !== "undefined") {
            stepView.setIsShown(true);
          } else {
            stepView.setIsShown(false);
          }
        });
        if (data.length > 0) {
          $showOrHideAllButton.attr("aria-expanded", true);
          setShowHideAllText();
        }
      }
      function addButtonstoSteps() {
        $.each($steps, function() {
          var $step = $(this);
          var $title = $step.find(".js-step-title");
          var contentId = $step.find(".js-panel").first().attr("id");
          $title.wrapInner(
            '<span class="js-step-title-text"></span>'
          );
          $title.wrapInner(
            '<button class="app-step-nav__button app-step-nav__button--title js-step-title-button" aria-expanded="false" aria-controls="' + contentId + '"></button>'
          );
        });
      }
      function bindToggleForSteps(stepNavTracker2) {
        $element.find(".js-toggle-panel").click(function(event) {
          var $step = $(this).closest(".js-step");
          var stepView = new StepView($step);
          stepView.toggle();
          var stepIsOptional = typeof $step.data("optional") !== "undefined";
          var toggleClick = new StepToggleClick(event, stepView, $steps, stepNavTracker2, stepIsOptional);
          toggleClick.track();
          setShowHideAllText();
          rememberStepState($step);
        });
      }
      function rememberStepState($step) {
        if (rememberShownStep) {
          var data = JSON.parse(loadFromSessionStorage(uniqueId)) || [];
          var thisstep = $step.attr("id");
          var shown = $step.hasClass("step-is-shown");
          if (shown) {
            data.push(thisstep);
          } else {
            var i = data.indexOf(thisstep);
            if (i > -1) {
              data.splice(i, 1);
            }
          }
          saveToSessionStorage(uniqueId, JSON.stringify(data));
        }
      }
      function bindComponentLinkClicks(stepNavTracker2) {
        $element.find(".js-link").click(function(event) {
          var linkClick = new componentLinkClick(event, stepNavTracker2, $(this).attr("data-position"));
          linkClick.track();
          var thisLinkHref = $(this).attr("href");
          if ($(this).attr("rel") !== "external") {
            saveToSessionStorage(sessionStoreLink, $(this).attr("data-position"));
          }
          if (thisLinkHref === activeLinkHref) {
            setOnlyThisLinkActive($(this));
            setActiveStepClass();
          }
        });
      }
      function saveToSessionStorage(key, value) {
        window.sessionStorage.setItem(key, value);
      }
      function loadFromSessionStorage(key) {
        return window.sessionStorage.getItem(key);
      }
      function removeFromSessionStorage(key) {
        window.sessionStorage.removeItem(key);
      }
      function setOnlyThisLinkActive(clicked) {
        $element.find("." + activeLinkClass).removeClass(activeLinkClass);
        clicked.parent().addClass(activeLinkClass);
      }
      function ensureOnlyOneActiveLink() {
        var $activeLinks = $element.find(".js-list-item." + activeLinkClass);
        if ($activeLinks.length <= 1) {
          return;
        }
        var lastClicked = loadFromSessionStorage(sessionStoreLink) || $element.find("." + activeLinkClass).first().attr("data-position");
        if (!$element.find('.js-link[data-position="' + lastClicked + '"]').parent().hasClass(activeLinkClass)) {
          lastClicked = $element.find("." + activeLinkClass).first().find(".js-link").attr("data-position");
        }
        removeActiveStateFromAllButCurrent($activeLinks, lastClicked);
        setActiveStepClass();
      }
      function removeActiveStateFromAllButCurrent($activeLinks, current) {
        $activeLinks.each(function() {
          if ($(this).find(".js-link").attr("data-position").toString() !== current.toString()) {
            $(this).removeClass(activeLinkClass);
            $(this).find(".visuallyhidden").remove();
          }
        });
      }
      function setActiveStepClass() {
        $element.find("." + activeStepClass).removeClass(activeStepClass).removeAttr("data-show");
        $element.find("." + activeLinkClass).closest(".app-step-nav__step").addClass(activeStepClass).attr("data-show", "");
      }
      function bindToggleShowHideAllButton(stepNavTracker2) {
        $showOrHideAllButton = $element.find(".js-step-controls-button");
        $showOrHideAllButton.on("click", function() {
          var shouldshowAll;
          if ($showOrHideAllButton.text() === actions.showAllText) {
            $showOrHideAllButton.text(actions.hideAllText);
            $element.find(".js-toggle-link").html(actions.hideText);
            shouldshowAll = true;
            stepNavTracker2.track("pageElementInteraction", "stepNavAllShown", {
              label: actions.showAllText + ": " + stepNavSize
            });
          } else {
            $showOrHideAllButton.text(actions.showAllText);
            $element.find(".js-toggle-link").html(actions.showText);
            shouldshowAll = false;
            stepNavTracker2.track("pageElementInteraction", "stepNavAllHidden", {
              label: actions.hideAllText + ": " + stepNavSize
            });
          }
          setAllStepsShownState(shouldshowAll);
          $showOrHideAllButton.attr("aria-expanded", shouldshowAll);
          setShowHideAllText();
          return false;
        });
      }
      function setShowHideAllText() {
        var shownSteps = $element.find(".step-is-shown").length;
        if (shownSteps === totalSteps) {
          $showOrHideAllButton.text(actions.hideAllText);
        } else {
          $showOrHideAllButton.text(actions.showAllText);
        }
      }
    };
    function StepView($stepElement) {
      var $titleLink = $stepElement.find(".js-step-title-button");
      var $stepContent = $stepElement.find(".js-panel");
      this.title = $stepElement.find(".js-step-title-text").text().trim();
      this.element = $stepElement;
      this.show = show;
      this.hide = hide;
      this.toggle = toggle;
      this.setIsShown = setIsShown;
      this.isShown = isShown;
      this.isHidden = isHidden;
      this.numberOfContentItems = numberOfContentItems;
      function show() {
        setIsShown(true);
      }
      function hide() {
        setIsShown(false);
      }
      function toggle() {
        setIsShown(isHidden());
      }
      function setIsShown(isShown2) {
        $stepElement.toggleClass("step-is-shown", isShown2);
        $stepContent.toggleClass("js-hidden", !isShown2);
        $titleLink.attr("aria-expanded", isShown2);
        $stepElement.find(".js-toggle-link").html(isShown2 ? actions.hideText : actions.showText);
      }
      function isShown() {
        return $stepElement.hasClass("step-is-shown");
      }
      function isHidden() {
        return !isShown();
      }
      function numberOfContentItems() {
        return $stepContent.find(".js-link").length;
      }
    }
    function StepToggleClick(event, stepView, $steps, stepNavTracker, stepIsOptional) {
      this.track = trackClick;
      var $target = $(event.target);
      function trackClick() {
        var trackingOptions = { label: trackingLabel(), dimension28: stepView.numberOfContentItems().toString() };
        stepNavTracker.track("pageElementInteraction", trackingAction(), trackingOptions);
      }
      function trackingLabel() {
        return $target.closest(".js-toggle-panel").attr("data-position") + " - " + stepView.title + " - " + locateClickElement() + ": " + stepNavSize + isOptional();
      }
      function stepIndex() {
        return $steps.index(stepView.element) + 1;
      }
      function trackingAction() {
        return stepView.isHidden() ? "stepNavHidden" : "stepNavShown";
      }
      function locateClickElement() {
        if (clickedOnIcon()) {
          return iconType() + " click";
        } else if (clickedOnHeading()) {
          return "Heading click";
        } else {
          return "Elsewhere click";
        }
      }
      function clickedOnIcon() {
        return $target.hasClass("js-toggle-link");
      }
      function clickedOnHeading() {
        return $target.hasClass("js-step-title-text");
      }
      function iconType() {
        return stepView.isHidden() ? "Minus" : "Plus";
      }
      function isOptional() {
        return stepIsOptional ? " ; optional" : "";
      }
    }
    function componentLinkClick(event, stepNavTracker, linkPosition) {
      this.track = trackClick;
      function trackClick() {
        var trackingOptions = { label: $(event.target).attr("href") + " : " + stepNavSize };
        var dimension28 = $(event.target).closest(".app-step-nav__list").attr("data-length");
        if (dimension28) {
          trackingOptions.dimension28 = dimension28;
        }
        stepNavTracker.track("stepNavLinkClicked", linkPosition, trackingOptions);
      }
    }
    function StepNavTracker(totalSteps, totalLinks, uniqueId2) {
      this.track = function(category, action, options) {
      };
    }
  };
})(window.NHSUK.Modules);
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vLi4vYXBwL2Fzc2V0cy9qYXZhc2NyaXB0L3N0ZXAtYnktc3RlcC1uYXYuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIEJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9hbHBoYWdvdi9nb3Z1a19wdWJsaXNoaW5nX2NvbXBvbmVudHMvYmxvYi92MjIuMC4wL2FwcC9hc3NldHMvamF2YXNjcmlwdHMvZ292dWtfcHVibGlzaGluZ19jb21wb25lbnRzL2NvbXBvbmVudHMvc3RlcC1ieS1zdGVwLW5hdi5qc1xuXG4vKiBlc2xpbnQtZW52IGpxdWVyeSAqL1xuXG53aW5kb3cuTkhTVUsgPSB3aW5kb3cuTkhTVUsgfHwge31cbndpbmRvdy5OSFNVSy5Nb2R1bGVzID0gd2luZG93Lk5IU1VLLk1vZHVsZXMgfHwge307XG5cbihmdW5jdGlvbiAoTW9kdWxlcykge1xuICAndXNlIHN0cmljdCdcblxuICBNb2R1bGVzLkFwcFN0ZXBOYXYgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFjdGlvbnMgPSB7fSAvLyBzdG9yZXMgdGV4dCBmb3IgSlMgYXBwZW5kZWQgZWxlbWVudHMgJ3Nob3cnIGFuZCAnaGlkZScgb24gc3RlcHMsIGFuZCAnc2hvdy9oaWRlIGFsbCcgYnV0dG9uXG4gICAgdmFyIHJlbWVtYmVyU2hvd25TdGVwID0gZmFsc2VcbiAgICB2YXIgc3RlcE5hdlNpemVcbiAgICB2YXIgc2Vzc2lvblN0b3JlTGluayA9ICduaHN1ay1zdGVwLW5hdi1hY3RpdmUtbGluaydcbiAgICB2YXIgYWN0aXZlTGlua0NsYXNzID0gJ2FwcC1zdGVwLW5hdl9fbGlzdC1pdGVtLS1hY3RpdmUnXG4gICAgdmFyIGFjdGl2ZVN0ZXBDbGFzcyA9ICdhcHAtc3RlcC1uYXZfX3N0ZXAtLWFjdGl2ZSdcbiAgICB2YXIgYWN0aXZlTGlua0hyZWYgPSAnI2NvbnRlbnQnXG4gICAgdmFyIHVuaXF1ZUlkXG5cbiAgICB0aGlzLnN0YXJ0ID0gZnVuY3Rpb24gKCRlbGVtZW50KSB7XG4gICAgICAvLyBJbmRpY2F0ZSB0aGF0IGpzIGhhcyB3b3JrZWRcbiAgICAgICRlbGVtZW50LmFkZENsYXNzKCdhcHAtc3RlcC1uYXYtLWFjdGl2ZScpXG5cbiAgICAgIC8vIFByZXZlbnQgRk9VQywgcmVtb3ZlIGNsYXNzIGhpZGluZyBjb250ZW50XG4gICAgICAkZWxlbWVudC5yZW1vdmVDbGFzcygnanMtaGlkZGVuJylcblxuICAgICAgc3RlcE5hdlNpemUgPSAkZWxlbWVudC5oYXNDbGFzcygnYXBwLXN0ZXAtbmF2LS1sYXJnZScpID8gJ0JpZycgOiAnU21hbGwnXG4gICAgICByZW1lbWJlclNob3duU3RlcCA9ICEhJGVsZW1lbnQuZmlsdGVyKCdbZGF0YS1yZW1lbWJlcl0nKS5sZW5ndGggJiYgc3RlcE5hdlNpemUgPT09ICdCaWcnXG4gICAgICB2YXIgJHN0ZXBzID0gJGVsZW1lbnQuZmluZCgnLmpzLXN0ZXAnKVxuICAgICAgdmFyICRzdGVwSGVhZGVycyA9ICRlbGVtZW50LmZpbmQoJy5qcy10b2dnbGUtcGFuZWwnKVxuICAgICAgdmFyIHRvdGFsU3RlcHMgPSAkZWxlbWVudC5maW5kKCcuanMtcGFuZWwnKS5sZW5ndGhcbiAgICAgIHZhciB0b3RhbExpbmtzID0gJGVsZW1lbnQuZmluZCgnYXBwLXN0ZXAtbmF2X19saW5rJykubGVuZ3RoXG4gICAgICB2YXIgJHNob3dPckhpZGVBbGxCdXR0b25cblxuICAgICAgdW5pcXVlSWQgPSAkZWxlbWVudC5kYXRhKCdpZCcpIHx8IGZhbHNlXG5cbiAgICAgIGlmICh1bmlxdWVJZCkge1xuICAgICAgICBzZXNzaW9uU3RvcmVMaW5rID0gc2Vzc2lvblN0b3JlTGluayArICdfJyArIHVuaXF1ZUlkXG4gICAgICB9XG5cbiAgICAgIHZhciBzdGVwTmF2VHJhY2tlciA9IG5ldyBTdGVwTmF2VHJhY2tlcih0b3RhbFN0ZXBzLCB0b3RhbExpbmtzLCB1bmlxdWVJZClcblxuICAgICAgZ2V0VGV4dEZvckluc2VydGVkRWxlbWVudHMoKVxuICAgICAgYWRkQnV0dG9uc3RvU3RlcHMoKVxuICAgICAgYWRkU2hvd0hpZGVBbGxCdXR0b24oKVxuICAgICAgYWRkU2hvd0hpZGVUb2dnbGUoKVxuICAgICAgYWRkQXJpYUNvbnRyb2xzQXR0ckZvclNob3dIaWRlQWxsQnV0dG9uKClcblxuICAgICAgZW5zdXJlT25seU9uZUFjdGl2ZUxpbmsoKVxuICAgICAgc2hvd1ByZXZpb3VzbHlPcGVuZWRTdGVwcygpXG5cbiAgICAgIGJpbmRUb2dnbGVGb3JTdGVwcyhzdGVwTmF2VHJhY2tlcilcbiAgICAgIGJpbmRUb2dnbGVTaG93SGlkZUFsbEJ1dHRvbihzdGVwTmF2VHJhY2tlcilcbiAgICAgIGJpbmRDb21wb25lbnRMaW5rQ2xpY2tzKHN0ZXBOYXZUcmFja2VyKVxuXG4gICAgICBmdW5jdGlvbiBnZXRUZXh0Rm9ySW5zZXJ0ZWRFbGVtZW50cyAoKSB7XG4gICAgICAgIGFjdGlvbnMuc2hvd1RleHQgPSAkZWxlbWVudC5hdHRyKCdkYXRhLXNob3ctdGV4dCcpXG4gICAgICAgIGFjdGlvbnMuaGlkZVRleHQgPSAkZWxlbWVudC5hdHRyKCdkYXRhLWhpZGUtdGV4dCcpXG4gICAgICAgIGFjdGlvbnMuc2hvd0FsbFRleHQgPSAkZWxlbWVudC5hdHRyKCdkYXRhLXNob3ctYWxsLXRleHQnKVxuICAgICAgICBhY3Rpb25zLmhpZGVBbGxUZXh0ID0gJGVsZW1lbnQuYXR0cignZGF0YS1oaWRlLWFsbC10ZXh0JylcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYWRkU2hvd0hpZGVBbGxCdXR0b24gKCkge1xuICAgICAgICAkZWxlbWVudC5wcmVwZW5kKCc8ZGl2IGNsYXNzPVwiYXBwLXN0ZXAtbmF2X19jb250cm9sc1wiPjxidXR0b24gYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgY2xhc3M9XCJhcHAtc3RlcC1uYXZfX2J1dHRvbiBhcHAtc3RlcC1uYXZfX2J1dHRvbi0tY29udHJvbHMganMtc3RlcC1jb250cm9scy1idXR0b25cIj4nICsgYWN0aW9ucy5zaG93QWxsVGV4dCArICc8L2J1dHRvbj48L2Rpdj4nKVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBhZGRTaG93SGlkZVRvZ2dsZSAoKSB7XG4gICAgICAgICRzdGVwSGVhZGVycy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgbGlua1RleHQgPSBhY3Rpb25zLnNob3dUZXh0IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcblxuICAgICAgICAgIGlmIChoZWFkZXJJc09wZW4oJCh0aGlzKSkpIHtcbiAgICAgICAgICAgIGxpbmtUZXh0ID0gYWN0aW9ucy5oaWRlVGV4dFxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghJCh0aGlzKS5maW5kKCcuanMtdG9nZ2xlLWxpbmsnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICQodGhpcykuZmluZCgnLmpzLXN0ZXAtdGl0bGUtYnV0dG9uJykuYXBwZW5kKFxuICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJhcHAtc3RlcC1uYXZfX3RvZ2dsZS1saW5rIGpzLXRvZ2dsZS1saW5rXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgaGlkZGVuPjwvc3Bhbj4nXG4gICAgICAgICAgICApXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBoZWFkZXJJc09wZW4gKCRzdGVwSGVhZGVyKSB7XG4gICAgICAgIHJldHVybiAodHlwZW9mICRzdGVwSGVhZGVyLmNsb3Nlc3QoJy5qcy1zdGVwJykuZGF0YSgnc2hvdycpICE9PSAndW5kZWZpbmVkJylcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYWRkQXJpYUNvbnRyb2xzQXR0ckZvclNob3dIaWRlQWxsQnV0dG9uICgpIHtcbiAgICAgICAgdmFyIGFyaWFDb250cm9sc1ZhbHVlID0gJGVsZW1lbnQuZmluZCgnLmpzLXBhbmVsJykuZmlyc3QoKS5hdHRyKCdpZCcpXG5cbiAgICAgICAgJHNob3dPckhpZGVBbGxCdXR0b24gPSAkZWxlbWVudC5maW5kKCcuanMtc3RlcC1jb250cm9scy1idXR0b24nKVxuICAgICAgICAkc2hvd09ySGlkZUFsbEJ1dHRvbi5hdHRyKCdhcmlhLWNvbnRyb2xzJywgYXJpYUNvbnRyb2xzVmFsdWUpXG4gICAgICB9XG5cbiAgICAgIC8vIGNhbGxlZCBieSBzaG93IGFsbC9oaWRlIGFsbCwgc2V0cyBhbGwgc3RlcHMgYWNjb3JkaW5nbHlcbiAgICAgIGZ1bmN0aW9uIHNldEFsbFN0ZXBzU2hvd25TdGF0ZSAoaXNTaG93bikge1xuICAgICAgICB2YXIgZGF0YSA9IFtdXG5cbiAgICAgICAgJC5lYWNoKCRzdGVwcywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBzdGVwVmlldyA9IG5ldyBTdGVwVmlldygkKHRoaXMpKVxuICAgICAgICAgIHN0ZXBWaWV3LnNldElzU2hvd24oaXNTaG93bilcblxuICAgICAgICAgIGlmIChpc1Nob3duKSB7XG4gICAgICAgICAgICBkYXRhLnB1c2goJCh0aGlzKS5hdHRyKCdpZCcpKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcblxuICAgICAgICBpZiAoaXNTaG93bikge1xuICAgICAgICAgIHNhdmVUb1Nlc3Npb25TdG9yYWdlKHVuaXF1ZUlkLCBKU09OLnN0cmluZ2lmeShkYXRhKSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZW1vdmVGcm9tU2Vzc2lvblN0b3JhZ2UodW5pcXVlSWQpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gY2FsbGVkIG9uIGxvYWQsIGRldGVybWluZXMgd2hldGhlciBlYWNoIHN0ZXAgc2hvdWxkIGJlIG9wZW4gb3IgY2xvc2VkXG4gICAgICBmdW5jdGlvbiBzaG93UHJldmlvdXNseU9wZW5lZFN0ZXBzICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSBsb2FkRnJvbVNlc3Npb25TdG9yYWdlKHVuaXF1ZUlkKSB8fCBbXVxuXG4gICAgICAgICQuZWFjaCgkc3RlcHMsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoJ2lkJylcbiAgICAgICAgICB2YXIgc3RlcFZpZXcgPSBuZXcgU3RlcFZpZXcoJCh0aGlzKSlcblxuICAgICAgICAgIC8vIHNob3cgdGhlIHN0ZXAgaWYgaXQgaGFzIGJlZW4gcmVtZW1iZXJlZCBvciBpZiBpdCBoYXMgdGhlICdkYXRhLXNob3cnIGF0dHJpYnV0ZVxuICAgICAgICAgIGlmICgocmVtZW1iZXJTaG93blN0ZXAgJiYgZGF0YS5pbmRleE9mKGlkKSA+IC0xKSB8fCB0eXBlb2YgJCh0aGlzKS5hdHRyKCdkYXRhLXNob3cnKSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHN0ZXBWaWV3LnNldElzU2hvd24odHJ1ZSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RlcFZpZXcuc2V0SXNTaG93bihmYWxzZSlcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG5cbiAgICAgICAgaWYgKGRhdGEubGVuZ3RoID4gMCkge1xuICAgICAgICAgICRzaG93T3JIaWRlQWxsQnV0dG9uLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCB0cnVlKVxuICAgICAgICAgIHNldFNob3dIaWRlQWxsVGV4dCgpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYWRkQnV0dG9uc3RvU3RlcHMgKCkge1xuICAgICAgICAkLmVhY2goJHN0ZXBzLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdmFyICRzdGVwID0gJCh0aGlzKVxuICAgICAgICAgIHZhciAkdGl0bGUgPSAkc3RlcC5maW5kKCcuanMtc3RlcC10aXRsZScpXG4gICAgICAgICAgdmFyIGNvbnRlbnRJZCA9ICRzdGVwLmZpbmQoJy5qcy1wYW5lbCcpLmZpcnN0KCkuYXR0cignaWQnKVxuXG4gICAgICAgICAgJHRpdGxlLndyYXBJbm5lcihcbiAgICAgICAgICAgICc8c3BhbiBjbGFzcz1cImpzLXN0ZXAtdGl0bGUtdGV4dFwiPjwvc3Bhbj4nXG4gICAgICAgICAgKVxuXG4gICAgICAgICAgJHRpdGxlLndyYXBJbm5lcihcbiAgICAgICAgICAgICc8YnV0dG9uICcgK1xuICAgICAgICAgICAgJ2NsYXNzPVwiYXBwLXN0ZXAtbmF2X19idXR0b24gYXBwLXN0ZXAtbmF2X19idXR0b24tLXRpdGxlIGpzLXN0ZXAtdGl0bGUtYnV0dG9uXCIgJyArXG4gICAgICAgICAgICAnYXJpYS1leHBhbmRlZD1cImZhbHNlXCIgYXJpYS1jb250cm9scz1cIicgKyBjb250ZW50SWQgKyAnXCI+JyArXG4gICAgICAgICAgICAnPC9idXR0b24+J1xuICAgICAgICAgIClcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gYmluZFRvZ2dsZUZvclN0ZXBzIChzdGVwTmF2VHJhY2tlcikge1xuICAgICAgICAkZWxlbWVudC5maW5kKCcuanMtdG9nZ2xlLXBhbmVsJykuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgdmFyICRzdGVwID0gJCh0aGlzKS5jbG9zZXN0KCcuanMtc3RlcCcpXG5cbiAgICAgICAgICB2YXIgc3RlcFZpZXcgPSBuZXcgU3RlcFZpZXcoJHN0ZXApXG4gICAgICAgICAgc3RlcFZpZXcudG9nZ2xlKClcblxuICAgICAgICAgIHZhciBzdGVwSXNPcHRpb25hbCA9IHR5cGVvZiAkc3RlcC5kYXRhKCdvcHRpb25hbCcpICE9PSAndW5kZWZpbmVkJ1xuICAgICAgICAgIHZhciB0b2dnbGVDbGljayA9IG5ldyBTdGVwVG9nZ2xlQ2xpY2soZXZlbnQsIHN0ZXBWaWV3LCAkc3RlcHMsIHN0ZXBOYXZUcmFja2VyLCBzdGVwSXNPcHRpb25hbClcbiAgICAgICAgICB0b2dnbGVDbGljay50cmFjaygpXG5cbiAgICAgICAgICBzZXRTaG93SGlkZUFsbFRleHQoKVxuICAgICAgICAgIHJlbWVtYmVyU3RlcFN0YXRlKCRzdGVwKVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICAvLyBpZiB0aGUgc3RlcCBpcyBvcGVuLCBzdG9yZSBpdHMgaWQgaW4gc2Vzc2lvbiBzdG9yZVxuICAgICAgLy8gaWYgdGhlIHN0ZXAgaXMgY2xvc2VkLCByZW1vdmUgaXRzIGlkIGZyb20gc2Vzc2lvbiBzdG9yZVxuICAgICAgZnVuY3Rpb24gcmVtZW1iZXJTdGVwU3RhdGUgKCRzdGVwKSB7XG4gICAgICAgIGlmIChyZW1lbWJlclNob3duU3RlcCkge1xuICAgICAgICAgIHZhciBkYXRhID0gSlNPTi5wYXJzZShsb2FkRnJvbVNlc3Npb25TdG9yYWdlKHVuaXF1ZUlkKSkgfHwgW11cbiAgICAgICAgICB2YXIgdGhpc3N0ZXAgPSAkc3RlcC5hdHRyKCdpZCcpXG4gICAgICAgICAgdmFyIHNob3duID0gJHN0ZXAuaGFzQ2xhc3MoJ3N0ZXAtaXMtc2hvd24nKVxuXG4gICAgICAgICAgaWYgKHNob3duKSB7XG4gICAgICAgICAgICBkYXRhLnB1c2godGhpc3N0ZXApXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBpID0gZGF0YS5pbmRleE9mKHRoaXNzdGVwKVxuICAgICAgICAgICAgaWYgKGkgPiAtMSkge1xuICAgICAgICAgICAgICBkYXRhLnNwbGljZShpLCAxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBzYXZlVG9TZXNzaW9uU3RvcmFnZSh1bmlxdWVJZCwgSlNPTi5zdHJpbmdpZnkoZGF0YSkpXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gdHJhY2tpbmcgY2xpY2sgZXZlbnRzIG9uIGxpbmtzIGluIHN0ZXAgY29udGVudFxuICAgICAgZnVuY3Rpb24gYmluZENvbXBvbmVudExpbmtDbGlja3MgKHN0ZXBOYXZUcmFja2VyKSB7XG4gICAgICAgICRlbGVtZW50LmZpbmQoJy5qcy1saW5rJykuY2xpY2soZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgdmFyIGxpbmtDbGljayA9IG5ldyBjb21wb25lbnRMaW5rQ2xpY2soZXZlbnQsIHN0ZXBOYXZUcmFja2VyLCAkKHRoaXMpLmF0dHIoJ2RhdGEtcG9zaXRpb24nKSkgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXcsIG5ldy1jYXBcbiAgICAgICAgICBsaW5rQ2xpY2sudHJhY2soKVxuICAgICAgICAgIHZhciB0aGlzTGlua0hyZWYgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKVxuXG4gICAgICAgICAgaWYgKCQodGhpcykuYXR0cigncmVsJykgIT09ICdleHRlcm5hbCcpIHtcbiAgICAgICAgICAgIHNhdmVUb1Nlc3Npb25TdG9yYWdlKHNlc3Npb25TdG9yZUxpbmssICQodGhpcykuYXR0cignZGF0YS1wb3NpdGlvbicpKVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzTGlua0hyZWYgPT09IGFjdGl2ZUxpbmtIcmVmKSB7XG4gICAgICAgICAgICBzZXRPbmx5VGhpc0xpbmtBY3RpdmUoJCh0aGlzKSlcbiAgICAgICAgICAgIHNldEFjdGl2ZVN0ZXBDbGFzcygpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzYXZlVG9TZXNzaW9uU3RvcmFnZSAoa2V5LCB2YWx1ZSkge1xuICAgICAgICB3aW5kb3cuc2Vzc2lvblN0b3JhZ2Uuc2V0SXRlbShrZXksIHZhbHVlKVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBsb2FkRnJvbVNlc3Npb25TdG9yYWdlIChrZXkpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5zZXNzaW9uU3RvcmFnZS5nZXRJdGVtKGtleSlcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlRnJvbVNlc3Npb25TdG9yYWdlIChrZXkpIHtcbiAgICAgICAgd2luZG93LnNlc3Npb25TdG9yYWdlLnJlbW92ZUl0ZW0oa2V5KVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRPbmx5VGhpc0xpbmtBY3RpdmUgKGNsaWNrZWQpIHtcbiAgICAgICAgJGVsZW1lbnQuZmluZCgnLicgKyBhY3RpdmVMaW5rQ2xhc3MpLnJlbW92ZUNsYXNzKGFjdGl2ZUxpbmtDbGFzcylcbiAgICAgICAgY2xpY2tlZC5wYXJlbnQoKS5hZGRDbGFzcyhhY3RpdmVMaW5rQ2xhc3MpXG4gICAgICB9XG5cbiAgICAgIC8vIGlmIGEgbGluayBvY2N1cnMgbW9yZSB0aGFuIG9uY2UgaW4gYSBzdGVwIG5hdiwgdGhlIGJhY2tlbmQgZG9lc24ndCBrbm93IHdoaWNoIG9uZSB0byBoaWdobGlnaHRcbiAgICAgIC8vIHNvIGl0IGdpdmVzIGFsbCB0aG9zZSBsaW5rcyB0aGUgJ2FjdGl2ZScgYXR0cmlidXRlIGFuZCBoaWdobGlnaHRzIHRoZSBsYXN0IHN0ZXAgY29udGFpbmluZyB0aGF0IGxpbmtcbiAgICAgIC8vIGlmIHRoZSB1c2VyIGNsaWNrZWQgb24gb25lIG9mIHRob3NlIGxpbmtzIHByZXZpb3VzbHksIGl0IHdpbGwgYmUgaW4gdGhlIHNlc3Npb24gc3RvcmVcbiAgICAgIC8vIHRoaXMgY29kZSBlbnN1cmVzIG9ubHkgdGhhdCBsaW5rIGFuZCBpdHMgY29ycmVzcG9uZGluZyBzdGVwIGhhdmUgdGhlIGhpZ2hsaWdodGluZ1xuICAgICAgLy8gb3RoZXJ3aXNlIGl0IGFjY2VwdHMgd2hhdCB0aGUgYmFja2VuZCBoYXMgYWxyZWFkeSBwYXNzZWQgdG8gdGhlIGNvbXBvbmVudFxuICAgICAgZnVuY3Rpb24gZW5zdXJlT25seU9uZUFjdGl2ZUxpbmsgKCkge1xuICAgICAgICB2YXIgJGFjdGl2ZUxpbmtzID0gJGVsZW1lbnQuZmluZCgnLmpzLWxpc3QtaXRlbS4nICsgYWN0aXZlTGlua0NsYXNzKVxuXG4gICAgICAgIGlmICgkYWN0aXZlTGlua3MubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsYXN0Q2xpY2tlZCA9IGxvYWRGcm9tU2Vzc2lvblN0b3JhZ2Uoc2Vzc2lvblN0b3JlTGluaykgfHwgJGVsZW1lbnQuZmluZCgnLicgKyBhY3RpdmVMaW5rQ2xhc3MpLmZpcnN0KCkuYXR0cignZGF0YS1wb3NpdGlvbicpXG5cbiAgICAgICAgLy8gaXQncyBwb3NzaWJsZSBmb3IgdGhlIHNhdmVkIGxpbmsgcG9zaXRpb24gdmFsdWUgdG8gbm90IG1hdGNoIGFueSBvZiB0aGUgY3VycmVudGx5IGR1cGxpY2F0ZSBoaWdobGlnaHRlZCBsaW5rc1xuICAgICAgICAvLyBzbyBjaGVjayB0aGlzIG90aGVyd2lzZSBpdCdsbCB0YWtlIHRoZSBoaWdobGlnaHRpbmcgb2ZmIGFsbCBvZiB0aGVtXG4gICAgICAgIGlmICghJGVsZW1lbnQuZmluZCgnLmpzLWxpbmtbZGF0YS1wb3NpdGlvbj1cIicgKyBsYXN0Q2xpY2tlZCArICdcIl0nKS5wYXJlbnQoKS5oYXNDbGFzcyhhY3RpdmVMaW5rQ2xhc3MpKSB7XG4gICAgICAgICAgbGFzdENsaWNrZWQgPSAkZWxlbWVudC5maW5kKCcuJyArIGFjdGl2ZUxpbmtDbGFzcykuZmlyc3QoKS5maW5kKCcuanMtbGluaycpLmF0dHIoJ2RhdGEtcG9zaXRpb24nKVxuICAgICAgICB9XG4gICAgICAgIHJlbW92ZUFjdGl2ZVN0YXRlRnJvbUFsbEJ1dEN1cnJlbnQoJGFjdGl2ZUxpbmtzLCBsYXN0Q2xpY2tlZClcbiAgICAgICAgc2V0QWN0aXZlU3RlcENsYXNzKClcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcmVtb3ZlQWN0aXZlU3RhdGVGcm9tQWxsQnV0Q3VycmVudCAoJGFjdGl2ZUxpbmtzLCBjdXJyZW50KSB7XG4gICAgICAgICRhY3RpdmVMaW5rcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKCcuanMtbGluaycpLmF0dHIoJ2RhdGEtcG9zaXRpb24nKS50b1N0cmluZygpICE9PSBjdXJyZW50LnRvU3RyaW5nKCkpIHtcbiAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoYWN0aXZlTGlua0NsYXNzKVxuICAgICAgICAgICAgJCh0aGlzKS5maW5kKCcudmlzdWFsbHloaWRkZW4nKS5yZW1vdmUoKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0QWN0aXZlU3RlcENsYXNzICgpIHtcbiAgICAgICAgJGVsZW1lbnQuZmluZCgnLicgKyBhY3RpdmVTdGVwQ2xhc3MpLnJlbW92ZUNsYXNzKGFjdGl2ZVN0ZXBDbGFzcykucmVtb3ZlQXR0cignZGF0YS1zaG93JylcbiAgICAgICAgJGVsZW1lbnQuZmluZCgnLicgKyBhY3RpdmVMaW5rQ2xhc3MpLmNsb3Nlc3QoJy5hcHAtc3RlcC1uYXZfX3N0ZXAnKS5hZGRDbGFzcyhhY3RpdmVTdGVwQ2xhc3MpLmF0dHIoJ2RhdGEtc2hvdycsICcnKVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBiaW5kVG9nZ2xlU2hvd0hpZGVBbGxCdXR0b24gKHN0ZXBOYXZUcmFja2VyKSB7XG4gICAgICAgICRzaG93T3JIaWRlQWxsQnV0dG9uID0gJGVsZW1lbnQuZmluZCgnLmpzLXN0ZXAtY29udHJvbHMtYnV0dG9uJylcbiAgICAgICAgJHNob3dPckhpZGVBbGxCdXR0b24ub24oJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBzaG91bGRzaG93QWxsXG5cbiAgICAgICAgICBpZiAoJHNob3dPckhpZGVBbGxCdXR0b24udGV4dCgpID09PSBhY3Rpb25zLnNob3dBbGxUZXh0KSB7XG4gICAgICAgICAgICAkc2hvd09ySGlkZUFsbEJ1dHRvbi50ZXh0KGFjdGlvbnMuaGlkZUFsbFRleHQpXG4gICAgICAgICAgICAkZWxlbWVudC5maW5kKCcuanMtdG9nZ2xlLWxpbmsnKS5odG1sKGFjdGlvbnMuaGlkZVRleHQpXG4gICAgICAgICAgICBzaG91bGRzaG93QWxsID0gdHJ1ZVxuXG4gICAgICAgICAgICBzdGVwTmF2VHJhY2tlci50cmFjaygncGFnZUVsZW1lbnRJbnRlcmFjdGlvbicsICdzdGVwTmF2QWxsU2hvd24nLCB7XG4gICAgICAgICAgICAgIGxhYmVsOiBhY3Rpb25zLnNob3dBbGxUZXh0ICsgJzogJyArIHN0ZXBOYXZTaXplXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkc2hvd09ySGlkZUFsbEJ1dHRvbi50ZXh0KGFjdGlvbnMuc2hvd0FsbFRleHQpXG4gICAgICAgICAgICAkZWxlbWVudC5maW5kKCcuanMtdG9nZ2xlLWxpbmsnKS5odG1sKGFjdGlvbnMuc2hvd1RleHQpXG4gICAgICAgICAgICBzaG91bGRzaG93QWxsID0gZmFsc2VcblxuICAgICAgICAgICAgc3RlcE5hdlRyYWNrZXIudHJhY2soJ3BhZ2VFbGVtZW50SW50ZXJhY3Rpb24nLCAnc3RlcE5hdkFsbEhpZGRlbicsIHtcbiAgICAgICAgICAgICAgbGFiZWw6IGFjdGlvbnMuaGlkZUFsbFRleHQgKyAnOiAnICsgc3RlcE5hdlNpemVcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgc2V0QWxsU3RlcHNTaG93blN0YXRlKHNob3VsZHNob3dBbGwpXG4gICAgICAgICAgJHNob3dPckhpZGVBbGxCdXR0b24uYXR0cignYXJpYS1leHBhbmRlZCcsIHNob3VsZHNob3dBbGwpXG4gICAgICAgICAgc2V0U2hvd0hpZGVBbGxUZXh0KClcblxuICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBzZXRTaG93SGlkZUFsbFRleHQgKCkge1xuICAgICAgICB2YXIgc2hvd25TdGVwcyA9ICRlbGVtZW50LmZpbmQoJy5zdGVwLWlzLXNob3duJykubGVuZ3RoXG4gICAgICAgIC8vIEZpbmQgb3V0IGlmIHRoZSBudW1iZXIgb2YgaXMtb3BlbnMgPT0gdG90YWwgbnVtYmVyIG9mIHN0ZXBzXG4gICAgICAgIGlmIChzaG93blN0ZXBzID09PSB0b3RhbFN0ZXBzKSB7XG4gICAgICAgICAgJHNob3dPckhpZGVBbGxCdXR0b24udGV4dChhY3Rpb25zLmhpZGVBbGxUZXh0KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRzaG93T3JIaWRlQWxsQnV0dG9uLnRleHQoYWN0aW9ucy5zaG93QWxsVGV4dClcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIFN0ZXBWaWV3ICgkc3RlcEVsZW1lbnQpIHtcbiAgICAgIHZhciAkdGl0bGVMaW5rID0gJHN0ZXBFbGVtZW50LmZpbmQoJy5qcy1zdGVwLXRpdGxlLWJ1dHRvbicpXG4gICAgICB2YXIgJHN0ZXBDb250ZW50ID0gJHN0ZXBFbGVtZW50LmZpbmQoJy5qcy1wYW5lbCcpXG5cbiAgICAgIHRoaXMudGl0bGUgPSAkc3RlcEVsZW1lbnQuZmluZCgnLmpzLXN0ZXAtdGl0bGUtdGV4dCcpLnRleHQoKS50cmltKClcbiAgICAgIHRoaXMuZWxlbWVudCA9ICRzdGVwRWxlbWVudFxuXG4gICAgICB0aGlzLnNob3cgPSBzaG93XG4gICAgICB0aGlzLmhpZGUgPSBoaWRlXG4gICAgICB0aGlzLnRvZ2dsZSA9IHRvZ2dsZVxuICAgICAgdGhpcy5zZXRJc1Nob3duID0gc2V0SXNTaG93blxuICAgICAgdGhpcy5pc1Nob3duID0gaXNTaG93blxuICAgICAgdGhpcy5pc0hpZGRlbiA9IGlzSGlkZGVuXG4gICAgICB0aGlzLm51bWJlck9mQ29udGVudEl0ZW1zID0gbnVtYmVyT2ZDb250ZW50SXRlbXNcblxuICAgICAgZnVuY3Rpb24gc2hvdyAoKSB7XG4gICAgICAgIHNldElzU2hvd24odHJ1ZSlcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaGlkZSAoKSB7XG4gICAgICAgIHNldElzU2hvd24oZmFsc2UpXG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIHRvZ2dsZSAoKSB7XG4gICAgICAgIHNldElzU2hvd24oaXNIaWRkZW4oKSlcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gc2V0SXNTaG93biAoaXNTaG93bikge1xuICAgICAgICAkc3RlcEVsZW1lbnQudG9nZ2xlQ2xhc3MoJ3N0ZXAtaXMtc2hvd24nLCBpc1Nob3duKVxuICAgICAgICAkc3RlcENvbnRlbnQudG9nZ2xlQ2xhc3MoJ2pzLWhpZGRlbicsICFpc1Nob3duKVxuICAgICAgICAkdGl0bGVMaW5rLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCBpc1Nob3duKVxuICAgICAgICAkc3RlcEVsZW1lbnQuZmluZCgnLmpzLXRvZ2dsZS1saW5rJykuaHRtbChpc1Nob3duID8gYWN0aW9ucy5oaWRlVGV4dCA6IGFjdGlvbnMuc2hvd1RleHQpXG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGlzU2hvd24gKCkge1xuICAgICAgICByZXR1cm4gJHN0ZXBFbGVtZW50Lmhhc0NsYXNzKCdzdGVwLWlzLXNob3duJylcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaXNIaWRkZW4gKCkge1xuICAgICAgICByZXR1cm4gIWlzU2hvd24oKVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBudW1iZXJPZkNvbnRlbnRJdGVtcyAoKSB7XG4gICAgICAgIHJldHVybiAkc3RlcENvbnRlbnQuZmluZCgnLmpzLWxpbmsnKS5sZW5ndGhcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBTdGVwVG9nZ2xlQ2xpY2sgKGV2ZW50LCBzdGVwVmlldywgJHN0ZXBzLCBzdGVwTmF2VHJhY2tlciwgc3RlcElzT3B0aW9uYWwpIHtcbiAgICAgIHRoaXMudHJhY2sgPSB0cmFja0NsaWNrXG4gICAgICB2YXIgJHRhcmdldCA9ICQoZXZlbnQudGFyZ2V0KVxuXG4gICAgICBmdW5jdGlvbiB0cmFja0NsaWNrICgpIHtcbiAgICAgICAgdmFyIHRyYWNraW5nT3B0aW9ucyA9IHsgbGFiZWw6IHRyYWNraW5nTGFiZWwoKSwgZGltZW5zaW9uMjg6IHN0ZXBWaWV3Lm51bWJlck9mQ29udGVudEl0ZW1zKCkudG9TdHJpbmcoKSB9XG4gICAgICAgIHN0ZXBOYXZUcmFja2VyLnRyYWNrKCdwYWdlRWxlbWVudEludGVyYWN0aW9uJywgdHJhY2tpbmdBY3Rpb24oKSwgdHJhY2tpbmdPcHRpb25zKVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiB0cmFja2luZ0xhYmVsICgpIHtcbiAgICAgICAgcmV0dXJuICR0YXJnZXQuY2xvc2VzdCgnLmpzLXRvZ2dsZS1wYW5lbCcpLmF0dHIoJ2RhdGEtcG9zaXRpb24nKSArICcgLSAnICsgc3RlcFZpZXcudGl0bGUgKyAnIC0gJyArIGxvY2F0ZUNsaWNrRWxlbWVudCgpICsgJzogJyArIHN0ZXBOYXZTaXplICsgaXNPcHRpb25hbCgpXG4gICAgICB9XG5cbiAgICAgIC8vIHJldHVybnMgaW5kZXggb2YgdGhlIGNsaWNrZWQgc3RlcCBpbiB0aGUgb3ZlcmFsbCBudW1iZXIgb2Ygc3RlcHNcbiAgICAgIGZ1bmN0aW9uIHN0ZXBJbmRleCAoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgICAgcmV0dXJuICRzdGVwcy5pbmRleChzdGVwVmlldy5lbGVtZW50KSArIDFcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gdHJhY2tpbmdBY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKHN0ZXBWaWV3LmlzSGlkZGVuKCkgPyAnc3RlcE5hdkhpZGRlbicgOiAnc3RlcE5hdlNob3duJylcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbG9jYXRlQ2xpY2tFbGVtZW50ICgpIHtcbiAgICAgICAgaWYgKGNsaWNrZWRPbkljb24oKSkge1xuICAgICAgICAgIHJldHVybiBpY29uVHlwZSgpICsgJyBjbGljaydcbiAgICAgICAgfSBlbHNlIGlmIChjbGlja2VkT25IZWFkaW5nKCkpIHtcbiAgICAgICAgICByZXR1cm4gJ0hlYWRpbmcgY2xpY2snXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuICdFbHNld2hlcmUgY2xpY2snXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gY2xpY2tlZE9uSWNvbiAoKSB7XG4gICAgICAgIHJldHVybiAkdGFyZ2V0Lmhhc0NsYXNzKCdqcy10b2dnbGUtbGluaycpXG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGNsaWNrZWRPbkhlYWRpbmcgKCkge1xuICAgICAgICByZXR1cm4gJHRhcmdldC5oYXNDbGFzcygnanMtc3RlcC10aXRsZS10ZXh0JylcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gaWNvblR5cGUgKCkge1xuICAgICAgICByZXR1cm4gKHN0ZXBWaWV3LmlzSGlkZGVuKCkgPyAnTWludXMnIDogJ1BsdXMnKVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBpc09wdGlvbmFsICgpIHtcbiAgICAgICAgcmV0dXJuIChzdGVwSXNPcHRpb25hbCA/ICcgOyBvcHRpb25hbCcgOiAnJylcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb21wb25lbnRMaW5rQ2xpY2sgKGV2ZW50LCBzdGVwTmF2VHJhY2tlciwgbGlua1Bvc2l0aW9uKSB7XG4gICAgICB0aGlzLnRyYWNrID0gdHJhY2tDbGlja1xuXG4gICAgICBmdW5jdGlvbiB0cmFja0NsaWNrICgpIHtcbiAgICAgICAgdmFyIHRyYWNraW5nT3B0aW9ucyA9IHsgbGFiZWw6ICQoZXZlbnQudGFyZ2V0KS5hdHRyKCdocmVmJykgKyAnIDogJyArIHN0ZXBOYXZTaXplIH1cbiAgICAgICAgdmFyIGRpbWVuc2lvbjI4ID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoJy5hcHAtc3RlcC1uYXZfX2xpc3QnKS5hdHRyKCdkYXRhLWxlbmd0aCcpXG5cbiAgICAgICAgaWYgKGRpbWVuc2lvbjI4KSB7XG4gICAgICAgICAgdHJhY2tpbmdPcHRpb25zLmRpbWVuc2lvbjI4ID0gZGltZW5zaW9uMjhcbiAgICAgICAgfVxuXG4gICAgICAgIHN0ZXBOYXZUcmFja2VyLnRyYWNrKCdzdGVwTmF2TGlua0NsaWNrZWQnLCBsaW5rUG9zaXRpb24sIHRyYWNraW5nT3B0aW9ucylcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBBIGhlbHBlciB0aGF0IHNlbmRzIGEgY3VzdG9tIGV2ZW50IHJlcXVlc3QgdG8gR29vZ2xlIEFuYWx5dGljcyBpZlxuICAgIC8vIHRoZSBOSFNVSyBtb2R1bGUgaXMgc2V0dXBcbiAgICBmdW5jdGlvbiBTdGVwTmF2VHJhY2tlciAodG90YWxTdGVwcywgdG90YWxMaW5rcywgdW5pcXVlSWQpIHtcbiAgICAgIHRoaXMudHJhY2sgPSBmdW5jdGlvbiAoY2F0ZWdvcnksIGFjdGlvbiwgb3B0aW9ucykge1xuICAgICAgICAvLyBub29wXG4gICAgICB9XG4gICAgfVxuICB9XG59KSh3aW5kb3cuTkhTVUsuTW9kdWxlcylcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFJQSxPQUFPLFFBQVEsT0FBTyxTQUFTLENBQUM7QUFDaEMsT0FBTyxNQUFNLFVBQVUsT0FBTyxNQUFNLFdBQVcsQ0FBQztBQUFBLENBRS9DLFNBQVUsU0FBUztBQUNsQjtBQUVBLFVBQVEsYUFBYSxXQUFZO0FBQy9CLFFBQUksVUFBVSxDQUFDO0FBQ2YsUUFBSSxvQkFBb0I7QUFDeEIsUUFBSTtBQUNKLFFBQUksbUJBQW1CO0FBQ3ZCLFFBQUksa0JBQWtCO0FBQ3RCLFFBQUksa0JBQWtCO0FBQ3RCLFFBQUksaUJBQWlCO0FBQ3JCLFFBQUk7QUFFSixTQUFLLFFBQVEsU0FBVSxVQUFVO0FBRS9CLGVBQVMsU0FBUyxzQkFBc0I7QUFHeEMsZUFBUyxZQUFZLFdBQVc7QUFFaEMsb0JBQWMsU0FBUyxTQUFTLHFCQUFxQixJQUFJLFFBQVE7QUFDakUsMEJBQW9CLENBQUMsQ0FBQyxTQUFTLE9BQU8saUJBQWlCLEVBQUUsVUFBVSxnQkFBZ0I7QUFDbkYsVUFBSSxTQUFTLFNBQVMsS0FBSyxVQUFVO0FBQ3JDLFVBQUksZUFBZSxTQUFTLEtBQUssa0JBQWtCO0FBQ25ELFVBQUksYUFBYSxTQUFTLEtBQUssV0FBVyxFQUFFO0FBQzVDLFVBQUksYUFBYSxTQUFTLEtBQUssb0JBQW9CLEVBQUU7QUFDckQsVUFBSTtBQUVKLGlCQUFXLFNBQVMsS0FBSyxJQUFJLEtBQUs7QUFFbEMsVUFBSSxVQUFVO0FBQ1osMkJBQW1CLG1CQUFtQixNQUFNO0FBQUEsTUFDOUM7QUFFQSxVQUFJLGlCQUFpQixJQUFJLGVBQWUsWUFBWSxZQUFZLFFBQVE7QUFFeEUsaUNBQTJCO0FBQzNCLHdCQUFrQjtBQUNsQiwyQkFBcUI7QUFD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UyxTQUFTLElBQUksVUFBVTtBQUFBLE1BQzFDO0FBRUEsZUFBUyxhQUFjO0FBQ3JCLGVBQVEsaUJBQWlCLGdCQUFnQjtBQUFBLE1BQzNDO0FBQUEsSUFDRjtBQUVBLGFBQVMsbUJBQW9CLE9BQU8sZ0JBQWdCLGNBQWM7QUFDaEUsV0FBSyxRQUFRO0FBRWIsZUFBUyxhQUFjO0FBQ3JCLFlBQUksa0JBQWtCLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxFQUFFLEtBQUssTUFBTSxJQUFJLFFBQVEsWUFBWTtBQUNsRixZQUFJLGNBQWMsRUFBRSxNQUFNLE1BQU0sRUFBRSxRQUFRLHFCQUFxQixFQUFFLEtBQUssYUFBYTtBQUVuRixZQUFJLGFBQWE7QUFDZiwwQkFBZ0IsY0FBYztBQUFBLFFBQ2hDO0FBRUEsdUJBQWUsTUFBTSxzQkFBc0IsY0FBYyxlQUFlO0FBQUEsTUFDMUU7QUFBQSxJQUNGO0FBSUEsYUFBUyxlQUFnQixZQUFZLFlBQVlDLFdBQVU7QUFDekQsV0FBSyxRQUFRLFNBQVUsVUFBVSxRQUFRLFNBQVM7QUFBQSxNQUVsRDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsR0FBRyxPQUFPLE1BQU0sT0FBTzsiLAogICJuYW1lcyI6IFsic3RlcE5hdlRyYWNrZXIiLCAiaXNTaG93biIsICJ1bmlxdWVJZCJdCn0K
