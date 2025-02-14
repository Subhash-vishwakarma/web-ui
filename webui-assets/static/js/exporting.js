/*
 Highcharts JS v9.1.0 (2021-05-03)

 Exporting module

 (c) 2010-2021 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (c) {
  "object" === typeof module && module.exports
    ? ((c["default"] = c), (module.exports = c))
    : "function" === typeof define && define.amd
    ? define("highcharts/modules/exporting", ["highcharts"], function (q) {
        c(q);
        c.Highcharts = q;
        return c;
      })
    : c("undefined" !== typeof Highcharts ? Highcharts : void 0);
})(function (c) {
  function q(c, m, h, k) {
    c.hasOwnProperty(m) || (c[m] = k.apply(null, h));
  }
  c = c ? c._modules : {};
  q(
    c,
    "Extensions/FullScreen.js",
    [
      c["Core/Chart/Chart.js"],
      c["Core/Globals.js"],
      c["Core/Renderer/HTML/AST.js"],
      c["Core/Utilities.js"],
    ],
    function (c, m, h, k) {
      var n = k.addEvent;
      k = (function () {
        function c(e) {
          this.chart = e;
          this.isOpen = !1;
          e = e.renderTo;
          this.browserProps ||
            ("function" === typeof e.requestFullscreen
              ? (this.browserProps = {
                  fullscreenChange: "fullscreenchange",
                  requestFullscreen: "requestFullscreen",
                  exitFullscreen: "exitFullscreen",
                })
              : e.mozRequestFullScreen
              ? (this.browserProps = {
                  fullscreenChange: "mozfullscreenchange",
                  requestFullscreen: "mozRequestFullScreen",
                  exitFullscreen: "mozCancelFullScreen",
                })
              : e.webkitRequestFullScreen
              ? (this.browserProps = {
                  fullscreenChange: "webkitfullscreenchange",
                  requestFullscreen: "webkitRequestFullScreen",
                  exitFullscreen: "webkitExitFullscreen",
                })
              : e.msRequestFullscreen &&
                (this.browserProps = {
                  fullscreenChange: "MSFullscreenChange",
                  requestFullscreen: "msRequestFullscreen",
                  exitFullscreen: "msExitFullscreen",
                }));
        }
        c.prototype.close = function () {
          var e = this.chart,
            c = e.options.chart;
          if (
            this.isOpen &&
            this.browserProps &&
            e.container.ownerDocument instanceof Document
          )
            e.container.ownerDocument[this.browserProps.exitFullscreen]();
          this.unbindFullscreenEvent &&
            (this.unbindFullscreenEvent = this.unbindFullscreenEvent());
          e.setSize(this.origWidth, this.origHeight, !1);
          this.origHeight = this.origWidth = void 0;
          c.width = this.origWidthOption;
          c.height = this.origHeightOption;
          this.origHeightOption = this.origWidthOption = void 0;
          this.isOpen = !1;
          this.setButtonText();
        };
        c.prototype.open = function () {
          var e = this,
            c = e.chart,
            h = c.options.chart;
          h && ((e.origWidthOption = h.width), (e.origHeightOption = h.height));
          e.origWidth = c.chartWidth;
          e.origHeight = c.chartHeight;
          if (e.browserProps) {
            var k = n(
                c.container.ownerDocument,
                e.browserProps.fullscreenChange,
                function () {
                  e.isOpen
                    ? ((e.isOpen = !1), e.close())
                    : (c.setSize(null, null, !1),
                      (e.isOpen = !0),
                      e.setButtonText());
                }
              ),
              m = n(c, "destroy", k);
            e.unbindFullscreenEvent = function () {
              k();
              m();
            };
            if ((h = c.renderTo[e.browserProps.requestFullscreen]()))
              h["catch"](function () {
                alert("Full screen is not supported inside a frame.");
              });
          }
        };
        c.prototype.setButtonText = function () {
          var e = this.chart,
            c = e.exportDivElements,
            k = e.options.exporting,
            m = k && k.buttons && k.buttons.contextButton.menuItems;
          e = e.options.lang;
          k &&
            k.menuItemDefinitions &&
            e &&
            e.exitFullscreen &&
            e.viewFullscreen &&
            m &&
            c &&
            c.length &&
            h.setElementHTML(
              c[m.indexOf("viewFullscreen")],
              this.isOpen
                ? e.exitFullscreen
                : k.menuItemDefinitions.viewFullscreen.text || e.viewFullscreen
            );
        };
        c.prototype.toggle = function () {
          this.isOpen ? this.close() : this.open();
        };
        return c;
      })();
      m.Fullscreen = k;
      n(c, "beforeRender", function () {
        this.fullscreen = new m.Fullscreen(this);
      });
      return m.Fullscreen;
    }
  );
  q(c, "Mixins/Navigation.js", [], function () {
    return {
      initUpdate: function (c) {
        c.navigation ||
          (c.navigation = {
            updates: [],
            update: function (c, h) {
              this.updates.forEach(function (k) {
                k.update.call(k.context, c, h);
              });
            },
          });
      },
      addUpdate: function (c, m) {
        m.navigation || this.initUpdate(m);
        m.navigation.updates.push({ update: c, context: m });
      },
    };
  });
  q(
    c,
    "Extensions/Exporting.js",
    [
      c["Core/Chart/Chart.js"],
      c["Mixins/Navigation.js"],
      c["Core/Globals.js"],
      c["Core/Options.js"],
      c["Core/Color/Palette.js"],
      c["Core/Renderer/SVG/SVGRenderer.js"],
      c["Core/Utilities.js"],
    ],
    function (c, m, h, k, n, q, e) {
      var z = h.doc,
        G = h.isTouchDevice,
        B = h.win;
      k = k.defaultOptions;
      var x = e.addEvent,
        r = e.css,
        y = e.createElement,
        E = e.discardElement,
        A = e.extend,
        H = e.find,
        D = e.fireEvent,
        I = e.isObject,
        p = e.merge,
        F = e.objectEach,
        t = e.pick,
        J = e.removeEvent,
        K = e.uniqueKey;
      A(k.lang, {
        viewFullscreen: "View in full screen",
        exitFullscreen: "Exit from full screen",
        printChart: "Print chart",
        downloadPNG: "Download PNG image",
        downloadJPEG: "Download JPEG image",
        downloadPDF: "Download PDF document",
        downloadSVG: "Download SVG vector image",
        contextButtonTitle: "Chart context menu",
      });
      k.navigation || (k.navigation = {});
      p(!0, k.navigation, {
        buttonOptions: {
          theme: {},
          symbolSize: 14,
          symbolX: 12.5,
          symbolY: 10.5,
          align: "right",
          buttonSpacing: 3,
          height: 22,
          verticalAlign: "top",
          width: 24,
        },
      });
      p(!0, k.navigation, {
        menuStyle: {
          border: "1px solid " + n.neutralColor40,
          background: n.backgroundColor,
          padding: "5px 0",
        },
        menuItemStyle: {
          padding: "0.5em 1em",
          color: n.neutralColor80,
          background: "none",
          fontSize: G ? "14px" : "11px",
          transition: "background 250ms, color 250ms",
        },
        menuItemHoverStyle: {
          background: n.highlightColor80,
          color: n.backgroundColor,
        },
        buttonOptions: {
          symbolFill: n.neutralColor60,
          symbolStroke: n.neutralColor60,
          symbolStrokeWidth: 3,
          theme: { padding: 5 },
        },
      });
      k.exporting = {
        type: "image/png",
        url: "https://export.highcharts.com/",
        printMaxWidth: 780,
        scale: 2,
        buttons: {
          contextButton: {
            className: "highcharts-contextbutton",
            menuClassName: "highcharts-contextmenu",
            symbol: "menu",
            titleKey: "contextButtonTitle",
            menuItems:
              "viewFullscreen printChart separator downloadPNG downloadJPEG downloadPDF downloadSVG".split(
                " "
              ),
          },
        },
        menuItemDefinitions: {
          viewFullscreen: {
            textKey: "viewFullscreen",
            onclick: function () {
              this.fullscreen.toggle();
            },
          },
          printChart: {
            textKey: "printChart",
            onclick: function () {
              this.print();
            },
          },
          separator: { separator: !0 },
          downloadPNG: {
            textKey: "downloadPNG",
            onclick: function () {
              this.exportChart();
            },
          },
          downloadJPEG: {
            textKey: "downloadJPEG",
            onclick: function () {
              this.exportChart({ type: "image/jpeg" });
            },
          },
          downloadPDF: {
            textKey: "downloadPDF",
            onclick: function () {
              this.exportChart({ type: "application/pdf" });
            },
          },
          downloadSVG: {
            textKey: "downloadSVG",
            onclick: function () {
              this.exportChart({ type: "image/svg+xml" });
            },
          },
        },
      };
      h.post = function (a, b, f) {
        var d = y(
          "form",
          p({ method: "post", action: a, enctype: "multipart/form-data" }, f),
          { display: "none" },
          z.body
        );
        F(b, function (a, b) {
          y("input", { type: "hidden", name: b, value: a }, null, d);
        });
        d.submit();
        E(d);
      };
      h.isSafari &&
        h.win.matchMedia("print").addListener(function (a) {
          h.printingChart &&
            (a.matches
              ? h.printingChart.beforePrint()
              : h.printingChart.afterPrint());
        });
      A(c.prototype, {
        sanitizeSVG: function (a, b) {
          var f = a.indexOf("</svg>") + 6,
            d = a.substr(f);
          a = a.substr(0, f);
          b &&
            b.exporting &&
            b.exporting.allowHTML &&
            d &&
            ((d =
              '<foreignObject x="0" y="0" width="' +
              b.chart.width +
              '" height="' +
              b.chart.height +
              '"><body xmlns="http://www.w3.org/1999/xhtml">' +
              d.replace(/(<(?:img|br).*?(?=>))>/g, "$1 />") +
              "</body></foreignObject>"),
            (a = a.replace("</svg>", d + "</svg>")));
          a = a
            .replace(/zIndex="[^"]+"/g, "")
            .replace(/symbolName="[^"]+"/g, "")
            .replace(/jQuery[0-9]+="[^"]+"/g, "")
            .replace(/url\(("|&quot;)(.*?)("|&quot;);?\)/g, "url($2)")
            .replace(/url\([^#]+#/g, "url(#")
            .replace(
              /<svg /,
              '<svg xmlns:xlink="http://www.w3.org/1999/xlink" '
            )
            .replace(/ (|NS[0-9]+:)href=/g, " xlink:href=")
            .replace(/\n/, " ")
            .replace(
              /(fill|stroke)="rgba\(([ 0-9]+,[ 0-9]+,[ 0-9]+),([ 0-9\.]+)\)"/g,
              '$1="rgb($2)" $1-opacity="$3"'
            )
            .replace(/&nbsp;/g, "\u00a0")
            .replace(/&shy;/g, "\u00ad");
          this.ieSanitizeSVG && (a = this.ieSanitizeSVG(a));
          return a;
        },
        getChartHTML: function () {
          this.styledMode && this.inlineStyles();
          return this.container.innerHTML;
        },
        getSVG: function (a) {
          var b,
            f = p(this.options, a);
          f.plotOptions = p(this.userOptions.plotOptions, a && a.plotOptions);
          f.time = p(this.userOptions.time, a && a.time);
          var d = y(
            "div",
            null,
            {
              position: "absolute",
              top: "-9999em",
              width: this.chartWidth + "px",
              height: this.chartHeight + "px",
            },
            z.body
          );
          var e = this.renderTo.style.width;
          var u = this.renderTo.style.height;
          e =
            f.exporting.sourceWidth ||
            f.chart.width ||
            (/px$/.test(e) && parseInt(e, 10)) ||
            (f.isGantt ? 800 : 600);
          u =
            f.exporting.sourceHeight ||
            f.chart.height ||
            (/px$/.test(u) && parseInt(u, 10)) ||
            400;
          A(f.chart, {
            animation: !1,
            renderTo: d,
            forExport: !0,
            renderer: "SVGRenderer",
            width: e,
            height: u,
          });
          f.exporting.enabled = !1;
          delete f.data;
          f.series = [];
          this.series.forEach(function (a) {
            b = p(a.userOptions, {
              animation: !1,
              enableMouseTracking: !1,
              showCheckbox: !1,
              visible: a.visible,
            });
            b.isInternal || f.series.push(b);
          });
          var h = {};
          this.axes.forEach(function (a) {
            a.userOptions.internalKey || (a.userOptions.internalKey = K());
            a.options.isInternal ||
              (h[a.coll] || ((h[a.coll] = !0), (f[a.coll] = [])),
              f[a.coll].push(p(a.userOptions, { visible: a.visible })));
          });
          var g = new c(f, this.callback);
          a &&
            ["xAxis", "yAxis", "series"].forEach(function (b) {
              var d = {};
              a[b] && ((d[b] = a[b]), g.update(d));
            });
          this.axes.forEach(function (a) {
            var b = H(g.axes, function (b) {
                return b.options.internalKey === a.userOptions.internalKey;
              }),
              d = a.getExtremes(),
              f = d.userMin;
            d = d.userMax;
            b &&
              (("undefined" !== typeof f && f !== b.min) ||
                ("undefined" !== typeof d && d !== b.max)) &&
              b.setExtremes(f, d, !0, !1);
          });
          e = g.getChartHTML();
          D(this, "getSVG", { chartCopy: g });
          e = this.sanitizeSVG(e, f);
          f = null;
          g.destroy();
          E(d);
          return e;
        },
        getSVGForExport: function (a, b) {
          var f = this.options.exporting;
          return this.getSVG(
            p({ chart: { borderRadius: 0 } }, f.chartOptions, b, {
              exporting: {
                sourceWidth: (a && a.sourceWidth) || f.sourceWidth,
                sourceHeight: (a && a.sourceHeight) || f.sourceHeight,
              },
            })
          );
        },
        getFilename: function () {
          var a = this.userOptions.title && this.userOptions.title.text,
            b = this.options.exporting.filename;
          if (b) return b.replace(/\//g, "-");
          "string" === typeof a &&
            (b = a
              .toLowerCase()
              .replace(/<\/?[^>]+(>|$)/g, "")
              .replace(/[\s_]+/g, "-")
              .replace(/[^a-z0-9\-]/g, "")
              .replace(/^[\-]+/g, "")
              .replace(/[\-]+/g, "-")
              .substr(0, 24)
              .replace(/[\-]+$/g, ""));
          if (!b || 5 > b.length) b = "chart";
          return b;
        },
        exportChart: function (a, b) {
          b = this.getSVGForExport(a, b);
          a = p(this.options.exporting, a);
          h.post(
            a.url,
            {
              filename: a.filename
                ? a.filename.replace(/\//g, "-")
                : this.getFilename(),
              type: a.type,
              width: a.width || 0,
              scale: a.scale,
              svg: b,
            },
            a.formAttributes
          );
        },
        moveContainers: function (a) {
          (this.fixedDiv
            ? [this.fixedDiv, this.scrollingContainer]
            : [this.container]
          ).forEach(function (b) {
            a.appendChild(b);
          });
        },
        beforePrint: function () {
          var a = z.body,
            b = this.options.exporting.printMaxWidth,
            f = {
              childNodes: a.childNodes,
              origDisplay: [],
              resetParams: void 0,
            };
          this.isPrinting = !0;
          this.pointer.reset(null, 0);
          D(this, "beforePrint");
          b &&
            this.chartWidth > b &&
            ((f.resetParams = [this.options.chart.width, void 0, !1]),
            this.setSize(b, void 0, !1));
          [].forEach.call(f.childNodes, function (a, b) {
            1 === a.nodeType &&
              ((f.origDisplay[b] = a.style.display),
              (a.style.display = "none"));
          });
          this.moveContainers(a);
          this.printReverseInfo = f;
        },
        afterPrint: function () {
          if (this.printReverseInfo) {
            var a = this.printReverseInfo.childNodes,
              b = this.printReverseInfo.origDisplay,
              f = this.printReverseInfo.resetParams;
            this.moveContainers(this.renderTo);
            [].forEach.call(a, function (a, f) {
              1 === a.nodeType && (a.style.display = b[f] || "");
            });
            this.isPrinting = !1;
            f && this.setSize.apply(this, f);
            delete this.printReverseInfo;
            delete h.printingChart;
            D(this, "afterPrint");
          }
        },
        print: function () {
          var a = this;
          a.isPrinting ||
            ((h.printingChart = a),
            h.isSafari || a.beforePrint(),
            setTimeout(function () {
              B.focus();
              B.print();
              h.isSafari ||
                setTimeout(function () {
                  a.afterPrint();
                }, 1e3);
            }, 1));
        },
        contextMenu: function (a, b, f, d, c, h, k) {
          var g = this,
            u = g.options.navigation,
            m = g.chartWidth,
            C = g.chartHeight,
            v = "cache-" + a,
            l = g[v],
            w = Math.max(c, h);
          if (!l) {
            g.exportContextMenu =
              g[v] =
              l =
                y(
                  "div",
                  { className: a },
                  {
                    position: "absolute",
                    zIndex: 1e3,
                    padding: w + "px",
                    pointerEvents: "auto",
                  },
                  g.fixedDiv || g.container
                );
            var p = y(
              "ul",
              { className: "highcharts-menu" },
              { listStyle: "none", margin: 0, padding: 0 },
              l
            );
            g.styledMode ||
              r(
                p,
                A(
                  {
                    MozBoxShadow: "3px 3px 10px #888",
                    WebkitBoxShadow: "3px 3px 10px #888",
                    boxShadow: "3px 3px 10px #888",
                  },
                  u.menuStyle
                )
              );
            l.hideMenu = function () {
              r(l, { display: "none" });
              k && k.setState(0);
              g.openMenu = !1;
              r(g.renderTo, { overflow: "hidden" });
              r(g.container, { overflow: "hidden" });
              e.clearTimeout(l.hideTimer);
              D(g, "exportMenuHidden");
            };
            g.exportEvents.push(
              x(l, "mouseleave", function () {
                l.hideTimer = B.setTimeout(l.hideMenu, 500);
              }),
              x(l, "mouseenter", function () {
                e.clearTimeout(l.hideTimer);
              }),
              x(z, "mouseup", function (b) {
                g.pointer.inClass(b.target, a) || l.hideMenu();
              }),
              x(l, "click", function () {
                g.openMenu && l.hideMenu();
              })
            );
            b.forEach(function (a) {
              "string" === typeof a &&
                (a = g.options.exporting.menuItemDefinitions[a]);
              if (I(a, !0)) {
                var b = void 0;
                a.separator
                  ? (b = y("hr", null, null, p))
                  : ("viewData" === a.textKey &&
                      g.isDataTableVisible &&
                      (a.textKey = "hideData"),
                    (b = y(
                      "li",
                      {
                        className: "highcharts-menu-item",
                        onclick: function (b) {
                          b && b.stopPropagation();
                          l.hideMenu();
                          a.onclick && a.onclick.apply(g, arguments);
                        },
                      },
                      null,
                      p
                    )),
                    b.appendChild(
                      z.createTextNode(a.text || g.options.lang[a.textKey])
                    ),
                    g.styledMode ||
                      ((b.onmouseover = function () {
                        r(this, u.menuItemHoverStyle);
                      }),
                      (b.onmouseout = function () {
                        r(this, u.menuItemStyle);
                      }),
                      r(b, A({ cursor: "pointer" }, u.menuItemStyle))));
                g.exportDivElements.push(b);
              }
            });
            g.exportDivElements.push(p, l);
            g.exportMenuWidth = l.offsetWidth;
            g.exportMenuHeight = l.offsetHeight;
          }
          b = { display: "block" };
          f + g.exportMenuWidth > m
            ? (b.right = m - f - c - w + "px")
            : (b.left = f - w + "px");
          d + h + g.exportMenuHeight > C &&
          "top" !== k.alignOptions.verticalAlign
            ? (b.bottom = C - d - w + "px")
            : (b.top = d + h - w + "px");
          r(l, b);
          r(g.renderTo, { overflow: "" });
          r(g.container, { overflow: "" });
          g.openMenu = !0;
          D(g, "exportMenuShown");
        },
        addButton: function (a) {
          var b = this,
            f = b.renderer,
            d = p(b.options.navigation.buttonOptions, a),
            c = d.onclick,
            e = d.menuItems,
            h = d.symbolSize || 12;
          b.btnCount || (b.btnCount = 0);
          b.exportDivElements ||
            ((b.exportDivElements = []), (b.exportSVGElements = []));
          if (!1 !== d.enabled && d.theme) {
            var g = d.theme,
              k = g.states,
              m = k && k.hover;
            k = k && k.select;
            var C;
            b.styledMode ||
              ((g.fill = t(g.fill, n.backgroundColor)),
              (g.stroke = t(g.stroke, "none")));
            delete g.states;
            c
              ? (C = function (a) {
                  a && a.stopPropagation();
                  c.call(b, a);
                })
              : e &&
                (C = function (a) {
                  a && a.stopPropagation();
                  b.contextMenu(
                    v.menuClassName,
                    e,
                    v.translateX,
                    v.translateY,
                    v.width,
                    v.height,
                    v
                  );
                  v.setState(2);
                });
            d.text && d.symbol
              ? (g.paddingLeft = t(g.paddingLeft, 30))
              : d.text ||
                A(g, { width: d.width, height: d.height, padding: 0 });
            b.styledMode ||
              ((g["stroke-linecap"] = "round"),
              (g.fill = t(g.fill, n.backgroundColor)),
              (g.stroke = t(g.stroke, "none")));
            var v = f
              .button(d.text, 0, 0, C, g, m, k)
              .addClass(a.className)
              .attr({
                title: t(b.options.lang[d._titleKey || d.titleKey], ""),
              });
            v.menuClassName =
              a.menuClassName || "highcharts-menu-" + b.btnCount++;
            if (d.symbol) {
              var l = f
                .symbol(d.symbol, d.symbolX - h / 2, d.symbolY - h / 2, h, h, {
                  width: h,
                  height: h,
                })
                .addClass("highcharts-button-symbol")
                .attr({ zIndex: 1 })
                .add(v);
              b.styledMode ||
                l.attr({
                  stroke: d.symbolStroke,
                  fill: d.symbolFill,
                  "stroke-width": d.symbolStrokeWidth || 1,
                });
            }
            v.add(b.exportingGroup).align(
              A(d, { width: v.width, x: t(d.x, b.buttonOffset) }),
              !0,
              "spacingBox"
            );
            b.buttonOffset +=
              (v.width + d.buttonSpacing) * ("right" === d.align ? -1 : 1);
            b.exportSVGElements.push(v, l);
          }
        },
        destroyExport: function (a) {
          var b = a ? a.target : this;
          a = b.exportSVGElements;
          var f = b.exportDivElements,
            d = b.exportEvents,
            c;
          a &&
            (a.forEach(function (a, d) {
              a &&
                ((a.onclick = a.ontouchstart = null),
                (c = "cache-" + a.menuClassName),
                b[c] && delete b[c],
                (b.exportSVGElements[d] = a.destroy()));
            }),
            (a.length = 0));
          b.exportingGroup &&
            (b.exportingGroup.destroy(), delete b.exportingGroup);
          f &&
            (f.forEach(function (a, d) {
              e.clearTimeout(a.hideTimer);
              J(a, "mouseleave");
              b.exportDivElements[d] =
                a.onmouseout =
                a.onmouseover =
                a.ontouchstart =
                a.onclick =
                  null;
              E(a);
            }),
            (f.length = 0));
          d &&
            (d.forEach(function (a) {
              a();
            }),
            (d.length = 0));
        },
      });
      q.prototype.inlineToAttributes =
        "fill stroke strokeLinecap strokeLinejoin strokeWidth textAnchor x y".split(
          " "
        );
      q.prototype.inlineBlacklist = [
        /-/,
        /^(clipPath|cssText|d|height|width)$/,
        /^font$/,
        /[lL]ogical(Width|Height)$/,
        /perspective/,
        /TapHighlightColor/,
        /^transition/,
        /^length$/,
      ];
      q.prototype.unstyledElements = ["clipPath", "defs", "desc"];
      c.prototype.inlineStyles = function () {
        function a(a) {
          return a.replace(/([A-Z])/g, function (a, b) {
            return "-" + b.toLowerCase();
          });
        }
        function b(c) {
          function f(b, f) {
            w = r = !1;
            if (k) {
              for (t = k.length; t-- && !r; ) r = k[t].test(f);
              w = !r;
            }
            "transform" === f && "none" === b && (w = !0);
            for (t = e.length; t-- && !w; )
              w = e[t].test(f) || "function" === typeof b;
            w ||
              (z[f] === b && "svg" !== c.nodeName) ||
              g[c.nodeName][f] === b ||
              (d && -1 === d.indexOf(f)
                ? (l += a(f) + ":" + b + ";")
                : b && c.setAttribute(a(f), b));
          }
          var l = "",
            w,
            r,
            t;
          if (1 === c.nodeType && -1 === m.indexOf(c.nodeName)) {
            var u = B.getComputedStyle(c, null);
            var z =
              "svg" === c.nodeName
                ? {}
                : B.getComputedStyle(c.parentNode, null);
            if (!g[c.nodeName]) {
              n = q.getElementsByTagName("svg")[0];
              var x = q.createElementNS(c.namespaceURI, c.nodeName);
              n.appendChild(x);
              g[c.nodeName] = p(B.getComputedStyle(x, null));
              "text" === c.nodeName && delete g.text.fill;
              n.removeChild(x);
            }
            if (h.isFirefox || h.isMS) for (var y in u) f(u[y], y);
            else F(u, f);
            l &&
              ((u = c.getAttribute("style")),
              c.setAttribute("style", (u ? u + ";" : "") + l));
            "svg" === c.nodeName && c.setAttribute("stroke-width", "1px");
            "text" !== c.nodeName &&
              [].forEach.call(c.children || c.childNodes, b);
          }
        }
        var c = this.renderer,
          d = c.inlineToAttributes,
          e = c.inlineBlacklist,
          k = c.inlineWhitelist,
          m = c.unstyledElements,
          g = {},
          n;
        c = z.createElement("iframe");
        r(c, { width: "1px", height: "1px", visibility: "hidden" });
        z.body.appendChild(c);
        var q = c.contentWindow.document;
        q.open();
        q.write('<svg xmlns="http://www.w3.org/2000/svg"></svg>');
        q.close();
        b(this.container.querySelector("svg"));
        n.parentNode.removeChild(n);
        c.parentNode.removeChild(c);
      };
      h.Renderer.prototype.symbols.menu = function (a, b, c, d) {
        return [
          ["M", a, b + 2.5],
          ["L", a + c, b + 2.5],
          ["M", a, b + d / 2 + 0.5],
          ["L", a + c, b + d / 2 + 0.5],
          ["M", a, b + d - 1.5],
          ["L", a + c, b + d - 1.5],
        ];
      };
      h.Renderer.prototype.symbols.menuball = function (a, b, c, d) {
        a = [];
        d = d / 3 - 2;
        return (a = a.concat(
          this.circle(c - d, b, d, d),
          this.circle(c - d, b + d + 4, d, d),
          this.circle(c - d, b + 2 * (d + 4), d, d)
        ));
      };
      c.prototype.renderExporting = function () {
        var a = this,
          b = a.options.exporting,
          c = b.buttons,
          d = a.isDirtyExporting || !a.exportSVGElements;
        a.buttonOffset = 0;
        a.isDirtyExporting && a.destroyExport();
        d &&
          !1 !== b.enabled &&
          ((a.exportEvents = []),
          (a.exportingGroup =
            a.exportingGroup ||
            a.renderer.g("exporting-group").attr({ zIndex: 3 }).add()),
          F(c, function (b) {
            a.addButton(b);
          }),
          (a.isDirtyExporting = !1));
      };
      x(c, "init", function () {
        var a = this;
        a.exporting = {
          update: function (b, c) {
            a.isDirtyExporting = !0;
            p(!0, a.options.exporting, b);
            t(c, !0) && a.redraw();
          },
        };
        m.addUpdate(function (b, c) {
          a.isDirtyExporting = !0;
          p(!0, a.options.navigation, b);
          t(c, !0) && a.redraw();
        }, a);
      });
      c.prototype.callbacks.push(function (a) {
        a.renderExporting();
        x(a, "redraw", a.renderExporting);
        x(a, "destroy", a.destroyExport);
      });
    }
  );
  q(c, "masters/modules/exporting.src.js", [], function () {});
});
//# sourceMappingURL=exporting.js.map
