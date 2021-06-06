/*
 Highcharts JS v9.1.0 (2021-05-03)

 Exporting module

 (c) 2010-2021 Torstein Honsi

 License: www.highcharts.com/license
*/
(function (a) {
  "object" === typeof module && module.exports
    ? ((a["default"] = a), (module.exports = a))
    : "function" === typeof define && define.amd
    ? define(
        "highcharts/modules/export-data",
        ["highcharts", "highcharts/modules/exporting"],
        function (l) {
          a(l);
          a.Highcharts = l;
          return a;
        }
      )
    : a("undefined" !== typeof Highcharts ? Highcharts : void 0);
})(function (a) {
  function l(a, b, u, f) {
    a.hasOwnProperty(b) || (a[b] = f.apply(null, u));
  }
  a = a ? a._modules : {};
  l(a, "Extensions/DownloadURL.js", [a["Core/Globals.js"]], function (a) {
    var b = a.win,
      u = b.document,
      f = b.URL || b.webkitURL || b,
      y = (a.dataURLtoBlob = function (a) {
        if (
          (a = a
            .replace(/filename=.*;/, "")
            .match(/data:([^;]*)(;base64)?,([0-9A-Za-z+/]+)/)) &&
          3 < a.length &&
          b.atob &&
          b.ArrayBuffer &&
          b.Uint8Array &&
          b.Blob &&
          f.createObjectURL
        ) {
          var d = b.atob(a[3]),
            g = new b.ArrayBuffer(d.length);
          g = new b.Uint8Array(g);
          for (var n = 0; n < g.length; ++n) g[n] = d.charCodeAt(n);
          a = new b.Blob([g], { type: a[1] });
          return f.createObjectURL(a);
        }
      });
    a = a.downloadURL = function (a, f) {
      var g = b.navigator,
        n = u.createElement("a");
      if ("string" === typeof a || a instanceof String || !g.msSaveOrOpenBlob) {
        a = "" + a;
        if (/Edge\/\d+/.test(g.userAgent) || 2e6 < a.length)
          if (((a = y(a) || ""), !a)) throw Error("Failed to convert to blob");
        if ("undefined" !== typeof n.download)
          (n.href = a),
            (n.download = f),
            u.body.appendChild(n),
            n.click(),
            u.body.removeChild(n);
        else
          try {
            var k = b.open(a, "chart");
            if ("undefined" === typeof k || null === k)
              throw Error("Failed to open window");
          } catch (t) {
            b.location.href = a;
          }
      } else g.msSaveOrOpenBlob(a, f);
    };
    return { dataURLtoBlob: y, downloadURL: a };
  });
  l(
    a,
    "Extensions/ExportData.js",
    [
      a["Core/Axis/Axis.js"],
      a["Core/Chart/Chart.js"],
      a["Core/Renderer/HTML/AST.js"],
      a["Core/Globals.js"],
      a["Core/Options.js"],
      a["Core/Utilities.js"],
      a["Extensions/DownloadURL.js"],
    ],
    function (a, b, u, f, y, d, l) {
      function g(a, b) {
        var c = t.navigator,
          w =
            -1 < c.userAgent.indexOf("WebKit") &&
            0 > c.userAgent.indexOf("Chrome"),
          D = t.URL || t.webkitURL || t;
        try {
          if (c.msSaveOrOpenBlob && t.MSBlobBuilder) {
            var r = new t.MSBlobBuilder();
            r.append(a);
            return r.getBlob("image/svg+xml");
          }
          if (!w)
            return D.createObjectURL(new t.Blob(["\ufeff" + a], { type: b }));
        } catch (O) {}
      }
      var n = f.doc,
        k = f.seriesTypes,
        t = f.win;
      f = y.getOptions;
      y = y.setOptions;
      var J = d.addEvent,
        K = d.defined,
        G = d.extend,
        L = d.find,
        E = d.fireEvent,
        M = d.isNumber,
        x = d.pick,
        H = l.downloadURL;
      y({
        exporting: {
          csv: {
            annotations: { itemDelimiter: "; ", join: !1 },
            columnHeaderFormatter: null,
            dateFormat: "%Y-%m-%d %H:%M:%S",
            decimalPoint: null,
            itemDelimiter: null,
            lineDelimiter: "\n",
          },
          showTable: !1,
          useMultiLevelHeaders: !0,
          useRowspanHeaders: !0,
        },
        lang: {
          downloadCSV: "Download CSV",
          downloadXLS: "Download XLS",
          exportData: {
            annotationHeader: "Annotations",
            categoryHeader: "Category",
            categoryDatetimeHeader: "DateTime",
          },
          viewData: "View data table",
          hideData: "Hide data table",
        },
      });
      J(b, "render", function () {
        this.options &&
          this.options.exporting &&
          this.options.exporting.showTable &&
          !this.options.chart.forExport &&
          !this.dataTableDiv &&
          this.viewData();
      });
      b.prototype.setUpKeyToAxis = function () {
        k.arearange &&
          (k.arearange.prototype.keyToAxis = { low: "y", high: "y" });
        k.gantt && (k.gantt.prototype.keyToAxis = { start: "x", end: "x" });
      };
      b.prototype.getDataRows = function (c) {
        var b = this.hasParallelCoordinates,
          m = this.time,
          C = (this.options.exporting && this.options.exporting.csv) || {},
          D = this.xAxis,
          r = {},
          f = [],
          n = [],
          k = [],
          q;
        var g = this.options.lang.exportData;
        var d = g.categoryHeader,
          N = g.categoryDatetimeHeader,
          v = function (p, b, e) {
            if (C.columnHeaderFormatter) {
              var m = C.columnHeaderFormatter(p, b, e);
              if (!1 !== m) return m;
            }
            return p
              ? p instanceof a
                ? (p.options.title && p.options.title.text) ||
                  (p.dateTime ? N : d)
                : c
                ? {
                    columnTitle: 1 < e ? b : p.name,
                    topLevelColumnTitle: p.name,
                  }
                : p.name + (1 < e ? " (" + b + ")" : "")
              : d;
          },
          I = function (a, b, c) {
            var p = {},
              e = {};
            b.forEach(function (b) {
              var m = ((a.keyToAxis && a.keyToAxis[b]) || b) + "Axis";
              m = M(c) ? a.chart[m][c] : a[m];
              p[b] = (m && m.categories) || [];
              e[b] = m && m.dateTime;
            });
            return { categoryMap: p, dateTimeValueAxisMap: e };
          },
          t = function (a, b) {
            return a.data.filter(function (a) {
              return "undefined" !== typeof a.y && a.name;
            }).length &&
              b &&
              !b.categories &&
              !a.keyToAxis
              ? a.pointArrayMap &&
                a.pointArrayMap.filter(function (a) {
                  return "x" === a;
                }).length
                ? (a.pointArrayMap.unshift("x"), a.pointArrayMap)
                : ["x", "y"]
              : a.pointArrayMap || ["y"];
          },
          h = [];
        var z = 0;
        this.setUpKeyToAxis();
        this.series.forEach(function (a) {
          var e = a.xAxis,
            p = a.options.keys || t(a, e),
            w = p.length,
            f = !a.requireSorting && {},
            g = D.indexOf(e),
            l = I(a, p),
            d;
          if (
            !1 !== a.options.includeInDataExport &&
            !a.options.isInternal &&
            !1 !== a.visible
          ) {
            L(h, function (a) {
              return a[0] === g;
            }) || h.push([g, z]);
            for (d = 0; d < w; )
              (q = v(a, p[d], p.length)),
                k.push(q.columnTitle || q),
                c && n.push(q.topLevelColumnTitle || q),
                d++;
            var B = {
              chart: a.chart,
              autoIncrement: a.autoIncrement,
              options: a.options,
              pointArrayMap: a.pointArrayMap,
            };
            a.options.data.forEach(function (c, v) {
              b && (l = I(a, p, v));
              var h = { series: B };
              a.pointClass.prototype.applyOptions.apply(h, [c]);
              c = h.x;
              var q = a.data[v] && a.data[v].name;
              d = 0;
              if (!e || "name" === a.exportKey || (!b && e && e.hasNames && q))
                c = q;
              f && (f[c] && (c += "|" + v), (f[c] = !0));
              r[c] || ((r[c] = []), (r[c].xValues = []));
              r[c].x = h.x;
              r[c].name = q;
              for (r[c].xValues[g] = h.x; d < w; )
                (v = p[d]),
                  (q = h[v]),
                  (r[c][z + d] = x(
                    l.categoryMap[v][q],
                    l.dateTimeValueAxisMap[v]
                      ? m.dateFormat(C.dateFormat, q)
                      : null,
                    q
                  )),
                  d++;
            });
            z += d;
          }
        });
        for (e in r) Object.hasOwnProperty.call(r, e) && f.push(r[e]);
        var e = c ? [n, k] : [k];
        for (z = h.length; z--; ) {
          var B = h[z][0];
          var F = h[z][1];
          var l = D[B];
          f.sort(function (a, c) {
            return a.xValues[B] - c.xValues[B];
          });
          g = v(l);
          e[0].splice(F, 0, g);
          c && e[1] && e[1].splice(F, 0, g);
          f.forEach(function (a) {
            var c = a.name;
            l &&
              !K(c) &&
              (l.dateTime
                ? (a.x instanceof Date && (a.x = a.x.getTime()),
                  (c = m.dateFormat(C.dateFormat, a.x)))
                : (c = l.categories
                    ? x(l.names[a.x], l.categories[a.x], a.x)
                    : a.x));
            a.splice(F, 0, c);
          });
        }
        e = e.concat(f);
        E(this, "exportData", { dataRows: e });
        return e;
      };
      b.prototype.getCSV = function (a) {
        var c = "",
          b = this.getDataRows(),
          d = this.options.exporting.csv,
          f = x(
            d.decimalPoint,
            "," !== d.itemDelimiter && a ? (1.1).toLocaleString()[1] : "."
          ),
          r = x(d.itemDelimiter, "," === f ? ";" : ","),
          g = d.lineDelimiter;
        b.forEach(function (a, m) {
          for (var d, w = a.length; w--; )
            (d = a[w]),
              "string" === typeof d && (d = '"' + d + '"'),
              "number" === typeof d &&
                "." !== f &&
                (d = d.toString().replace(".", f)),
              (a[w] = d);
          c += a.join(r);
          m < b.length - 1 && (c += g);
        });
        return c;
      };
      b.prototype.getTable = function (a) {
        var c = function (a) {
          if (!a.tagName || "#text" === a.tagName) return a.textContent || "";
          var b = a.attributes,
            d = "<" + a.tagName;
          b &&
            Object.keys(b).forEach(function (a) {
              d += " " + a + '="' + b[a] + '"';
            });
          d += ">";
          d += a.textContent || "";
          (a.children || []).forEach(function (a) {
            d += c(a);
          });
          return (d += "</" + a.tagName + ">");
        };
        a = this.getTableAST(a);
        return c(a);
      };
      b.prototype.getTableAST = function (a) {
        var b = [],
          c = this.options,
          d = a ? (1.1).toLocaleString()[1] : ".",
          f = x(c.exporting.useMultiLevelHeaders, !0);
        a = this.getDataRows(f);
        var g = 0,
          l = f ? a.shift() : null,
          k = a.shift(),
          n = function (a, b, c, f) {
            var h = x(f, "");
            b = "text" + (b ? " " + b : "");
            "number" === typeof h
              ? ((h = h.toString()),
                "," === d && (h = h.replace(".", d)),
                (b = "number"))
              : f || (b = "empty");
            c = G({ class: b }, c);
            return { tagName: a, attributes: c, textContent: h };
          };
        !1 !== c.exporting.tableCaption &&
          b.push({
            tagName: "caption",
            attributes: { class: "highcharts-table-caption" },
            textContent: x(
              c.exporting.tableCaption,
              c.title.text
                ? c.title.text
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .replace(/"/g, "&quot;")
                    .replace(/'/g, "&#x27;")
                    .replace(/\//g, "&#x2F;")
                : "Chart"
            ),
          });
        for (var q = 0, t = a.length; q < t; ++q)
          a[q].length > g && (g = a[q].length);
        b.push(
          (function (a, b, d) {
            var g = [],
              h = 0;
            d = d || (b && b.length);
            var l = 0,
              e;
            if ((e = f && a && b)) {
              a: if (((e = a.length), b.length === e)) {
                for (; e--; )
                  if (a[e] !== b[e]) {
                    e = !1;
                    break a;
                  }
                e = !0;
              } else e = !1;
              e = !e;
            }
            if (e) {
              for (e = []; h < d; ++h) {
                var m = a[h];
                var k = a[h + 1];
                m === k
                  ? ++l
                  : l
                  ? (e.push(
                      n(
                        "th",
                        "highcharts-table-topheading",
                        { scope: "col", colspan: l + 1 },
                        m
                      )
                    ),
                    (l = 0))
                  : (m === b[h]
                      ? c.exporting.useRowspanHeaders
                        ? ((k = 2), delete b[h])
                        : ((k = 1), (b[h] = ""))
                      : (k = 1),
                    (m = n(
                      "th",
                      "highcharts-table-topheading",
                      { scope: "col" },
                      m
                    )),
                    1 < k &&
                      m.attributes &&
                      ((m.attributes.valign = "top"),
                      (m.attributes.rowspan = k)),
                    e.push(m));
              }
              g.push({ tagName: "tr", children: e });
            }
            if (b) {
              e = [];
              h = 0;
              for (d = b.length; h < d; ++h)
                "undefined" !== typeof b[h] &&
                  e.push(n("th", null, { scope: "col" }, b[h]));
              g.push({ tagName: "tr", children: e });
            }
            return { tagName: "thead", children: g };
          })(l, k, Math.max(g, k.length))
        );
        var u = [];
        a.forEach(function (a) {
          for (var b = [], c = 0; c < g; c++)
            b.push(n(c ? "td" : "th", null, c ? {} : { scope: "row" }, a[c]));
          u.push({ tagName: "tr", children: b });
        });
        b.push({ tagName: "tbody", children: u });
        b = {
          tree: {
            tagName: "table",
            id: "highcharts-data-table-" + this.index,
            children: b,
          },
        };
        E(this, "aftergetTableAST", b);
        return b.tree;
      };
      b.prototype.downloadCSV = function () {
        var a = this.getCSV(!0);
        H(
          g(a, "text/csv") || "data:text/csv,\ufeff" + encodeURIComponent(a),
          this.getFilename() + ".csv"
        );
      };
      b.prototype.downloadXLS = function () {
        var a =
          '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head>\x3c!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Ark1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--\x3e<style>td{border:none;font-family: Calibri, sans-serif;} .number{mso-number-format:"0.00";} .text{ mso-number-format:"@";}</style><meta name=ProgId content=Excel.Sheet><meta charset=UTF-8></head><body>' +
          this.getTable(!0) +
          "</body></html>";
        H(
          g(a, "application/vnd.ms-excel") ||
            "data:application/vnd.ms-excel;base64," +
              t.btoa(unescape(encodeURIComponent(a))),
          this.getFilename() + ".xls"
        );
      };
      b.prototype.viewData = function () {
        this.toggleDataTable(!0);
      };
      b.prototype.hideData = function () {
        this.toggleDataTable(!1);
      };
      b.prototype.toggleDataTable = function (a) {
        (a = x(a, !this.isDataTableVisible)) &&
          !this.dataTableDiv &&
          ((this.dataTableDiv = n.createElement("div")),
          (this.dataTableDiv.className = "highcharts-data-table"),
          this.renderTo.parentNode.insertBefore(
            this.dataTableDiv,
            this.renderTo.nextSibling
          ));
        this.dataTableDiv &&
          ((this.dataTableDiv.style.display = a ? "block" : "none"),
          a &&
            ((this.dataTableDiv.innerHTML = ""),
            new u([this.getTableAST()]).addToDOM(this.dataTableDiv),
            E(this, "afterViewData", this.dataTableDiv)));
        this.isDataTableVisible = a;
        a = this.exportDivElements;
        var b = this.options.exporting;
        b = b && b.buttons && b.buttons.contextButton.menuItems;
        var c = this.options.lang;
        A &&
          A.menuItemDefinitions &&
          c &&
          c.viewData &&
          c.hideData &&
          b &&
          a &&
          a.length &&
          u.setElementHTML(
            a[b.indexOf("viewData")],
            this.isDataTableVisible ? c.hideData : c.viewData
          );
      };
      var A = f().exporting;
      A &&
        (G(A.menuItemDefinitions, {
          downloadCSV: {
            textKey: "downloadCSV",
            onclick: function () {
              this.downloadCSV();
            },
          },
          downloadXLS: {
            textKey: "downloadXLS",
            onclick: function () {
              this.downloadXLS();
            },
          },
          viewData: {
            textKey: "viewData",
            onclick: function () {
              this.toggleDataTable();
            },
          },
        }),
        A.buttons &&
          A.buttons.contextButton.menuItems.push(
            "separator",
            "downloadCSV",
            "downloadXLS",
            "viewData"
          ));
      k.map && (k.map.prototype.exportKey = "name");
      k.mapbubble && (k.mapbubble.prototype.exportKey = "name");
      k.treemap && (k.treemap.prototype.exportKey = "name");
    }
  );
  l(a, "masters/modules/export-data.src.js", [], function () {});
});
//# sourceMappingURL=export-data.js.map
