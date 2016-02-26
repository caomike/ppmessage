(function() {
    var define, require, defined = {};
    !function() {
        var a = {};
        define = function(a, b, c) {
            void 0 === c && (c = b), defined[a] = {deps: b,callback: c}
        }, require = function(b) {
            if (a[b])
                return a[b];
            a[b] = {};
            var c = defined[b];
            if (!c)
                throw new Error("Module '" + b + "' not found.");
            for (var d, e = c.deps, f = c.callback, g = [], h = 0, i = e.length; i > h; h++)
                g.push("exports" === e[h] ? d = {} : require(e[h]));
            var j = f.apply(this, g);
            return a[b] = d || j
        }, define.amd = {}
    }(), this._intercom_defined_ = defined, this._intercom_define_ = define, this._intercom_require_ = require;
    var interop = {};
    !function() {
        function a(a) {
            return a && !("prototype" in a)
        }
        var b = Function.prototype.bind;
        interop.hide = function() {
            a(b) || delete Function.prototype.bind
        }, interop.restore = function() {
            b && (Function.prototype.bind = b)
        }
    }(), interop.hide(), function(a, b) {
        if ("function" == typeof define && define.amd)
            define("backbone", ["underscore", "jquery", "exports"], function(c, d, e) {
                a.Backbone = b(a, e, c, d)
            });
        else if ("undefined" != typeof exports) {
            var c = require("underscore");
            b(a, exports, c)
        } else
            a.Backbone = b(a, {}, a._, a.jQuery || a.Zepto || a.ender || a.$)
    }(this, function(a, b, c, d) {
        {
            var e = a.Backbone, f = [], g = (f.push, f.slice);
            f.splice
        }
        b.VERSION = "1.1.2", b.$ = d, b.noConflict = function() {
            return a.Backbone = e, this
        }, b.emulateHTTP = !1, b.emulateJSON = !1;
        var h = b.Events = {on: function(a, b, c) {
            if (!j(this, "on", a, [b, c]) || !b)
                return this;
            this._events || (this._events = {});
            var d = this._events[a] || (this._events[a] = []);
            return d.push({callback: b,context: c,ctx: c || this}), this
        },once: function(a, b, d) {
            if (!j(this, "once", a, [b, d]) || !b)
                return this;
            var e = this, f = c.once(function() {
                e.off(a, f), b.apply(this, arguments)
            });
            return f._callback = b, this.on(a, f, d)
        },off: function(a, b, d) {
            var e, f, g, h, i, k, l, m;
            if (!this._events || !j(this, "off", a, [b, d]))
                return this;
            if (!a && !b && !d)
                return this._events = void 0, this;
            for (h = a ? [a] : c.keys(this._events), i = 0, k = h.length; k > i; i++)
                if (a = h[i], g = this._events[a]) {
                    if (this._events[a] = e = [], b || d)
                        for (l = 0, m = g.length; m > l; l++)
                            f = g[l], (b && b !== f.callback && b !== f.callback._callback || d && d !== f.context) && e.push(f);
                    e.length || delete this._events[a]
                }
            return this
        },trigger: function(a) {
            if (!this._events)
                return this;
            var b = g.call(arguments, 1);
            if (!j(this, "trigger", a, b))
                return this;
            var c = this._events[a], d = this._events.all;
            return c && k(c, b), d && k(d, arguments), this
        },stopListening: function(a, b, d) {
            var e = this._listeningTo;
            if (!e)
                return this;
            var f = !b && !d;
            d || "object" != typeof b || (d = this), a && ((e = {})[a._listenId] = a);
            for (var g in e)
                a = e[g], a.off(b, d, this), (f || c.isEmpty(a._events)) && delete this._listeningTo[g];
            return this
        }}, i = /\s+/, j = function(a, b, c, d) {
            if (!c)
                return !0;
            if ("object" == typeof c) {
                for (var e in c)
                    a[b].apply(a, [e, c[e]].concat(d));
                return !1
            }
            if (i.test(c)) {
                for (var f = c.split(i), g = 0, h = f.length; h > g; g++)
                    a[b].apply(a, [f[g]].concat(d));
                return !1
            }
            return !0
        }, k = function(a, b) {
            var c, d = -1, e = a.length, f = b[0], g = b[1], h = b[2];
            switch (b.length) {
            case 0:
                for (; ++d < e; )
                    (c = a[d]).callback.call(c.ctx);
                return;
            case 1:
                for (; ++d < e; )
                    (c = a[d]).callback.call(c.ctx, f);
                return;
            case 2:
                for (; ++d < e; )
                    (c = a[d]).callback.call(c.ctx, f, g);
                return;
            case 3:
                for (; ++d < e; )
                    (c = a[d]).callback.call(c.ctx, f, g, h);
                return;
            default:
                for (; ++d < e; )
                    (c = a[d]).callback.apply(c.ctx, b);
                return
            }
        }, l = {listenTo: "on",listenToOnce: "once"};
        c.each(l, function(a, b) {
            h[b] = function(b, d, e) {
                var f = this._listeningTo || (this._listeningTo = {}), g = b._listenId || (b._listenId = c.uniqueId("l"));
                return f[g] = b, e || "object" != typeof d || (e = this), b[a](d, e, this), this
            }
        }), h.bind = h.on, h.unbind = h.off, c.extend(b, h);
        var m = b.Model = function(a, b) {
            var d = a || {};
            b || (b = {}), this.cid = c.uniqueId("c"), this.attributes = {}, b.collection && (this.collection = b.collection), b.parse && (d = this.parse(d, b) || {}), d = c.defaults({}, d, c.result(this, "defaults")), this.set(d, b), this.changed = {}, this.initialize.apply(this, arguments)
        };
        c.extend(m.prototype, h, {changed: null,validationError: null,idAttribute: "id",initialize: function() {
        },toJSON: function() {
            return c.clone(this.attributes)
        },sync: function() {
            return b.sync.apply(this, arguments)
        },get: function(a) {
            return this.attributes[a]
        },escape: function(a) {
            return c.escape(this.get(a))
        },has: function(a) {
            return null != this.get(a)
        },set: function(a, b, d) {
            var e, f, g, h, i, j, k, l;
            if (null == a)
                return this;
            if ("object" == typeof a ? (f = a, d = b) : (f = {})[a] = b, d || (d = {}), !this._validate(f, d))
                return !1;
            g = d.unset, i = d.silent, h = [], j = this._changing, this._changing = !0, j || (this._previousAttributes = c.clone(this.attributes), this.changed = {}), l = this.attributes, k = this._previousAttributes, this.idAttribute in f && (this.id = f[this.idAttribute]);
            for (e in f)
                b = f[e], c.isEqual(l[e], b) || h.push(e), c.isEqual(k[e], b) ? delete this.changed[e] : this.changed[e] = b, g ? delete l[e] : l[e] = b;
            if (!i) {
                h.length && (this._pending = d);
                for (var m = 0, n = h.length; n > m; m++)
                    this.trigger("change:" + h[m], this, l[h[m]], d)
            }
            if (j)
                return this;
            if (!i)
                for (; this._pending; )
                    d = this._pending, this._pending = !1, this.trigger("change", this, d);
            return this._pending = !1, this._changing = !1, this
        },unset: function(a, b) {
            return this.set(a, void 0, c.extend({}, b, {unset: !0}))
        },clear: function(a) {
            var b = {};
            for (var d in this.attributes)
                b[d] = void 0;
            return this.set(b, c.extend({}, a, {unset: !0}))
        },hasChanged: function(a) {
            return null == a ? !c.isEmpty(this.changed) : c.has(this.changed, a)
        },changedAttributes: function(a) {
            if (!a)
                return this.hasChanged() ? c.clone(this.changed) : !1;
            var b, d = !1, e = this._changing ? this._previousAttributes : this.attributes;
            for (var f in a)
                c.isEqual(e[f], b = a[f]) || ((d || (d = {}))[f] = b);
            return d
        },previous: function(a) {
            return null != a && this._previousAttributes ? this._previousAttributes[a] : null
        },previousAttributes: function() {
            return c.clone(this._previousAttributes)
        },fetch: function(a) {
            a = a ? c.clone(a) : {}, void 0 === a.parse && (a.parse = !0);
            var b = this, d = a.success;
            return a.success = function(c) {
                return b.set(b.parse(c, a), a) ? (d && d(b, c, a), void b.trigger("sync", b, c, a)) : !1
            }, L(this, a), this.sync("read", this, a)
        },save: function(a, b, d) {
            var e, f, g, h = this.attributes;
            if (null == a || "object" == typeof a ? (e = a, d = b) : (e = {})[a] = b, d = c.extend({validate: !0}, d), e && !d.wait) {
                if (!this.set(e, d))
                    return !1
            } else if (!this._validate(e, d))
                return !1;
            e && d.wait && (this.attributes = c.extend({}, h, e)), void 0 === d.parse && (d.parse = !0);
            var i = this, j = d.success;
            return d.success = function(a) {
                i.attributes = h;
                var b = i.parse(a, d);
                return d.wait && (b = c.extend(e || {}, b)), c.isObject(b) && !i.set(b, d) ? !1 : (j && j(i, a, d), void i.trigger("sync", i, a, d))
            }, L(this, d), f = this.isNew() ? "create" : d.patch ? "patch" : "update", "patch" === f && (d.attrs = e), g = this.sync(f, this, d), e && d.wait && (this.attributes = h), g
        },destroy: function(a) {
            a = a ? c.clone(a) : {};
            var b = this, d = a.success, e = function() {
                b.trigger("destroy", b, b.collection, a)
            };
            if (a.success = function(c) {
                (a.wait || b.isNew()) && e(), d && d(b, c, a), b.isNew() || b.trigger("sync", b, c, a)
            }, this.isNew())
                return a.success(), !1;
            L(this, a);
            var f = this.sync("delete", this, a);
            return a.wait || e(), f
        },url: function() {
            var a = c.result(this, "urlRoot") || c.result(this.collection, "url") || K();
            return this.isNew() ? a : a.replace(/([^\/])$/, "$1/") + encodeURIComponent(this.id)
        },parse: function(a) {
            return a
        },clone: function() {
            return new this.constructor(this.attributes)
        },isNew: function() {
            return !this.has(this.idAttribute)
        },isValid: function(a) {
            return this._validate({}, c.extend(a || {}, {validate: !0}))
        },_validate: function(a, b) {
            if (!b.validate || !this.validate)
                return !0;
            a = c.extend({}, this.attributes, a);
            var d = this.validationError = this.validate(a, b) || null;
            return d ? (this.trigger("invalid", this, d, c.extend(b, {validationError: d})), !1) : !0
        }});
        var n = ["keys", "values", "pairs", "invert", "pick", "omit"];
        c.each(n, function(a) {
            m.prototype[a] = function() {
                var b = g.call(arguments);
                return b.unshift(this.attributes), c[a].apply(c, b)
            }
        });
        var o = b.Collection = function(a, b) {
            b || (b = {}), b.model && (this.model = b.model), void 0 !== b.comparator && (this.comparator = b.comparator), this._reset(), this.initialize.apply(this, arguments), a && this.reset(a, c.extend({silent: !0}, b))
        }, p = {add: !0,remove: !0,merge: !0}, q = {add: !0,remove: !1};
        c.extend(o.prototype, h, {model: m,initialize: function() {
        },toJSON: function(a) {
            return this.map(function(b) {
                return b.toJSON(a)
            })
        },sync: function() {
            return b.sync.apply(this, arguments)
        },add: function(a, b) {
            return this.set(a, c.extend({merge: !1}, b, q))
        },remove: function(a, b) {
            var d = !c.isArray(a);
            a = d ? [a] : c.clone(a), b || (b = {});
            var e, f, g, h;
            for (e = 0, f = a.length; f > e; e++)
                h = a[e] = this.get(a[e]), h && (delete this._byId[h.id], delete this._byId[h.cid], g = this.indexOf(h), this.models.splice(g, 1), this.length--, b.silent || (b.index = g, h.trigger("remove", h, this, b)), this._removeReference(h, b));
            return d ? a[0] : a
        },set: function(a, b) {
            b = c.defaults({}, b, p), b.parse && (a = this.parse(a, b));
            var d = !c.isArray(a);
            a = d ? a ? [a] : [] : c.clone(a);
            var e, f, g, h, i, j, k, l = b.at, n = this.model, o = this.comparator && null == l && b.sort !== !1, q = c.isString(this.comparator) ? this.comparator : null, r = [], s = [], t = {}, u = b.add, v = b.merge, w = b.remove, x = !o && u && w ? [] : !1;
            for (e = 0, f = a.length; f > e; e++) {
                if (i = a[e] || {}, g = i instanceof m ? h = i : i[n.prototype.idAttribute || "id"], j = this.get(g))
                    w && (t[j.cid] = !0), v && (i = i === h ? h.attributes : i, b.parse && (i = j.parse(i, b)), j.set(i, b), o && !k && j.hasChanged(q) && (k = !0)), a[e] = j;
                else if (u) {
                    if (h = a[e] = this._prepareModel(i, b), !h)
                        continue;
                    r.push(h), this._addReference(h, b)
                }
                h = j || h, !x || !h.isNew() && t[h.id] || x.push(h), t[h.id] = !0
            }
            if (w) {
                for (e = 0, f = this.length; f > e; ++e)
                    t[(h = this.models[e]).cid] || s.push(h);
                s.length && this.remove(s, b)
            }
            if (r.length || x && x.length)
                if (o && (k = !0), this.length += r.length, null != l)
                    for (e = 0, f = r.length; f > e; e++)
                        this.models.splice(l + e, 0, r[e]);
            else {
                x && (this.models.length = 0);
                var y = x || r;
                for (e = 0, f = y.length; f > e; e++)
                    this.models.push(y[e])
            }
            if (k && this.sort({silent: !0}), !b.silent) {
                for (e = 0, f = r.length; f > e; e++)
                    (h = r[e]).trigger("add", h, this, b);
                (k || x && x.length) && this.trigger("sort", this, b)
            }
            return d ? a[0] : a
        },reset: function(a, b) {
            b || (b = {});
            for (var d = 0, e = this.models.length; e > d; d++)
                this._removeReference(this.models[d], b);
            return b.previousModels = this.models, this._reset(), a = this.add(a, c.extend({silent: !0}, b)), b.silent || this.trigger("reset", this, b), a
        },push: function(a, b) {
            return this.add(a, c.extend({at: this.length}, b))
        },pop: function(a) {
            var b = this.at(this.length - 1);
            return this.remove(b, a), b
        },unshift: function(a, b) {
            return this.add(a, c.extend({at: 0}, b))
        },shift: function(a) {
            var b = this.at(0);
            return this.remove(b, a), b
        },slice: function() {
            return g.apply(this.models, arguments)
        },get: function(a) {
            return null == a ? void 0 : this._byId[a] || this._byId[a.id] || this._byId[a.cid]
        },at: function(a) {
            return this.models[a]
        },where: function(a, b) {
            return c.isEmpty(a) ? b ? void 0 : [] : this[b ? "find" : "filter"](function(b) {
                for (var c in a)
                    if (a[c] !== b.get(c))
                        return !1;
                return !0
            })
        },findWhere: function(a) {
            return this.where(a, !0)
        },sort: function(a) {
            if (!this.comparator)
                throw new Error("Cannot sort a set without a comparator");
            return a || (a = {}), c.isString(this.comparator) || 1 === this.comparator.length ? this.models = this.sortBy(this.comparator, this) : this.models.sort(c.bind(this.comparator, this)), a.silent || this.trigger("sort", this, a), this
        },pluck: function(a) {
            return c.invoke(this.models, "get", a)
        },fetch: function(a) {
            a = a ? c.clone(a) : {}, void 0 === a.parse && (a.parse = !0);
            var b = a.success, d = this;
            return a.success = function(c) {
                var e = a.reset ? "reset" : "set";
                d[e](c, a), b && b(d, c, a), d.trigger("sync", d, c, a)
            }, L(this, a), this.sync("read", this, a)
        },create: function(a, b) {
            if (b = b ? c.clone(b) : {}, !(a = this._prepareModel(a, b)))
                return !1;
            b.wait || this.add(a, b);
            var d = this, e = b.success;
            return b.success = function(a, c) {
                b.wait && d.add(a, b), e && e(a, c, b)
            }, a.save(null, b), a
        },parse: function(a) {
            return a
        },clone: function() {
            return new this.constructor(this.models)
        },_reset: function() {
            this.length = 0, this.models = [], this._byId = {}
        },_prepareModel: function(a, b) {
            if (a instanceof m)
                return a;
            b = b ? c.clone(b) : {}, b.collection = this;
            var d = new this.model(a, b);
            return d.validationError ? (this.trigger("invalid", this, d.validationError, b), !1) : d
        },_addReference: function(a) {
            this._byId[a.cid] = a, null != a.id && (this._byId[a.id] = a), a.collection || (a.collection = this), a.on("all", this._onModelEvent, this)
        },_removeReference: function(a) {
            this === a.collection && delete a.collection, a.off("all", this._onModelEvent, this)
        },_onModelEvent: function(a, b, c, d) {
            ("add" !== a && "remove" !== a || c === this) && ("destroy" === a && this.remove(b, d), b && a === "change:" + b.idAttribute && (delete this._byId[b.previous(b.idAttribute)], null != b.id && (this._byId[b.id] = b)), this.trigger.apply(this, arguments))
        }});
        var r = ["forEach", "each", "map", "collect", "reduce", "foldl", "inject", "reduceRight", "foldr", "find", "detect", "filter", "select", "reject", "every", "all", "some", "any", "include", "contains", "invoke", "max", "min", "toArray", "size", "first", "head", "take", "initial", "rest", "tail", "drop", "last", "without", "difference", "indexOf", "shuffle", "lastIndexOf", "isEmpty", "chain", "sample"];
        c.each(r, function(a) {
            o.prototype[a] = function() {
                var b = g.call(arguments);
                return b.unshift(this.models), c[a].apply(c, b)
            }
        });
        var s = ["groupBy", "countBy", "sortBy", "indexBy"];
        c.each(s, function(a) {
            o.prototype[a] = function(b, d) {
                var e = c.isFunction(b) ? b : function(a) {
                    return a.get(b)
                };
                return c[a](this.models, e, d)
            }
        });
        var t = b.View = function(a) {
            this.cid = c.uniqueId("view"), a || (a = {}), c.extend(this, c.pick(a, v)), this._ensureElement(), this.initialize.apply(this, arguments), this.delegateEvents()
        }, u = /^(\S+)\s*(.*)$/, v = ["model", "collection", "el", "id", "attributes", "className", "tagName", "events"];
        c.extend(t.prototype, h, {tagName: "div",$: function(a) {
            return this.$el.find(a)
        },initialize: function() {
        },render: function() {
            return this
        },remove: function() {
            return this.$el.remove(), this.stopListening(), this
        },setElement: function(a, c) {
            return this.$el && this.undelegateEvents(), this.$el = a instanceof b.$ ? a : b.$(a), this.el = this.$el[0], c !== !1 && this.delegateEvents(), this
        },delegateEvents: function(a) {
            if (!a && !(a = c.result(this, "events")))
                return this;
            this.undelegateEvents();
            for (var b in a) {
                var d = a[b];
                if (c.isFunction(d) || (d = this[a[b]]), d) {
                    var e = b.match(u), f = e[1], g = e[2];
                    d = c.bind(d, this), f += ".delegateEvents" + this.cid, "" === g ? this.$el.on(f, d) : this.$el.on(f, g, d)
                }
            }
            return this
        },undelegateEvents: function() {
            return this.$el.off(".delegateEvents" + this.cid), this
        },_ensureElement: function() {
            if (this.el)
                this.setElement(c.result(this, "el"), !1);
            else {
                var a = c.extend({}, c.result(this, "attributes"));
                this.id && (a.id = c.result(this, "id")), this.className && (a["class"] = c.result(this, "className"));
                var d = b.$("<" + c.result(this, "tagName") + ">").attr(a);
                this.setElement(d, !1)
            }
        }}), b.sync = function(a, d, e) {
            var f = x[a];
            c.defaults(e || (e = {}), {emulateHTTP: b.emulateHTTP,emulateJSON: b.emulateJSON});
            var g = {type: f,dataType: "json"};
            if (e.url || (g.url = c.result(d, "url") || K()), null != e.data || !d || "create" !== a && "update" !== a && "patch" !== a || (g.contentType = "application/json", g.data = JSON.stringify(e.attrs || d.toJSON(e))), e.emulateJSON && (g.contentType = "application/x-www-form-urlencoded", g.data = g.data ? {model: g.data} : {}), e.emulateHTTP && ("PUT" === f || "DELETE" === f || "PATCH" === f)) {
                g.type = "POST", e.emulateJSON && (g.data._method = f);
                var h = e.beforeSend;
                e.beforeSend = function(a) {
                    return a.setRequestHeader("X-HTTP-Method-Override", f), h ? h.apply(this, arguments) : void 0
                }
            }
            "GET" === g.type || e.emulateJSON || (g.processData = !1), "PATCH" === g.type && w && (g.xhr = function() {
                return new ActiveXObject("Microsoft.XMLHTTP")
            });
            var i = e.xhr = b.ajax(c.extend(g, e));
            return d.trigger("request", d, i, e), i
        };
        var w = !("undefined" == typeof window || !window.ActiveXObject || window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent), x = {create: "POST",update: "PUT",patch: "PATCH","delete": "DELETE",read: "GET"};
        b.ajax = function() {
            return b.$.ajax.apply(b.$, arguments)
        };
        var y = b.Router = function(a) {
            a || (a = {}), a.routes && (this.routes = a.routes), this._bindRoutes(), this.initialize.apply(this, arguments)
        }, z = /\((.*?)\)/g, A = /(\(\?)?:\w+/g, B = /\*\w+/g, C = /[\-{}\[\]+?.,\\\^$|#\s]/g;
        c.extend(y.prototype, h, {initialize: function() {
        },route: function(a, d, e) {
            c.isRegExp(a) || (a = this._routeToRegExp(a)), c.isFunction(d) && (e = d, d = ""), e || (e = this[d]);
            var f = this;
            return b.history.route(a, function(c) {
                var g = f._extractParameters(a, c);
                f.execute(e, g), f.trigger.apply(f, ["route:" + d].concat(g)), f.trigger("route", d, g), b.history.trigger("route", f, d, g)
            }), this
        },execute: function(a, b) {
            a && a.apply(this, b)
        },navigate: function(a, c) {
            return b.history.navigate(a, c), this
        },_bindRoutes: function() {
            if (this.routes) {
                this.routes = c.result(this, "routes");
                for (var a, b = c.keys(this.routes); null != (a = b.pop()); )
                    this.route(a, this.routes[a])
            }
        },_routeToRegExp: function(a) {
            return a = a.replace(C, "\\$&").replace(z, "(?:$1)?").replace(A, function(a, b) {
                return b ? a : "([^/?]+)"
            }).replace(B, "([^?]*?)"), new RegExp("^" + a + "(?:\\?([\\s\\S]*))?$")
        },_extractParameters: function(a, b) {
            var d = a.exec(b).slice(1);
            return c.map(d, function(a, b) {
                return b === d.length - 1 ? a || null : a ? decodeURIComponent(a) : null
            })
        }});
        var D = b.History = function() {
            this.handlers = [], c.bindAll(this, "checkUrl"), "undefined" != typeof window && (this.location = window.location, this.history = window.history)
        }, E = /^[#\/]|\s+$/g, F = /^\/+|\/+$/g, G = /msie [\w.]+/, H = /\/$/, I = /#.*$/;
        D.started = !1, c.extend(D.prototype, h, {interval: 50,atRoot: function() {
            return this.location.pathname.replace(/[^\/]$/, "$&/") === this.root
        },getHash: function(a) {
            var b = (a || this).location.href.match(/#(.*)$/);
            return b ? b[1] : ""
        },getFragment: function(a, b) {
            if (null == a)
                if (this._hasPushState || !this._wantsHashChange || b) {
                    a = decodeURI(this.location.pathname + this.location.search);
                    var c = this.root.replace(H, "");
                    a.indexOf(c) || (a = a.slice(c.length))
                } else
                    a = this.getHash();
            return a.replace(E, "")
        },start: function(a) {
            if (D.started)
                throw new Error("Backbone.history has already been started");
            D.started = !0, this.options = c.extend({root: "/"}, this.options, a), this.root = this.options.root, this._wantsHashChange = this.options.hashChange !== !1, this._wantsPushState = !!this.options.pushState, this._hasPushState = !!(this.options.pushState && this.history && this.history.pushState);
            var d = this.getFragment(), e = document.documentMode, f = G.exec(navigator.userAgent.toLowerCase()) && (!e || 7 >= e);
            if (this.root = ("/" + this.root + "/").replace(F, "/"), f && this._wantsHashChange) {
                var g = b.$('<iframe src="javascript:0" tabindex="-1">');
                this.iframe = g.hide().appendTo("body")[0].contentWindow, this.navigate(d)
            }
            this._hasPushState ? b.$(window).on("popstate", this.checkUrl) : this._wantsHashChange && "onhashchange" in window && !f ? b.$(window).on("hashchange", this.checkUrl) : this._wantsHashChange && (this._checkUrlInterval = setInterval(this.checkUrl, this.interval)), this.fragment = d;
            var h = this.location;
            if (this._wantsHashChange && this._wantsPushState) {
                if (!this._hasPushState && !this.atRoot())
                    return this.fragment = this.getFragment(null, !0), this.location.replace(this.root + "#" + this.fragment), !0;
                this._hasPushState && this.atRoot() && h.hash && (this.fragment = this.getHash().replace(E, ""), this.history.replaceState({}, document.title, this.root + this.fragment))
            }
            return this.options.silent ? void 0 : this.loadUrl()
        },stop: function() {
            b.$(window).off("popstate", this.checkUrl).off("hashchange", this.checkUrl), this._checkUrlInterval && clearInterval(this._checkUrlInterval), D.started = !1
        },route: function(a, b) {
            this.handlers.unshift({route: a,callback: b})
        },checkUrl: function() {
            var a = this.getFragment();
            return a === this.fragment && this.iframe && (a = this.getFragment(this.getHash(this.iframe))), a === this.fragment ? !1 : (this.iframe && this.navigate(a), void this.loadUrl())
        },loadUrl: function(a) {
            return a = this.fragment = this.getFragment(a), c.any(this.handlers, function(b) {
                return b.route.test(a) ? (b.callback(a), !0) : void 0
            })
        },navigate: function(a, b) {
            if (!D.started)
                return !1;
            b && b !== !0 || (b = {trigger: !!b});
            var c = this.root + (a = this.getFragment(a || ""));
            if (a = a.replace(I, ""), this.fragment !== a) {
                if (this.fragment = a, "" === a && "/" !== c && (c = c.slice(0, -1)), this._hasPushState)
                    this.history[b.replace ? "replaceState" : "pushState"]({}, document.title, c);
                else {
                    if (!this._wantsHashChange)
                        return this.location.assign(c);
                    this._updateHash(this.location, a, b.replace), this.iframe && a !== this.getFragment(this.getHash(this.iframe)) && (b.replace || this.iframe.document.open().close(), this._updateHash(this.iframe.location, a, b.replace))
                }
                return b.trigger ? this.loadUrl(a) : void 0
            }
        },_updateHash: function(a, b, c) {
            if (c) {
                var d = a.href.replace(/(javascript:|#).*$/, "");
                a.replace(d + "#" + b)
            } else
                a.hash = "#" + b
        }}), b.history = new D;
        var J = function(a, b) {
            var d, e = this;
            d = a && c.has(a, "constructor") ? a.constructor : function() {
                return e.apply(this, arguments)
            }, c.extend(d, e, b);
            var f = function() {
                this.constructor = d
            };
            return f.prototype = e.prototype, d.prototype = new f, a && c.extend(d.prototype, a), d.__super__ = e.prototype, d
        };
        m.extend = o.extend = y.extend = t.extend = D.extend = J;
        var K = function() {
            throw new Error('A "url" property or function must be specified')
        }, L = function(a, b) {
            var c = b.error;
            b.error = function(d) {
                c && c(a, d, b), a.trigger("error", a, d, b)
            }
        };
        return b
    }), function(a, b) {
        "function" == typeof define && define.amd ? define("jquery-transit", ["jquery"], b) : "object" == typeof exports ? module.exports = b(require("jquery")) : b(a.jQuery)
    }(this, function(a) {
        function b(a) {
            if (a in l.style)
                return a;
            for (var b = ["Moz", "Webkit", "O", "ms"], c = a.charAt(0).toUpperCase() + a.substr(1), d = 0; d < b.length; ++d) {
                var e = b[d] + c;
                if (e in l.style)
                    return e
            }
        }
        function c() {
            return l.style[m.transform] = "", l.style[m.transform] = "rotateY(90deg)", "" !== l.style[m.transform]
        }
        function d(a) {
            return "string" == typeof a && this.parse(a), this
        }
        function e(a, b, c) {
            b === !0 ? a.queue(c) : b ? a.queue(b, c) : a.each(function() {
                c.call(this)
            })
                }
        function f(b) {
            var c = [];
            return a.each(b, function(b) {
                b = a.camelCase(b), b = a.transit.propertyMap[b] || a.cssProps[b] || b, b = i(b), m[b] && (b = i(m[b])), -1 === a.inArray(b, c) && c.push(b)
            }), c
        }
        function g(b, c, d, e) {
            var g = f(b);
            a.cssEase[d] && (d = a.cssEase[d]);
            var h = "" + k(c) + " " + d;
            parseInt(e, 10) > 0 && (h += " " + k(e));
            var i = [];
            return a.each(g, function(a, b) {
                i.push(b + " " + h)
            }), i.join(", ")
        }
        function h(b, c) {
            c || (a.cssNumber[b] = !0), a.transit.propertyMap[b] = m.transform, a.cssHooks[b] = {get: function(c) {
                var d = a(c).css("transit:transform");
                return d.get(b)
            },set: function(c, d) {
                var e = a(c).css("transit:transform");
                e.setFromString(b, d), a(c).css({"transit:transform": e})
            }}
        }
        function i(a) {
            return a.replace(/([A-Z])/g, function(a) {
                return "-" + a.toLowerCase()
            })
        }
        function j(a, b) {
            return "string" != typeof a || a.match(/^[\-0-9\.]+$/) ? "" + a + b : a
        }
        function k(b) {
            var c = b;
            return "string" != typeof c || c.match(/^[\-0-9\.]+/) || (c = a.fx.speeds[c] || a.fx.speeds._default), j(c, "ms")
        }
        a.transit = {version: "0.9.12",propertyMap: {marginLeft: "margin",marginRight: "margin",marginBottom: "margin",marginTop: "margin",paddingLeft: "padding",paddingRight: "padding",paddingBottom: "padding",paddingTop: "padding"},enabled: !0,useTransitionEnd: !1};
        var l = document.createElement("div"), m = {}, n = navigator.userAgent.toLowerCase().indexOf("chrome") > -1;
        m.transition = b("transition"), m.transitionDelay = b("transitionDelay"), m.transform = b("transform"), m.transformOrigin = b("transformOrigin"), m.filter = b("Filter"), m.transform3d = c();
        var o = {transition: "transitionend",MozTransition: "transitionend",OTransition: "oTransitionEnd",WebkitTransition: "webkitTransitionEnd",msTransition: "MSTransitionEnd"}, p = m.transitionEnd = o[m.transition] || null;
        for (var q in m)
            m.hasOwnProperty(q) && "undefined" == typeof a.support[q] && (a.support[q] = m[q]);
        return l = null, a.cssEase = {_default: "ease","in": "ease-in",out: "ease-out","in-out": "ease-in-out",snap: "cubic-bezier(0,1,.5,1)",easeInCubic: "cubic-bezier(.550,.055,.675,.190)",easeOutCubic: "cubic-bezier(.215,.61,.355,1)",easeInOutCubic: "cubic-bezier(.645,.045,.355,1)",easeInCirc: "cubic-bezier(.6,.04,.98,.335)",easeOutCirc: "cubic-bezier(.075,.82,.165,1)",easeInOutCirc: "cubic-bezier(.785,.135,.15,.86)",easeInExpo: "cubic-bezier(.95,.05,.795,.035)",easeOutExpo: "cubic-bezier(.19,1,.22,1)",easeInOutExpo: "cubic-bezier(1,0,0,1)",easeInQuad: "cubic-bezier(.55,.085,.68,.53)",easeOutQuad: "cubic-bezier(.25,.46,.45,.94)",easeInOutQuad: "cubic-bezier(.455,.03,.515,.955)",easeInQuart: "cubic-bezier(.895,.03,.685,.22)",easeOutQuart: "cubic-bezier(.165,.84,.44,1)",easeInOutQuart: "cubic-bezier(.77,0,.175,1)",easeInQuint: "cubic-bezier(.755,.05,.855,.06)",easeOutQuint: "cubic-bezier(.23,1,.32,1)",easeInOutQuint: "cubic-bezier(.86,0,.07,1)",easeInSine: "cubic-bezier(.47,0,.745,.715)",easeOutSine: "cubic-bezier(.39,.575,.565,1)",easeInOutSine: "cubic-bezier(.445,.05,.55,.95)",easeInBack: "cubic-bezier(.6,-.28,.735,.045)",easeOutBack: "cubic-bezier(.175, .885,.32,1.275)",easeInOutBack: "cubic-bezier(.68,-.55,.265,1.55)"}, a.cssHooks["transit:transform"] = {get: function(b) {
            return a(b).data("transform") || new d
        },set: function(b, c) {
            var e = c;
            e instanceof d || (e = new d(e)), b.style[m.transform] = "WebkitTransform" !== m.transform || n ? e.toString() : e.toString(!0), a(b).data("transform", e)
        }}, a.cssHooks.transform = {set: a.cssHooks["transit:transform"].set}, a.cssHooks.filter = {get: function(a) {
            return a.style[m.filter]
        },set: function(a, b) {
            a.style[m.filter] = b
        }}, a.fn.jquery < "1.8" && (a.cssHooks.transformOrigin = {get: function(a) {
            return a.style[m.transformOrigin]
        },set: function(a, b) {
            a.style[m.transformOrigin] = b
        }}, a.cssHooks.transition = {get: function(a) {
            return a.style[m.transition]
        },set: function(a, b) {
            a.style[m.transition] = b
        }}), h("scale"), h("scaleX"), h("scaleY"), h("translate"), h("rotate"), h("rotateX"), h("rotateY"), h("rotate3d"), h("perspective"), h("skewX"), h("skewY"), h("x", !0), h("y", !0), d.prototype = {setFromString: function(a, b) {
            var c = "string" == typeof b ? b.split(",") : b.constructor === Array ? b : [b];
            c.unshift(a), d.prototype.set.apply(this, c)
        },set: function(a) {
            var b = Array.prototype.slice.apply(arguments, [1]);
            this.setter[a] ? this.setter[a].apply(this, b) : this[a] = b.join(",")
        },get: function(a) {
            return this.getter[a] ? this.getter[a].apply(this) : this[a] || 0
        },setter: {rotate: function(a) {
            this.rotate = j(a, "deg")
        },rotateX: function(a) {
            this.rotateX = j(a, "deg")
        },rotateY: function(a) {
            this.rotateY = j(a, "deg")
        },scale: function(a, b) {
            void 0 === b && (b = a), this.scale = a + "," + b
        },skewX: function(a) {
            this.skewX = j(a, "deg")
        },skewY: function(a) {
            this.skewY = j(a, "deg")
        },perspective: function(a) {
            this.perspective = j(a, "px")
        },x: function(a) {
            this.set("translate", a, null)
        },y: function(a) {
            this.set("translate", null, a)
        },translate: function(a, b) {
            void 0 === this._translateX && (this._translateX = 0), void 0 === this._translateY && (this._translateY = 0), null !== a && void 0 !== a && (this._translateX = j(a, "px")), null !== b && void 0 !== b && (this._translateY = j(b, "px")), this.translate = this._translateX + "," + this._translateY
        }},getter: {x: function() {
            return this._translateX || 0
        },y: function() {
            return this._translateY || 0
        },scale: function() {
            var a = (this.scale || "1,1").split(",");
            return a[0] && (a[0] = parseFloat(a[0])), a[1] && (a[1] = parseFloat(a[1])), a[0] === a[1] ? a[0] : a
        },rotate3d: function() {
            for (var a = (this.rotate3d || "0,0,0,0deg").split(","), b = 0; 3 >= b; ++b)
                a[b] && (a[b] = parseFloat(a[b]));
            return a[3] && (a[3] = j(a[3], "deg")), a
        }},parse: function(a) {
            var b = this;
            a.replace(/([a-zA-Z0-9]+)\((.*?)\)/g, function(a, c, d) {
                b.setFromString(c, d)
            })
        },toString: function(a) {
            var b = [];
            for (var c in this)
                if (this.hasOwnProperty(c)) {
                    if (!m.transform3d && ("rotateX" === c || "rotateY" === c || "perspective" === c || "transformOrigin" === c))
                        continue;
                    "_" !== c[0] && b.push(a && "scale" === c ? c + "3d(" + this[c] + ",1)" : a && "translate" === c ? c + "3d(" + this[c] + ",0)" : c + "(" + this[c] + ")")
                }
            return b.join(" ")
        }}, a.fn.transition = a.fn.transit = function(b, c, d, f) {
            var h = this, i = 0, j = !0, l = a.extend(!0, {}, b);
            "function" == typeof c && (f = c, c = void 0), "object" == typeof c && (d = c.easing, i = c.delay || 0, j = "undefined" == typeof c.queue ? !0 : c.queue, f = c.complete, c = c.duration), "function" == typeof d && (f = d, d = void 0), "undefined" != typeof l.easing && (d = l.easing, delete l.easing), "undefined" != typeof l.duration && (c = l.duration, delete l.duration), "undefined" != typeof l.complete && (f = l.complete, delete l.complete), "undefined" != typeof l.queue && (j = l.queue, delete l.queue), "undefined" != typeof l.delay && (i = l.delay, delete l.delay), "undefined" == typeof c && (c = a.fx.speeds._default), "undefined" == typeof d && (d = a.cssEase._default), c = k(c);
            var n = g(l, c, d, i), o = a.transit.enabled && m.transition, q = o ? parseInt(c, 10) + parseInt(i, 10) : 0;
            if (0 === q) {
                var r = function(a) {
                    h.css(l), f && f.apply(h), a && a()
                };
                return e(h, j, r), h
            }
            var s = {}, t = function(b) {
                var c = !1, d = function() {
                    c && h.unbind(p, d), q > 0 && h.each(function() {
                        this.style[m.transition] = s[this] || null
                    }), "function" == typeof f && f.apply(h), "function" == typeof b && b()
                };
                q > 0 && p && a.transit.useTransitionEnd ? (c = !0, h.bind(p, d)) : window.setTimeout(d, q), h.each(function() {
                    if (q > 0) {
                        var b = this.style[m.transition];
                        "" !== b && (n = b + ", " + n), this.style[m.transition] = n
                    }
                    a(this).css(l)
                })
                    }, u = function(a) {
                        this.offsetWidth, t(a)
                    };
            return e(h, j, u), this
        }, a.transit.getTransitionValue = g, a
    }), function(a, b) {
        "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
            if (!a.document)
                throw new Error("jQuery requires a window with a document");
            return b(a)
        } : b(a)
    }("undefined" != typeof window ? window : this, function(a, b) {
        function c(a) {
            var b = a.length, c = fb.type(a);
            return "function" === c || fb.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
        }
        function d(a, b, c) {
            if (fb.isFunction(b))
                return fb.grep(a, function(a, d) {
                    return !!b.call(a, d, a) !== c
                });
            if (b.nodeType)
                return fb.grep(a, function(a) {
                    return a === b !== c
                });
            if ("string" == typeof b) {
                if (nb.test(b))
                    return fb.filter(b, a, c);
                b = fb.filter(b, a)
            }
            return fb.grep(a, function(a) {
                return fb.inArray(a, b) >= 0 !== c
            })
        }
        function e(a, b) {
            do
                a = a[b];
            while (a && 1 !== a.nodeType);
            return a
        }
        function f(a) {
            var b = vb[a] = {};
            return fb.each(a.match(ub) || [], function(a, c) {
                b[c] = !0
            }), b
        }
        function g() {
            pb.addEventListener ? (pb.removeEventListener("DOMContentLoaded", h, !1), a.removeEventListener("load", h, !1)) : (pb.detachEvent("onreadystatechange", h), a.detachEvent("onload", h))
        }
        function h() {
            (pb.addEventListener || "load" === event.type || "complete" === pb.readyState) && (g(), fb.ready())
        }
        function i(a, b, c) {
            if (void 0 === c && 1 === a.nodeType) {
                var d = "data-" + b.replace(Ab, "-$1").toLowerCase();
                if (c = a.getAttribute(d), "string" == typeof c) {
                    try {
                        c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : zb.test(c) ? fb.parseJSON(c) : c
                    } catch (e) {
                    }
                    fb.data(a, b, c)
                } else
                    c = void 0
            }
            return c
        }
        function j(a) {
            var b;
            for (b in a)
                if (("data" !== b || !fb.isEmptyObject(a[b])) && "toJSON" !== b)
                    return !1;
            return !0
        }
        function k(a, b, c, d) {
            if (fb.acceptData(a)) {
                var e, f, g = fb.expando, h = a.nodeType, i = h ? fb.cache : a, j = h ? a[g] : a[g] && g;
                if (j && i[j] && (d || i[j].data) || void 0 !== c || "string" != typeof b)
                    return j || (j = h ? a[g] = W.pop() || fb.guid++ : g), i[j] || (i[j] = h ? {} : {toJSON: fb.noop}), ("object" == typeof b || "function" == typeof b) && (d ? i[j] = fb.extend(i[j], b) : i[j].data = fb.extend(i[j].data, b)), f = i[j], d || (f.data || (f.data = {}), f = f.data), void 0 !== c && (f[fb.camelCase(b)] = c), "string" == typeof b ? (e = f[b], null == e && (e = f[fb.camelCase(b)])) : e = f, e
            }
        }
        function l(a, b, c) {
            if (fb.acceptData(a)) {
                var d, e, f = a.nodeType, g = f ? fb.cache : a, h = f ? a[fb.expando] : fb.expando;
                if (g[h]) {
                    if (b && (d = c ? g[h] : g[h].data)) {
                        fb.isArray(b) ? b = b.concat(fb.map(b, fb.camelCase)) : b in d ? b = [b] : (b = fb.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                        for (; e--; )
                            delete d[b[e]];
                        if (c ? !j(d) : !fb.isEmptyObject(d))
                            return
                    }
                    (c || (delete g[h].data, j(g[h]))) && (f ? fb.cleanData([a], !0) : db.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
                }
            }
        }
        function m() {
            return !0
        }
        function n() {
            return !1
        }
        function o() {
            try {
                return pb.activeElement
            } catch (a) {
            }
        }
        function p(a) {
            var b = Lb.split("|"), c = a.createDocumentFragment();
            if (c.createElement)
                for (; b.length; )
                    c.createElement(b.pop());
            return c
        }
        function q(a, b) {
            var c, d, e = 0, f = typeof a.getElementsByTagName !== yb ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== yb ? a.querySelectorAll(b || "*") : void 0;
            if (!f)
                for (f = [], c = a.childNodes || a; null != (d = c[e]); e++)
                    !b || fb.nodeName(d, b) ? f.push(d) : fb.merge(f, q(d, b));
            return void 0 === b || b && fb.nodeName(a, b) ? fb.merge([a], f) : f
        }
        function r(a) {
            Fb.test(a.type) && (a.defaultChecked = a.checked)
        }
        function s(a, b) {
            return fb.nodeName(a, "table") && fb.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
        }
        function t(a) {
            return a.type = (null !== fb.find.attr(a, "type")) + "/" + a.type, a
        }
        function u(a) {
            var b = Wb.exec(a.type);
            return b ? a.type = b[1] : a.removeAttribute("type"), a
        }
        function v(a, b) {
            for (var c, d = 0; null != (c = a[d]); d++)
                fb._data(c, "globalEval", !b || fb._data(b[d], "globalEval"))
        }
        function w(a, b) {
            if (1 === b.nodeType && fb.hasData(a)) {
                var c, d, e, f = fb._data(a), g = fb._data(b, f), h = f.events;
                if (h) {
                    delete g.handle, g.events = {};
                    for (c in h)
                        for (d = 0, e = h[c].length; e > d; d++)
                            fb.event.add(b, c, h[c][d])
                }
                g.data && (g.data = fb.extend({}, g.data))
            }
        }
        function x(a, b) {
            var c, d, e;
            if (1 === b.nodeType) {
                if (c = b.nodeName.toLowerCase(), !db.noCloneEvent && b[fb.expando]) {
                    e = fb._data(b);
                    for (d in e.events)
                        fb.removeEvent(b, d, e.handle);
                    b.removeAttribute(fb.expando)
                }
                "script" === c && b.text !== a.text ? (t(b).text = a.text, u(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), db.html5Clone && a.innerHTML && !fb.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && Fb.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
            }
        }
        function y(b, c) {
            var d = fb(c.createElement(b)).appendTo(c.body), e = a.getDefaultComputedStyle ? a.getDefaultComputedStyle(d[0]).display : fb.css(d[0], "display");
            return d.detach(), e
        }
        function z(a) {
            var b = pb, c = ac[a];
            return c || (c = y(a, b), "none" !== c && c || (_b = (_b || fb("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = (_b[0].contentWindow || _b[0].contentDocument).document, b.write(), b.close(), c = y(a, b), _b.detach()), ac[a] = c), c
        }
        function A(a, b) {
            return {get: function() {
                var c = a();
                if (null != c)
                    return c ? void delete this.get : (this.get = b).apply(this, arguments)
            }}
        }
        function B(a, b) {
            if (b in a)
                return b;
            for (var c = b.charAt(0).toUpperCase() + b.slice(1), d = b, e = nc.length; e--; )
                if (b = nc[e] + c, b in a)
                    return b;
            return d
        }
        function C(a, b) {
            for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++)
                d = a[g], d.style && (f[g] = fb._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && Db(d) && (f[g] = fb._data(d, "olddisplay", z(d.nodeName)))) : f[g] || (e = Db(d), (c && "none" !== c || !e) && fb._data(d, "olddisplay", e ? c : fb.css(d, "display"))));
            for (g = 0; h > g; g++)
                d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
            return a
        }
        function D(a, b, c) {
            var d = jc.exec(b);
            return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
        }
        function E(a, b, c, d, e) {
            for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2)
                "margin" === c && (g += fb.css(a, c + Cb[f], !0, e)), d ? ("content" === c && (g -= fb.css(a, "padding" + Cb[f], !0, e)), "margin" !== c && (g -= fb.css(a, "border" + Cb[f] + "Width", !0, e))) : (g += fb.css(a, "padding" + Cb[f], !0, e), "padding" !== c && (g += fb.css(a, "border" + Cb[f] + "Width", !0, e)));
            return g
        }
        function F(a, b, c) {
            var d = !0, e = "width" === b ? a.offsetWidth : a.offsetHeight, f = bc(a), g = db.boxSizing() && "border-box" === fb.css(a, "boxSizing", !1, f);
            if (0 >= e || null == e) {
                if (e = cc(a, b, f), (0 > e || null == e) && (e = a.style[b]), ec.test(e))
                    return e;
                d = g && (db.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
            }
            return e + E(a, b, c || (g ? "border" : "content"), d, f) + "px"
        }
        function G(a, b, c, d, e) {
            return new G.prototype.init(a, b, c, d, e)
        }
        function H() {
            return setTimeout(function() {
                oc = void 0
            }), oc = fb.now()
        }
        function I(a, b) {
            var c, d = {height: a}, e = 0;
            for (b = b ? 1 : 0; 4 > e; e += 2 - b)
                c = Cb[e], d["margin" + c] = d["padding" + c] = a;
            return b && (d.opacity = d.width = a), d
        }
        function J(a, b, c) {
            for (var d, e = (uc[b] || []).concat(uc["*"]), f = 0, g = e.length; g > f; f++)
                if (d = e[f].call(c, b, a))
                    return d
        }
        function K(a, b, c) {
            var d, e, f, g, h, i, j, k, l = this, m = {}, n = a.style, o = a.nodeType && Db(a), p = fb._data(a, "fxshow");
            c.queue || (h = fb._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function() {
                h.unqueued || i()
            }), h.unqueued++, l.always(function() {
                l.always(function() {
                    h.unqueued--, fb.queue(a, "fx").length || h.empty.fire()
                })
            })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [n.overflow, n.overflowX, n.overflowY], j = fb.css(a, "display"), k = z(a.nodeName), "none" === j && (j = k), "inline" === j && "none" === fb.css(a, "float") && (db.inlineBlockNeedsLayout && "inline" !== k ? n.zoom = 1 : n.display = "inline-block")), c.overflow && (n.overflow = "hidden", db.shrinkWrapBlocks() || l.always(function() {
                n.overflow = c.overflow[0], n.overflowX = c.overflow[1], n.overflowY = c.overflow[2]
            }));
            for (d in b)
                if (e = b[d], qc.exec(e)) {
                    if (delete b[d], f = f || "toggle" === e, e === (o ? "hide" : "show")) {
                        if ("show" !== e || !p || void 0 === p[d])
                            continue;
                        o = !0
                    }
                    m[d] = p && p[d] || fb.style(a, d)
                }
            if (!fb.isEmptyObject(m)) {
                p ? "hidden" in p && (o = p.hidden) : p = fb._data(a, "fxshow", {}), f && (p.hidden = !o), o ? fb(a).show() : l.done(function() {
                    fb(a).hide()
                }), l.done(function() {
                    var b;
                    fb._removeData(a, "fxshow");
                    for (b in m)
                        fb.style(a, b, m[b])
                });
                for (d in m)
                    g = J(o ? p[d] : 0, d, l), d in p || (p[d] = g.start, o && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
            }
        }
        function L(a, b) {
            var c, d, e, f, g;
            for (c in a)
                if (d = fb.camelCase(c), e = b[d], f = a[c], fb.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = fb.cssHooks[d], g && "expand" in g) {
                    f = g.expand(f), delete a[d];
                    for (c in f)
                        c in a || (a[c] = f[c], b[c] = e)
                } else
                    b[d] = e
        }
        function M(a, b, c) {
            var d, e, f = 0, g = tc.length, h = fb.Deferred().always(function() {
                delete i.elem
            }), i = function() {
                if (e)
                    return !1;
                for (var b = oc || H(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++)
                    j.tweens[g].run(f);
                return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
            }, j = h.promise({elem: a,props: fb.extend({}, b),opts: fb.extend(!0, {specialEasing: {}}, c),originalProperties: b,originalOptions: c,startTime: oc || H(),duration: c.duration,tweens: [],createTween: function(b, c) {
                var d = fb.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d), d
            },stop: function(b) {
                var c = 0, d = b ? j.tweens.length : 0;
                if (e)
                    return this;
                for (e = !0; d > c; c++)
                    j.tweens[c].run(1);
                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
            }}), k = j.props;
            for (L(k, j.opts.specialEasing); g > f; f++)
                if (d = tc[f].call(j, a, k, j.opts))
                    return d;
            return fb.map(k, J, j), fb.isFunction(j.opts.start) && j.opts.start.call(a, j), fb.fx.timer(fb.extend(i, {elem: a,anim: j,queue: j.opts.queue})), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
        }
        function N(a) {
            return function(b, c) {
                "string" != typeof b && (c = b, b = "*");
                var d, e = 0, f = b.toLowerCase().match(ub) || [];
                if (fb.isFunction(c))
                    for (; d = f[e++]; )
                        "+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
            }
        }
        function O(a, b, c, d) {
            function e(h) {
                var i;
                return f[h] = !0, fb.each(a[h] || [], function(a, h) {
                    var j = h(b, c, d);
                    return "string" != typeof j || g || f[j] ? g ? !(i = j) : void 0 : (b.dataTypes.unshift(j), e(j), !1)
                }), i
            }
            var f = {}, g = a === Sc;
            return e(b.dataTypes[0]) || !f["*"] && e("*")
        }
        function P(a, b) {
            var c, d, e = fb.ajaxSettings.flatOptions || {};
            for (d in b)
                void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
            return c && fb.extend(!0, a, c), a
        }
        function Q(a, b, c) {
            for (var d, e, f, g, h = a.contents, i = a.dataTypes; "*" === i[0]; )
                i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
            if (e)
                for (g in h)
                    if (h[g] && h[g].test(e)) {
                        i.unshift(g);
                        break
                    }
            if (i[0] in c)
                f = i[0];
            else {
                for (g in c) {
                    if (!i[0] || a.converters[g + " " + i[0]]) {
                        f = g;
                        break
                    }
                    d || (d = g)
                }
                f = f || d
            }
            return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
        }
        function R(a, b, c, d) {
            var e, f, g, h, i, j = {}, k = a.dataTypes.slice();
            if (k[1])
                for (g in a.converters)
                    j[g.toLowerCase()] = a.converters[g];
            for (f = k.shift(); f; )
                if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
                    if ("*" === f)
                        f = i;
            else if ("*" !== i && i !== f) {
                if (g = j[i + " " + f] || j["* " + f], !g)
                    for (e in j)
                        if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                            g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                            break
                        }
                if (g !== !0)
                    if (g && a["throws"])
                        b = g(b);
                else
                    try {
                        b = g(b)
                    } catch (l) {
                        return {state: "parsererror",error: g ? l : "No conversion from " + i + " to " + f}
                    }
            }
            return {state: "success",data: b}
        }
        function S(a, b, c, d) {
            var e;
            if (fb.isArray(b))
                fb.each(b, function(b, e) {
                    c || Wc.test(a) ? d(a, e) : S(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
                });
            else if (c || "object" !== fb.type(b))
                d(a, b);
            else
                for (e in b)
                    S(a + "[" + e + "]", b[e], c, d)
        }
        function T() {
            try {
                return new a.XMLHttpRequest
            } catch (b) {
            }
        }
        function U() {
            try {
                return new a.ActiveXObject("Microsoft.XMLHTTP")
            } catch (b) {
            }
        }
        function V(a) {
            return fb.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
        }
        var W = [], X = W.slice, Y = W.concat, Z = W.push, $ = W.indexOf, _ = {}, ab = _.toString, bb = _.hasOwnProperty, cb = "".trim, db = {}, eb = "1.11.0", fb = function(a, b) {
            return new fb.fn.init(a, b)
        }, gb = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, hb = /^-ms-/, ib = /-([\da-z])/gi, jb = function(a, b) {
            return b.toUpperCase()
        };
        fb.fn = fb.prototype = {jquery: eb,constructor: fb,selector: "",length: 0,toArray: function() {
            return X.call(this)
        },get: function(a) {
            return null != a ? 0 > a ? this[a + this.length] : this[a] : X.call(this)
        },pushStack: function(a) {
            var b = fb.merge(this.constructor(), a);
            return b.prevObject = this, b.context = this.context, b
        },each: function(a, b) {
            return fb.each(this, a, b)
                },map: function(a) {
                    return this.pushStack(fb.map(this, function(b, c) {
                        return a.call(b, c, b)
                    }))
                },slice: function() {
                    return this.pushStack(X.apply(this, arguments))
                },first: function() {
                    return this.eq(0)
                },last: function() {
                    return this.eq(-1)
                },eq: function(a) {
                    var b = this.length, c = +a + (0 > a ? b : 0);
                    return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
                },end: function() {
                    return this.prevObject || this.constructor(null)
                },push: Z,sort: W.sort,splice: W.splice}, fb.extend = fb.fn.extend = function() {
                    var a, b, c, d, e, f, g = arguments[0] || {}, h = 1, i = arguments.length, j = !1;
                    for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || fb.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)
                        if (null != (e = arguments[h]))
                            for (d in e)
                                a = g[d], c = e[d], g !== c && (j && c && (fb.isPlainObject(c) || (b = fb.isArray(c))) ? (b ? (b = !1, f = a && fb.isArray(a) ? a : []) : f = a && fb.isPlainObject(a) ? a : {}, g[d] = fb.extend(j, f, c)) : void 0 !== c && (g[d] = c));
                    return g
                }, fb.extend({expando: "jQuery" + (eb + Math.random()).replace(/\D/g, ""),isReady: !0,error: function(a) {
                    throw new Error(a)
                },noop: function() {
                },isFunction: function(a) {
                    return "function" === fb.type(a)
                },isArray: Array.isArray || function(a) {
                    return "array" === fb.type(a)
                },isWindow: function(a) {
                    return null != a && a == a.window
                },isNumeric: function(a) {
                    return a - parseFloat(a) >= 0
                },isEmptyObject: function(a) {
                    var b;
                    for (b in a)
                        return !1;
                    return !0
                },isPlainObject: function(a) {
                    var b;
                    if (!a || "object" !== fb.type(a) || a.nodeType || fb.isWindow(a))
                        return !1;
                    try {
                        if (a.constructor && !bb.call(a, "constructor") && !bb.call(a.constructor.prototype, "isPrototypeOf"))
                            return !1
                    } catch (c) {
                        return !1
                    }
                    if (db.ownLast)
                        for (b in a)
                            return bb.call(a, b);
                    for (b in a)
                        ;
                    return void 0 === b || bb.call(a, b)
                },type: function(a) {
                    return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? _[ab.call(a)] || "object" : typeof a
                },globalEval: function(b) {
                    b && fb.trim(b) && (a.execScript || function(b) {
                        a.eval.call(a, b)
                    })(b)
                },camelCase: function(a) {
                    return a.replace(hb, "ms-").replace(ib, jb)
                },nodeName: function(a, b) {
                    return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
                },each: function(a, b, d) {
                    var e, f = 0, g = a.length, h = c(a);
                    if (d) {
                        if (h)
                            for (; g > f && (e = b.apply(a[f], d), e !== !1); f++)
                                ;
                        else
                            for (f in a)
                                if (e = b.apply(a[f], d), e === !1)
                                    break
                    } else if (h)
                        for (; g > f && (e = b.call(a[f], f, a[f]), e !== !1); f++)
                            ;
                    else
                        for (f in a)
                            if (e = b.call(a[f], f, a[f]), e === !1)
                                break;
                    return a
                },trim: cb && !cb.call("﻿ ") ? function(a) {
                    return null == a ? "" : cb.call(a)
                } : function(a) {
                    return null == a ? "" : (a + "").replace(gb, "")
                },makeArray: function(a, b) {
                    var d = b || [];
                    return null != a && (c(Object(a)) ? fb.merge(d, "string" == typeof a ? [a] : a) : Z.call(d, a)), d
                },inArray: function(a, b, c) {
                    var d;
                    if (b) {
                        if ($)
                            return $.call(b, a, c);
                        for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                            if (c in b && b[c] === a)
                                return c
                    }
                    return -1
                },merge: function(a, b) {
                    for (var c = +b.length, d = 0, e = a.length; c > d; )
                        a[e++] = b[d++];
                    if (c !== c)
                        for (; void 0 !== b[d]; )
                            a[e++] = b[d++];
                    return a.length = e, a
                },grep: function(a, b, c) {
                    for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++)
                        d = !b(a[f], f), d !== h && e.push(a[f]);
                    return e
                },map: function(a, b, d) {
                    var e, f = 0, g = a.length, h = c(a), i = [];
                    if (h)
                        for (; g > f; f++)
                            e = b(a[f], f, d), null != e && i.push(e);
                    else
                        for (f in a)
                            e = b(a[f], f, d), null != e && i.push(e);
                    return Y.apply([], i)
                },guid: 1,proxy: function(a, b) {
                    var c, d, e;
                    return "string" == typeof b && (e = a[b], b = a, a = e), fb.isFunction(a) ? (c = X.call(arguments, 2), d = function() {
                        return a.apply(b || this, c.concat(X.call(arguments)))
                    }, d.guid = a.guid = a.guid || fb.guid++, d) : void 0
                },now: function() {
                    return +new Date
                },support: db}), fb.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
                    _["[object " + b + "]"] = b.toLowerCase()
                });
        var kb = function(a) {
            function b(a, b, c, d) {
                var e, f, g, h, i, j, l, o, p, q;
                if ((b ? b.ownerDocument || b : O) !== G && F(b), b = b || G, c = c || [], !a || "string" != typeof a)
                    return c;
                if (1 !== (h = b.nodeType) && 9 !== h)
                    return [];
                if (I && !d) {
                    if (e = sb.exec(a))
                        if (g = e[1]) {
                            if (9 === h) {
                                if (f = b.getElementById(g), !f || !f.parentNode)
                                    return c;
                                if (f.id === g)
                                    return c.push(f), c
                            } else if (b.ownerDocument && (f = b.ownerDocument.getElementById(g)) && M(b, f) && f.id === g)
                                return c.push(f), c
                        } else {
                            if (e[2])
                                return _.apply(c, b.getElementsByTagName(a)), c;
                            if ((g = e[3]) && x.getElementsByClassName && b.getElementsByClassName)
                                return _.apply(c, b.getElementsByClassName(g)), c
                        }
                    if (x.qsa && (!J || !J.test(a))) {
                        if (o = l = N, p = b, q = 9 === h && a, 1 === h && "object" !== b.nodeName.toLowerCase()) {
                            for (j = m(a), (l = b.getAttribute("id")) ? o = l.replace(ub, "\\$&") : b.setAttribute("id", o), o = "[id='" + o + "'] ", i = j.length; i--; )
                                j[i] = o + n(j[i]);
                            p = tb.test(a) && k(b.parentNode) || b, q = j.join(",")
                        }
                        if (q)
                            try {
                                return _.apply(c, p.querySelectorAll(q)), c
                            } catch (r) {
                            }finally {
                                l || b.removeAttribute("id")
                            }
                    }
                }
                return v(a.replace(ib, "$1"), b, c, d)
            }
            function c() {
                function a(c, d) {
                    return b.push(c + " ") > y.cacheLength && delete a[b.shift()], a[c + " "] = d
                }
                var b = [];
                return a
            }
            function d(a) {
                return a[N] = !0, a
            }
            function e(a) {
                var b = G.createElement("div");
                try {
                    return !!a(b)
                } catch (c) {
                    return !1
                }finally {
                    b.parentNode && b.parentNode.removeChild(b), b = null
                }
            }
            function f(a, b) {
                for (var c = a.split("|"), d = a.length; d--; )
                    y.attrHandle[c[d]] = b
            }
            function g(a, b) {
                var c = b && a, d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || W) - (~a.sourceIndex || W);
                if (d)
                    return d;
                if (c)
                    for (; c = c.nextSibling; )
                        if (c === b)
                            return -1;
                return a ? 1 : -1
            }
            function h(a) {
                return function(b) {
                    var c = b.nodeName.toLowerCase();
                    return "input" === c && b.type === a
                }
            }
            function i(a) {
                return function(b) {
                    var c = b.nodeName.toLowerCase();
                    return ("input" === c || "button" === c) && b.type === a
                }
            }
            function j(a) {
                return d(function(b) {
                    return b = +b, d(function(c, d) {
                        for (var e, f = a([], c.length, b), g = f.length; g--; )
                            c[e = f[g]] && (c[e] = !(d[e] = c[e]))
                    })
                })
            }
            function k(a) {
                return a && typeof a.getElementsByTagName !== V && a
            }
            function l() {
            }
            function m(a, c) {
                var d, e, f, g, h, i, j, k = S[a + " "];
                if (k)
                    return c ? 0 : k.slice(0);
                for (h = a, i = [], j = y.preFilter; h; ) {
                    (!d || (e = jb.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), d = !1, (e = kb.exec(h)) && (d = e.shift(), f.push({value: d,type: e[0].replace(ib, " ")}), h = h.slice(d.length));
                    for (g in y.filter)
                        !(e = ob[g].exec(h)) || j[g] && !(e = j[g](e)) || (d = e.shift(), f.push({value: d,type: g,matches: e}), h = h.slice(d.length));
                    if (!d)
                        break
                }
                return c ? h.length : h ? b.error(a) : S(a, i).slice(0)
            }
            function n(a) {
                for (var b = 0, c = a.length, d = ""; c > b; b++)
                    d += a[b].value;
                return d
            }
            function o(a, b, c) {
                var d = b.dir, e = c && "parentNode" === d, f = Q++;
                return b.first ? function(b, c, f) {
                    for (; b = b[d]; )
                        if (1 === b.nodeType || e)
                            return a(b, c, f)
                } : function(b, c, g) {
                    var h, i, j = [P, f];
                    if (g) {
                        for (; b = b[d]; )
                            if ((1 === b.nodeType || e) && a(b, c, g))
                                return !0
                    } else
                        for (; b = b[d]; )
                            if (1 === b.nodeType || e) {
                                if (i = b[N] || (b[N] = {}), (h = i[d]) && h[0] === P && h[1] === f)
                                    return j[2] = h[2];
                                if (i[d] = j, j[2] = a(b, c, g))
                                    return !0
                            }
                }
            }
            function p(a) {
                return a.length > 1 ? function(b, c, d) {
                    for (var e = a.length; e--; )
                        if (!a[e](b, c, d))
                            return !1;
                    return !0
                } : a[0]
            }
            function q(a, b, c, d, e) {
                for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)
                    (f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
                return g
            }
            function r(a, b, c, e, f, g) {
                return e && !e[N] && (e = r(e)), f && !f[N] && (f = r(f, g)), d(function(d, g, h, i) {
                    var j, k, l, m = [], n = [], o = g.length, p = d || u(b || "*", h.nodeType ? [h] : h, []), r = !a || !d && b ? p : q(p, m, a, h, i), s = c ? f || (d ? a : o || e) ? [] : g : r;
                    if (c && c(r, s, h, i), e)
                        for (j = q(s, n), e(j, [], h, i), k = j.length; k--; )
                            (l = j[k]) && (s[n[k]] = !(r[n[k]] = l));
                    if (d) {
                        if (f || a) {
                            if (f) {
                                for (j = [], k = s.length; k--; )
                                    (l = s[k]) && j.push(r[k] = l);
                                f(null, s = [], j, i)
                            }
                            for (k = s.length; k--; )
                                (l = s[k]) && (j = f ? bb.call(d, l) : m[k]) > -1 && (d[j] = !(g[j] = l))
                        }
                    } else
                        s = q(s === g ? s.splice(o, s.length) : s), f ? f(null, g, s, i) : _.apply(g, s)
                })
            }
            function s(a) {
                for (var b, c, d, e = a.length, f = y.relative[a[0].type], g = f || y.relative[" "], h = f ? 1 : 0, i = o(function(a) {
                    return a === b
                }, g, !0), j = o(function(a) {
                    return bb.call(b, a) > -1
                }, g, !0), k = [function(a, c, d) {
                    return !f && (d || c !== C) || ((b = c).nodeType ? i(a, c, d) : j(a, c, d))
                }]; e > h; h++)
                    if (c = y.relative[a[h].type])
                        k = [o(p(k), c)];
                else {
                    if (c = y.filter[a[h].type].apply(null, a[h].matches), c[N]) {
                        for (d = ++h; e > d && !y.relative[a[d].type]; d++)
                            ;
                        return r(h > 1 && p(k), h > 1 && n(a.slice(0, h - 1).concat({value: " " === a[h - 2].type ? "*" : ""})).replace(ib, "$1"), c, d > h && s(a.slice(h, d)), e > d && s(a = a.slice(d)), e > d && n(a))
                    }
                    k.push(c)
                }
                return p(k)
            }
            function t(a, c) {
                var e = c.length > 0, f = a.length > 0, g = function(d, g, h, i, j) {
                    var k, l, m, n = 0, o = "0", p = d && [], r = [], s = C, t = d || f && y.find.TAG("*", j), u = P += null == s ? 1 : Math.random() || .1, v = t.length;
                    for (j && (C = g !== G && g); o !== v && null != (k = t[o]); o++) {
                        if (f && k) {
                            for (l = 0; m = a[l++]; )
                                if (m(k, g, h)) {
                                    i.push(k);
                                    break
                                }
                            j && (P = u)
                        }
                        e && ((k = !m && k) && n--, d && p.push(k))
                    }
                    if (n += o, e && o !== n) {
                        for (l = 0; m = c[l++]; )
                            m(p, r, g, h);
                        if (d) {
                            if (n > 0)
                                for (; o--; )
                                    p[o] || r[o] || (r[o] = Z.call(i));
                            r = q(r)
                        }
                        _.apply(i, r), j && !d && r.length > 0 && n + c.length > 1 && b.uniqueSort(i)
                    }
                    return j && (P = u, C = s), p
                };
                return e ? d(g) : g
            }
            function u(a, c, d) {
                for (var e = 0, f = c.length; f > e; e++)
                    b(a, c[e], d);
                return d
            }
            function v(a, b, c, d) {
                var e, f, g, h, i, j = m(a);
                if (!d && 1 === j.length) {
                    if (f = j[0] = j[0].slice(0), f.length > 2 && "ID" === (g = f[0]).type && x.getById && 9 === b.nodeType && I && y.relative[f[1].type]) {
                        if (b = (y.find.ID(g.matches[0].replace(vb, wb), b) || [])[0], !b)
                            return c;
                        a = a.slice(f.shift().value.length)
                    }
                    for (e = ob.needsContext.test(a) ? 0 : f.length; e-- && (g = f[e], !y.relative[h = g.type]); )
                        if ((i = y.find[h]) && (d = i(g.matches[0].replace(vb, wb), tb.test(f[0].type) && k(b.parentNode) || b))) {
                            if (f.splice(e, 1), a = d.length && n(f), !a)
                                return _.apply(c, d), c;
                            break
                        }
                }
                return B(a, j)(d, b, !I, c, tb.test(a) && k(b.parentNode) || b), c
            }
            var w, x, y, z, A, B, C, D, E, F, G, H, I, J, K, L, M, N = "sizzle" + -new Date, O = a.document, P = 0, Q = 0, R = c(), S = c(), T = c(), U = function(a, b) {
                return a === b && (E = !0), 0
            }, V = "undefined", W = 1 << 31, X = {}.hasOwnProperty, Y = [], Z = Y.pop, $ = Y.push, _ = Y.push, ab = Y.slice, bb = Y.indexOf || function(a) {
                for (var b = 0, c = this.length; c > b; b++)
                    if (this[b] === a)
                        return b;
                return -1
            }, cb = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", db = "[\\x20\\t\\r\\n\\f]", eb = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", fb = eb.replace("w", "w#"), gb = "\\[" + db + "*(" + eb + ")" + db + "*(?:([*^$|!~]?=)" + db + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + fb + ")|)|)" + db + "*\\]", hb = ":(" + eb + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + gb.replace(3, 8) + ")*)|.*)\\)|)", ib = new RegExp("^" + db + "+|((?:^|[^\\\\])(?:\\\\.)*)" + db + "+$", "g"), jb = new RegExp("^" + db + "*," + db + "*"), kb = new RegExp("^" + db + "*([>+~]|" + db + ")" + db + "*"), lb = new RegExp("=" + db + "*([^\\]'\"]*?)" + db + "*\\]", "g"), mb = new RegExp(hb), nb = new RegExp("^" + fb + "$"), ob = {ID: new RegExp("^#(" + eb + ")"),CLASS: new RegExp("^\\.(" + eb + ")"),TAG: new RegExp("^(" + eb.replace("w", "w*") + ")"),ATTR: new RegExp("^" + gb),PSEUDO: new RegExp("^" + hb),CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + db + "*(even|odd|(([+-]|)(\\d*)n|)" + db + "*(?:([+-]|)" + db + "*(\\d+)|))" + db + "*\\)|)", "i"),bool: new RegExp("^(?:" + cb + ")$", "i"),needsContext: new RegExp("^" + db + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + db + "*((?:-\\d)?\\d*)" + db + "*\\)|)(?=[^-]|$)", "i")}, pb = /^(?:input|select|textarea|button)$/i, qb = /^h\d$/i, rb = /^[^{]+\{\s*\[native \w/, sb = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, tb = /[+~]/, ub = /'|\\/g, vb = new RegExp("\\\\([\\da-f]{1,6}" + db + "?|(" + db + ")|.)", "ig"), wb = function(a, b, c) {
                var d = "0x" + b - 65536;
                return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
            };
            try {
                _.apply(Y = ab.call(O.childNodes), O.childNodes), Y[O.childNodes.length].nodeType
            } catch (xb) {
                _ = {apply: Y.length ? function(a, b) {
                    $.apply(a, ab.call(b))
                } : function(a, b) {
                    for (var c = a.length, d = 0; a[c++] = b[d++]; )
                        ;
                    a.length = c - 1
                }}
            }
            x = b.support = {}, A = b.isXML = function(a) {
                var b = a && (a.ownerDocument || a).documentElement;
                return b ? "HTML" !== b.nodeName : !1
            }, F = b.setDocument = function(a) {
                var b, c = a ? a.ownerDocument || a : O, d = c.defaultView;
                return c !== G && 9 === c.nodeType && c.documentElement ? (G = c, H = c.documentElement, I = !A(c), d && d !== d.top && (d.addEventListener ? d.addEventListener("unload", function() {
                    F()
                }, !1) : d.attachEvent && d.attachEvent("onunload", function() {
                    F()
                })), x.attributes = e(function(a) {
                    return a.className = "i", !a.getAttribute("className")
                }), x.getElementsByTagName = e(function(a) {
                    return a.appendChild(c.createComment("")), !a.getElementsByTagName("*").length
                }), x.getElementsByClassName = rb.test(c.getElementsByClassName) && e(function(a) {
                    return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length
                }), x.getById = e(function(a) {
                    return H.appendChild(a).id = N, !c.getElementsByName || !c.getElementsByName(N).length
                }), x.getById ? (y.find.ID = function(a, b) {
                    if (typeof b.getElementById !== V && I) {
                        var c = b.getElementById(a);
                        return c && c.parentNode ? [c] : []
                    }
                }, y.filter.ID = function(a) {
                    var b = a.replace(vb, wb);
                    return function(a) {
                        return a.getAttribute("id") === b
                    }
                }) : (delete y.find.ID, y.filter.ID = function(a) {
                    var b = a.replace(vb, wb);
                    return function(a) {
                        var c = typeof a.getAttributeNode !== V && a.getAttributeNode("id");
                        return c && c.value === b
                    }
                }), y.find.TAG = x.getElementsByTagName ? function(a, b) {
                    return typeof b.getElementsByTagName !== V ? b.getElementsByTagName(a) : void 0
                } : function(a, b) {
                    var c, d = [], e = 0, f = b.getElementsByTagName(a);
                    if ("*" === a) {
                        for (; c = f[e++]; )
                            1 === c.nodeType && d.push(c);
                        return d
                    }
                    return f
                }, y.find.CLASS = x.getElementsByClassName && function(a, b) {
                    return typeof b.getElementsByClassName !== V && I ? b.getElementsByClassName(a) : void 0
                }, K = [], J = [], (x.qsa = rb.test(c.querySelectorAll)) && (e(function(a) {
                    a.innerHTML = "<select t=''><option selected=''></option></select>", a.querySelectorAll("[t^='']").length && J.push("[*^$]=" + db + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || J.push("\\[" + db + "*(?:value|" + cb + ")"), a.querySelectorAll(":checked").length || J.push(":checked")
                }), e(function(a) {
                    var b = c.createElement("input");
                    b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && J.push("name" + db + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || J.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), J.push(",.*:")
                })), (x.matchesSelector = rb.test(L = H.webkitMatchesSelector || H.mozMatchesSelector || H.oMatchesSelector || H.msMatchesSelector)) && e(function(a) {
                    x.disconnectedMatch = L.call(a, "div"), L.call(a, "[s!='']:x"), K.push("!=", hb)
                }), J = J.length && new RegExp(J.join("|")), K = K.length && new RegExp(K.join("|")), b = rb.test(H.compareDocumentPosition), M = b || rb.test(H.contains) ? function(a, b) {
                    var c = 9 === a.nodeType ? a.documentElement : a, d = b && b.parentNode;
                    return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
                } : function(a, b) {
                    if (b)
                        for (; b = b.parentNode; )
                            if (b === a)
                                return !0;
                    return !1
                }, U = b ? function(a, b) {
                    if (a === b)
                        return E = !0, 0;
                    var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
                    return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !x.sortDetached && b.compareDocumentPosition(a) === d ? a === c || a.ownerDocument === O && M(O, a) ? -1 : b === c || b.ownerDocument === O && M(O, b) ? 1 : D ? bb.call(D, a) - bb.call(D, b) : 0 : 4 & d ? -1 : 1)
                } : function(a, b) {
                    if (a === b)
                        return E = !0, 0;
                    var d, e = 0, f = a.parentNode, h = b.parentNode, i = [a], j = [b];
                    if (!f || !h)
                        return a === c ? -1 : b === c ? 1 : f ? -1 : h ? 1 : D ? bb.call(D, a) - bb.call(D, b) : 0;
                    if (f === h)
                        return g(a, b);
                    for (d = a; d = d.parentNode; )
                        i.unshift(d);
                    for (d = b; d = d.parentNode; )
                        j.unshift(d);
                    for (; i[e] === j[e]; )
                        e++;
                    return e ? g(i[e], j[e]) : i[e] === O ? -1 : j[e] === O ? 1 : 0
                }, c) : G
            }, b.matches = function(a, c) {
                return b(a, null, null, c)
            }, b.matchesSelector = function(a, c) {
                if ((a.ownerDocument || a) !== G && F(a), c = c.replace(lb, "='$1']"), !(!x.matchesSelector || !I || K && K.test(c) || J && J.test(c)))
                    try {
                        var d = L.call(a, c);
                        if (d || x.disconnectedMatch || a.document && 11 !== a.document.nodeType)
                            return d
                    } catch (e) {
                    }
                return b(c, G, null, [a]).length > 0
            }, b.contains = function(a, b) {
                return (a.ownerDocument || a) !== G && F(a), M(a, b)
            }, b.attr = function(a, b) {
                (a.ownerDocument || a) !== G && F(a);
                var c = y.attrHandle[b.toLowerCase()], d = c && X.call(y.attrHandle, b.toLowerCase()) ? c(a, b, !I) : void 0;
                return void 0 !== d ? d : x.attributes || !I ? a.getAttribute(b) : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
            }, b.error = function(a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            }, b.uniqueSort = function(a) {
                var b, c = [], d = 0, e = 0;
                if (E = !x.detectDuplicates, D = !x.sortStable && a.slice(0), a.sort(U), E) {
                    for (; b = a[e++]; )
                        b === a[e] && (d = c.push(e));
                    for (; d--; )
                        a.splice(c[d], 1)
                }
                return D = null, a
            }, z = b.getText = function(a) {
                var b, c = "", d = 0, e = a.nodeType;
                if (e) {
                    if (1 === e || 9 === e || 11 === e) {
                        if ("string" == typeof a.textContent)
                            return a.textContent;
                        for (a = a.firstChild; a; a = a.nextSibling)
                            c += z(a)
                    } else if (3 === e || 4 === e)
                        return a.nodeValue
                } else
                    for (; b = a[d++]; )
                        c += z(b);
                return c
            }, y = b.selectors = {cacheLength: 50,createPseudo: d,match: ob,attrHandle: {},find: {},relative: {">": {dir: "parentNode",first: !0}," ": {dir: "parentNode"},"+": {dir: "previousSibling",first: !0},"~": {dir: "previousSibling"}},preFilter: {ATTR: function(a) {
                return a[1] = a[1].replace(vb, wb), a[3] = (a[4] || a[5] || "").replace(vb, wb), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
            },CHILD: function(a) {
                return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || b.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && b.error(a[0]), a
            },PSEUDO: function(a) {
                var b, c = !a[5] && a[2];
                return ob.CHILD.test(a[0]) ? null : (a[3] && void 0 !== a[4] ? a[2] = a[4] : c && mb.test(c) && (b = m(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
            }},filter: {TAG: function(a) {
                var b = a.replace(vb, wb).toLowerCase();
                return "*" === a ? function() {
                    return !0
                } : function(a) {
                    return a.nodeName && a.nodeName.toLowerCase() === b
                }
            },CLASS: function(a) {
                var b = R[a + " "];
                return b || (b = new RegExp("(^|" + db + ")" + a + "(" + db + "|$)")) && R(a, function(a) {
                    return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== V && a.getAttribute("class") || "")
                })
            },ATTR: function(a, c, d) {
                return function(e) {
                    var f = b.attr(e, a);
                    return null == f ? "!=" === c : c ? (f += "", "=" === c ? f === d : "!=" === c ? f !== d : "^=" === c ? d && 0 === f.indexOf(d) : "*=" === c ? d && f.indexOf(d) > -1 : "$=" === c ? d && f.slice(-d.length) === d : "~=" === c ? (" " + f + " ").indexOf(d) > -1 : "|=" === c ? f === d || f.slice(0, d.length + 1) === d + "-" : !1) : !0
                }
            },CHILD: function(a, b, c, d, e) {
                var f = "nth" !== a.slice(0, 3), g = "last" !== a.slice(-4), h = "of-type" === b;
                return 1 === d && 0 === e ? function(a) {
                    return !!a.parentNode
                } : function(b, c, i) {
                    var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling", q = b.parentNode, r = h && b.nodeName.toLowerCase(), s = !i && !h;
                    if (q) {
                        if (f) {
                            for (; p; ) {
                                for (l = b; l = l[p]; )
                                    if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType)
                                        return !1;
                                o = p = "only" === a && !o && "nextSibling"
                            }
                            return !0
                        }
                        if (o = [g ? q.firstChild : q.lastChild], g && s) {
                            for (k = q[N] || (q[N] = {}), j = k[a] || [], n = j[0] === P && j[1], m = j[0] === P && j[2], l = n && q.childNodes[n]; l = ++n && l && l[p] || (m = n = 0) || o.pop(); )
                                if (1 === l.nodeType && ++m && l === b) {
                                    k[a] = [P, n, m];
                                    break
                                }
                        } else if (s && (j = (b[N] || (b[N] = {}))[a]) && j[0] === P)
                            m = j[1];
                        else
                            for (; (l = ++n && l && l[p] || (m = n = 0) || o.pop()) && ((h ? l.nodeName.toLowerCase() !== r : 1 !== l.nodeType) || !++m || (s && ((l[N] || (l[N] = {}))[a] = [P, m]), l !== b)); )
                                ;
                        return m -= e, m === d || m % d === 0 && m / d >= 0
                    }
                }
            },PSEUDO: function(a, c) {
                var e, f = y.pseudos[a] || y.setFilters[a.toLowerCase()] || b.error("unsupported pseudo: " + a);
                return f[N] ? f(c) : f.length > 1 ? (e = [a, a, "", c], y.setFilters.hasOwnProperty(a.toLowerCase()) ? d(function(a, b) {
                    for (var d, e = f(a, c), g = e.length; g--; )
                        d = bb.call(a, e[g]), a[d] = !(b[d] = e[g])
                }) : function(a) {
                    return f(a, 0, e)
                }) : f
            }},pseudos: {not: d(function(a) {
                var b = [], c = [], e = B(a.replace(ib, "$1"));
                return e[N] ? d(function(a, b, c, d) {
                    for (var f, g = e(a, null, d, []), h = a.length; h--; )
                        (f = g[h]) && (a[h] = !(b[h] = f))
                }) : function(a, d, f) {
                    return b[0] = a, e(b, null, f, c), !c.pop()
                }
            }),has: d(function(a) {
                return function(c) {
                    return b(a, c).length > 0
                }
            }),contains: d(function(a) {
                return function(b) {
                    return (b.textContent || b.innerText || z(b)).indexOf(a) > -1
                }
            }),lang: d(function(a) {
                return nb.test(a || "") || b.error("unsupported lang: " + a), a = a.replace(vb, wb).toLowerCase(), function(b) {
                    var c;
                    do
                        if (c = I ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang"))
                            return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-");
                    while ((b = b.parentNode) && 1 === b.nodeType);
                    return !1
                }
            }),target: function(b) {
                var c = a.location && a.location.hash;
                return c && c.slice(1) === b.id
            },root: function(a) {
                return a === H
            },focus: function(a) {
                return a === G.activeElement && (!G.hasFocus || G.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
            },enabled: function(a) {
                return a.disabled === !1
            },disabled: function(a) {
                return a.disabled === !0
            },checked: function(a) {
                var b = a.nodeName.toLowerCase();
                return "input" === b && !!a.checked || "option" === b && !!a.selected
            },selected: function(a) {
                return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
            },empty: function(a) {
                for (a = a.firstChild; a; a = a.nextSibling)
                    if (a.nodeType < 6)
                        return !1;
                return !0
            },parent: function(a) {
                return !y.pseudos.empty(a)
            },header: function(a) {
                return qb.test(a.nodeName)
            },input: function(a) {
                return pb.test(a.nodeName)
            },button: function(a) {
                var b = a.nodeName.toLowerCase();
                return "input" === b && "button" === a.type || "button" === b
            },text: function(a) {
                var b;
                return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
            },first: j(function() {
                return [0]
            }),last: j(function(a, b) {
                return [b - 1]
            }),eq: j(function(a, b, c) {
                return [0 > c ? c + b : c]
            }),even: j(function(a, b) {
                for (var c = 0; b > c; c += 2)
                    a.push(c);
                return a
            }),odd: j(function(a, b) {
                for (var c = 1; b > c; c += 2)
                    a.push(c);
                return a
            }),lt: j(function(a, b, c) {
                for (var d = 0 > c ? c + b : c; --d >= 0; )
                    a.push(d);
                return a
            }),gt: j(function(a, b, c) {
                for (var d = 0 > c ? c + b : c; ++d < b; )
                    a.push(d);
                return a
            })}}, y.pseudos.nth = y.pseudos.eq;
            for (w in {radio: !0,checkbox: !0,file: !0,password: !0,image: !0})
                y.pseudos[w] = h(w);
            for (w in {submit: !0,reset: !0})
                y.pseudos[w] = i(w);
            return l.prototype = y.filters = y.pseudos, y.setFilters = new l, B = b.compile = function(a, b) {
                var c, d = [], e = [], f = T[a + " "];
                if (!f) {
                    for (b || (b = m(a)), c = b.length; c--; )
                        f = s(b[c]), f[N] ? d.push(f) : e.push(f);
                    f = T(a, t(e, d))
                }
                return f
            }, x.sortStable = N.split("").sort(U).join("") === N, x.detectDuplicates = !!E, F(), x.sortDetached = e(function(a) {
                return 1 & a.compareDocumentPosition(G.createElement("div"))
            }), e(function(a) {
                return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
            }) || f("type|href|height|width", function(a, b, c) {
                return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
            }), x.attributes && e(function(a) {
                return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
            }) || f("value", function(a, b, c) {
                return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
            }), e(function(a) {
                return null == a.getAttribute("disabled")
            }) || f(cb, function(a, b, c) {
                var d;
                return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
            }), b
        }(a);
        fb.find = kb, fb.expr = kb.selectors, fb.expr[":"] = fb.expr.pseudos, fb.unique = kb.uniqueSort, fb.text = kb.getText, fb.isXMLDoc = kb.isXML, fb.contains = kb.contains;
        var lb = fb.expr.match.needsContext, mb = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, nb = /^.[^:#\[\.,]*$/;
        fb.filter = function(a, b, c) {
            var d = b[0];
            return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? fb.find.matchesSelector(d, a) ? [d] : [] : fb.find.matches(a, fb.grep(b, function(a) {
                return 1 === a.nodeType
            }))
        }, fb.fn.extend({find: function(a) {
            var b, c = [], d = this, e = d.length;
            if ("string" != typeof a)
                return this.pushStack(fb(a).filter(function() {
                    for (b = 0; e > b; b++)
                        if (fb.contains(d[b], this))
                            return !0
                }));
            for (b = 0; e > b; b++)
                fb.find(a, d[b], c);
            return c = this.pushStack(e > 1 ? fb.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
        },filter: function(a) {
            return this.pushStack(d(this, a || [], !1))
        },not: function(a) {
            return this.pushStack(d(this, a || [], !0))
        },is: function(a) {
            return !!d(this, "string" == typeof a && lb.test(a) ? fb(a) : a || [], !1).length
        }});
        var ob, pb = a.document, qb = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, rb = fb.fn.init = function(a, b) {
            var c, d;
            if (!a)
                return this;
            if ("string" == typeof a) {
                if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : qb.exec(a), !c || !c[1] && b)
                    return !b || b.jquery ? (b || ob).find(a) : this.constructor(b).find(a);
                if (c[1]) {
                    if (b = b instanceof fb ? b[0] : b, fb.merge(this, fb.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : pb, !0)), mb.test(c[1]) && fb.isPlainObject(b))
                        for (c in b)
                            fb.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                    return this
                }
                if (d = pb.getElementById(c[2]), d && d.parentNode) {
                    if (d.id !== c[2])
                        return ob.find(a);
                    this.length = 1, this[0] = d
                }
                return this.context = pb, this.selector = a, this
            }
            return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : fb.isFunction(a) ? "undefined" != typeof ob.ready ? ob.ready(a) : a(fb) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), fb.makeArray(a, this))
        };
        rb.prototype = fb.fn, ob = fb(pb);
        var sb = /^(?:parents|prev(?:Until|All))/, tb = {children: !0,contents: !0,next: !0,prev: !0};
        fb.extend({dir: function(a, b, c) {
            for (var d = [], e = a[b]; e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !fb(e).is(c)); )
                1 === e.nodeType && d.push(e), e = e[b];
            return d
        },sibling: function(a, b) {
            for (var c = []; a; a = a.nextSibling)
                1 === a.nodeType && a !== b && c.push(a);
            return c
        }}), fb.fn.extend({has: function(a) {
            var b, c = fb(a, this), d = c.length;
            return this.filter(function() {
                for (b = 0; d > b; b++)
                    if (fb.contains(this, c[b]))
                        return !0
            })
        },closest: function(a, b) {
            for (var c, d = 0, e = this.length, f = [], g = lb.test(a) || "string" != typeof a ? fb(a, b || this.context) : 0; e > d; d++)
                for (c = this[d]; c && c !== b; c = c.parentNode)
                    if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && fb.find.matchesSelector(c, a))) {
                        f.push(c);
                        break
                    }
            return this.pushStack(f.length > 1 ? fb.unique(f) : f)
        },index: function(a) {
            return a ? "string" == typeof a ? fb.inArray(this[0], fb(a)) : fb.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },add: function(a, b) {
            return this.pushStack(fb.unique(fb.merge(this.get(), fb(a, b))))
        },addBack: function(a) {
            return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
        }}), fb.each({parent: function(a) {
            var b = a.parentNode;
            return b && 11 !== b.nodeType ? b : null
        },parents: function(a) {
            return fb.dir(a, "parentNode")
        },parentsUntil: function(a, b, c) {
            return fb.dir(a, "parentNode", c)
        },next: function(a) {
            return e(a, "nextSibling")
        },prev: function(a) {
            return e(a, "previousSibling")
        },nextAll: function(a) {
            return fb.dir(a, "nextSibling")
        },prevAll: function(a) {
            return fb.dir(a, "previousSibling")
        },nextUntil: function(a, b, c) {
            return fb.dir(a, "nextSibling", c)
        },prevUntil: function(a, b, c) {
            return fb.dir(a, "previousSibling", c)
        },siblings: function(a) {
            return fb.sibling((a.parentNode || {}).firstChild, a)
        },children: function(a) {
            return fb.sibling(a.firstChild)
        },contents: function(a) {
            return fb.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : fb.merge([], a.childNodes)
        }}, function(a, b) {
            fb.fn[a] = function(c, d) {
                var e = fb.map(this, b, c);
                return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = fb.filter(d, e)), this.length > 1 && (tb[a] || (e = fb.unique(e)), sb.test(a) && (e = e.reverse())), this.pushStack(e)
            }
        });
        var ub = /\S+/g, vb = {};
        fb.Callbacks = function(a) {
            a = "string" == typeof a ? vb[a] || f(a) : fb.extend({}, a);
            var b, c, d, e, g, h, i = [], j = !a.once && [], k = function(f) {
                for (c = a.memory && f, d = !0, g = h || 0, h = 0, e = i.length, b = !0; i && e > g; g++)
                    if (i[g].apply(f[0], f[1]) === !1 && a.stopOnFalse) {
                        c = !1;
                        break
                    }
                b = !1, i && (j ? j.length && k(j.shift()) : c ? i = [] : l.disable())
            }, l = {add: function() {
                if (i) {
                    var d = i.length;
                    !function f(b) {
                        fb.each(b, function(b, c) {
                            var d = fb.type(c);
                            "function" === d ? a.unique && l.has(c) || i.push(c) : c && c.length && "string" !== d && f(c)
                        })
                            }(arguments), b ? e = i.length : c && (h = d, k(c))
                }
                return this
            },remove: function() {
                return i && fb.each(arguments, function(a, c) {
                    for (var d; (d = fb.inArray(c, i, d)) > -1; )
                        i.splice(d, 1), b && (e >= d && e--, g >= d && g--)
                }), this
            },has: function(a) {
                return a ? fb.inArray(a, i) > -1 : !(!i || !i.length)
            },empty: function() {
                return i = [], e = 0, this
            },disable: function() {
                return i = j = c = void 0, this
            },disabled: function() {
                return !i
            },lock: function() {
                return j = void 0, c || l.disable(), this
            },locked: function() {
                return !j
            },fireWith: function(a, c) {
                return !i || d && !j || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? j.push(c) : k(c)), this
            },fire: function() {
                return l.fireWith(this, arguments), this
            },fired: function() {
                return !!d
            }};
            return l
        }, fb.extend({Deferred: function(a) {
            var b = [["resolve", "done", fb.Callbacks("once memory"), "resolved"], ["reject", "fail", fb.Callbacks("once memory"), "rejected"], ["notify", "progress", fb.Callbacks("memory")]], c = "pending", d = {state: function() {
                return c
            },always: function() {
                return e.done(arguments).fail(arguments), this
            },then: function() {
                var a = arguments;
                return fb.Deferred(function(c) {
                    fb.each(b, function(b, f) {
                        var g = fb.isFunction(a[b]) && a[b];
                        e[f[1]](function() {
                            var a = g && g.apply(this, arguments);
                            a && fb.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                        })
                    }), a = null
                }).promise()
            },promise: function(a) {
                return null != a ? fb.extend(a, d) : d
            }}, e = {};
            return d.pipe = d.then, fb.each(b, function(a, f) {
                var g = f[2], h = f[3];
                d[f[1]] = g.add, h && g.add(function() {
                    c = h
                }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                    return e[f[0] + "With"](this === e ? d : this, arguments), this
                }, e[f[0] + "With"] = g.fireWith
            }), d.promise(e), a && a.call(e, e), e
        },when: function(a) {
            var b, c, d, e = 0, f = X.call(arguments), g = f.length, h = 1 !== g || a && fb.isFunction(a.promise) ? g : 0, i = 1 === h ? a : fb.Deferred(), j = function(a, c, d) {
                return function(e) {
                    c[a] = this, d[a] = arguments.length > 1 ? X.call(arguments) : e, d === b ? i.notifyWith(c, d) : --h || i.resolveWith(c, d)
                }
            };
            if (g > 1)
                for (b = new Array(g), c = new Array(g), d = new Array(g); g > e; e++)
                    f[e] && fb.isFunction(f[e].promise) ? f[e].promise().done(j(e, d, f)).fail(i.reject).progress(j(e, c, b)) : --h;
            return h || i.resolveWith(d, f), i.promise()
        }});
        var wb;
        fb.fn.ready = function(a) {
            return fb.ready.promise().done(a), this
        }, fb.extend({isReady: !1,readyWait: 1,holdReady: function(a) {
            a ? fb.readyWait++ : fb.ready(!0)
        },ready: function(a) {
            if (a === !0 ? !--fb.readyWait : !fb.isReady) {
                if (!pb.body)
                    return setTimeout(fb.ready);
                fb.isReady = !0, a !== !0 && --fb.readyWait > 0 || (wb.resolveWith(pb, [fb]), fb.fn.trigger && fb(pb).trigger("ready").off("ready"))
            }
        }}), fb.ready.promise = function(b) {
            if (!wb)
                if (wb = fb.Deferred(), "complete" === pb.readyState)
                    setTimeout(fb.ready);
            else if (pb.addEventListener)
                pb.addEventListener("DOMContentLoaded", h, !1), a.addEventListener("load", h, !1);
            else {
                pb.attachEvent("onreadystatechange", h), a.attachEvent("onload", h);
                var c = !1;
                try {
                    c = null == a.frameElement && pb.documentElement
                } catch (d) {
                }
                c && c.doScroll && !function e() {
                    if (!fb.isReady) {
                        try {
                            c.doScroll("left")
                        } catch (a) {
                            return setTimeout(e, 50)
                        }
                        g(), fb.ready()
                    }
                }()
            }
            return wb.promise(b)
        };
        var xb, yb = "undefined";
        for (xb in fb(db))
            break;
        db.ownLast = "0" !== xb, db.inlineBlockNeedsLayout = !1, fb(function() {
            var a, b, c = pb.getElementsByTagName("body")[0];
            c && (a = pb.createElement("div"), a.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", b = pb.createElement("div"), c.appendChild(a).appendChild(b), typeof b.style.zoom !== yb && (b.style.cssText = "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1", (db.inlineBlockNeedsLayout = 3 === b.offsetWidth) && (c.style.zoom = 1)), c.removeChild(a), a = b = null)
        }), function() {
            var a = pb.createElement("div");
            if (null == db.deleteExpando) {
                db.deleteExpando = !0;
                try {
                    delete a.test
                } catch (b) {
                    db.deleteExpando = !1
                }
            }
            a = null
        }(), fb.acceptData = function(a) {
            var b = fb.noData[(a.nodeName + " ").toLowerCase()], c = +a.nodeType || 1;
            return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
        };
        var zb = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, Ab = /([A-Z])/g;
        fb.extend({cache: {},noData: {"applet ": !0,"embed ": !0,"object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData: function(a) {
            return a = a.nodeType ? fb.cache[a[fb.expando]] : a[fb.expando], !!a && !j(a)
        },data: function(a, b, c) {
            return k(a, b, c)
        },removeData: function(a, b) {
            return l(a, b)
        },_data: function(a, b, c) {
            return k(a, b, c, !0)
        },_removeData: function(a, b) {
            return l(a, b, !0)
        }}), fb.fn.extend({data: function(a, b) {
            var c, d, e, f = this[0], g = f && f.attributes;
            if (void 0 === a) {
                if (this.length && (e = fb.data(f), 1 === f.nodeType && !fb._data(f, "parsedAttrs"))) {
                    for (c = g.length; c--; )
                        d = g[c].name, 0 === d.indexOf("data-") && (d = fb.camelCase(d.slice(5)), i(f, d, e[d]));
                    fb._data(f, "parsedAttrs", !0)
                }
                return e
            }
            return "object" == typeof a ? this.each(function() {
                fb.data(this, a)
            }) : arguments.length > 1 ? this.each(function() {
                fb.data(this, a, b)
            }) : f ? i(f, a, fb.data(f, a)) : void 0
        },removeData: function(a) {
            return this.each(function() {
                fb.removeData(this, a)
            })
                }}), fb.extend({queue: function(a, b, c) {
                    var d;
                    return a ? (b = (b || "fx") + "queue", d = fb._data(a, b), c && (!d || fb.isArray(c) ? d = fb._data(a, b, fb.makeArray(c)) : d.push(c)), d || []) : void 0
                },dequeue: function(a, b) {
                    b = b || "fx";
                    var c = fb.queue(a, b), d = c.length, e = c.shift(), f = fb._queueHooks(a, b), g = function() {
                        fb.dequeue(a, b)
                    };
                    "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
                },_queueHooks: function(a, b) {
                    var c = b + "queueHooks";
                    return fb._data(a, c) || fb._data(a, c, {empty: fb.Callbacks("once memory").add(function() {
                        fb._removeData(a, b + "queue"), fb._removeData(a, c)
                    })})
                }}), fb.fn.extend({queue: function(a, b) {
                    var c = 2;
                    return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? fb.queue(this[0], a) : void 0 === b ? this : this.each(function() {
                        var c = fb.queue(this, a, b);
                        fb._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && fb.dequeue(this, a)
                    })
                        },dequeue: function(a) {
                            return this.each(function() {
                                fb.dequeue(this, a)
                            })
                                },clearQueue: function(a) {
                                    return this.queue(a || "fx", [])
                                },promise: function(a, b) {
                                    var c, d = 1, e = fb.Deferred(), f = this, g = this.length, h = function() {
                                        --d || e.resolveWith(f, [f])
                                    };
                                    for ("string" != typeof a && (b = a, a = void 0), a = a || "fx"; g--; )
                                        c = fb._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
                                    return h(), e.promise(b)
                                }});
        var Bb = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source, Cb = ["Top", "Right", "Bottom", "Left"], Db = function(a, b) {
            return a = b || a, "none" === fb.css(a, "display") || !fb.contains(a.ownerDocument, a)
        }, Eb = fb.access = function(a, b, c, d, e, f, g) {
            var h = 0, i = a.length, j = null == c;
            if ("object" === fb.type(c)) {
                e = !0;
                for (h in c)
                    fb.access(a, b, h, c[h], !0, f, g)
            } else if (void 0 !== d && (e = !0, fb.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function(a, b, c) {
                return j.call(fb(a), c)
            })), b))
                for (; i > h; h++)
                    b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
            return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
        }, Fb = /^(?:checkbox|radio)$/i;
        !function() {
            var a = pb.createDocumentFragment(), b = pb.createElement("div"), c = pb.createElement("input");
            if (b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a>", db.leadingWhitespace = 3 === b.firstChild.nodeType, db.tbody = !b.getElementsByTagName("tbody").length, db.htmlSerialize = !!b.getElementsByTagName("link").length, db.html5Clone = "<:nav></:nav>" !== pb.createElement("nav").cloneNode(!0).outerHTML, c.type = "checkbox", c.checked = !0, a.appendChild(c), db.appendChecked = c.checked, b.innerHTML = "<textarea>x</textarea>", db.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, a.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", db.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, db.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function() {
                db.noCloneEvent = !1
            }), b.cloneNode(!0).click()), null == db.deleteExpando) {
                db.deleteExpando = !0;
                try {
                    delete b.test
                } catch (d) {
                    db.deleteExpando = !1
                }
            }
            a = b = c = null
        }(), function() {
            var b, c, d = pb.createElement("div");
            for (b in {submit: !0,change: !0,focusin: !0})
                c = "on" + b, (db[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), db[b + "Bubbles"] = d.attributes[c].expando === !1);
            d = null
        }();
        var Gb = /^(?:input|select|textarea)$/i, Hb = /^key/, Ib = /^(?:mouse|contextmenu)|click/, Jb = /^(?:focusinfocus|focusoutblur)$/, Kb = /^([^.]*)(?:\.(.+)|)$/;
        fb.event = {global: {},add: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = fb._data(a);
            if (q) {
                for (c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = fb.guid++), (g = q.events) || (g = q.events = {}), (k = q.handle) || (k = q.handle = function(a) {
                    return typeof fb === yb || a && fb.event.triggered === a.type ? void 0 : fb.event.dispatch.apply(k.elem, arguments)
                }, k.elem = a), b = (b || "").match(ub) || [""], h = b.length; h--; )
                    f = Kb.exec(b[h]) || [], n = p = f[1], o = (f[2] || "").split(".").sort(), n && (j = fb.event.special[n] || {}, n = (e ? j.delegateType : j.bindType) || n, j = fb.event.special[n] || {}, l = fb.extend({type: n,origType: p,data: d,handler: c,guid: c.guid,selector: e,needsContext: e && fb.expr.match.needsContext.test(e),namespace: o.join(".")}, i), (m = g[n]) || (m = g[n] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, o, k) !== !1 || (a.addEventListener ? a.addEventListener(n, k, !1) : a.attachEvent && a.attachEvent("on" + n, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), fb.event.global[n] = !0);
                a = null
            }
        },remove: function(a, b, c, d, e) {
            var f, g, h, i, j, k, l, m, n, o, p, q = fb.hasData(a) && fb._data(a);
            if (q && (k = q.events)) {
                for (b = (b || "").match(ub) || [""], j = b.length; j--; )
                    if (h = Kb.exec(b[j]) || [], n = p = h[1], o = (h[2] || "").split(".").sort(), n) {
                        for (l = fb.event.special[n] || {}, n = (d ? l.delegateType : l.bindType) || n, m = k[n] || [], h = h[2] && new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = m.length; f--; )
                            g = m[f], !e && p !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                        i && !m.length && (l.teardown && l.teardown.call(a, o, q.handle) !== !1 || fb.removeEvent(a, n, q.handle), delete k[n])
                    } else
                        for (n in k)
                            fb.event.remove(a, n + b[j], c, d, !0);
                fb.isEmptyObject(k) && (delete q.handle, fb._removeData(a, "events"))
            }
        },trigger: function(b, c, d, e) {
            var f, g, h, i, j, k, l, m = [d || pb], n = bb.call(b, "type") ? b.type : b, o = bb.call(b, "namespace") ? b.namespace.split(".") : [];
            if (h = k = d = d || pb, 3 !== d.nodeType && 8 !== d.nodeType && !Jb.test(n + fb.event.triggered) && (n.indexOf(".") >= 0 && (o = n.split("."), n = o.shift(), o.sort()), g = n.indexOf(":") < 0 && "on" + n, b = b[fb.expando] ? b : new fb.Event(n, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = o.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + o.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : fb.makeArray(c, [b]), j = fb.event.special[n] || {}, e || !j.trigger || j.trigger.apply(d, c) !== !1)) {
                if (!e && !j.noBubble && !fb.isWindow(d)) {
                    for (i = j.delegateType || n, Jb.test(i + n) || (h = h.parentNode); h; h = h.parentNode)
                        m.push(h), k = h;
                    k === (d.ownerDocument || pb) && m.push(k.defaultView || k.parentWindow || a)
                }
                for (l = 0; (h = m[l++]) && !b.isPropagationStopped(); )
                    b.type = l > 1 ? i : j.bindType || n, f = (fb._data(h, "events") || {})[b.type] && fb._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && fb.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
                if (b.type = n, !e && !b.isDefaultPrevented() && (!j._default || j._default.apply(m.pop(), c) === !1) && fb.acceptData(d) && g && d[n] && !fb.isWindow(d)) {
                    k = d[g], k && (d[g] = null), fb.event.triggered = n;
                    try {
                        d[n]()
                    } catch (p) {
                    }
                    fb.event.triggered = void 0, k && (d[g] = k)
                }
                return b.result
            }
        },dispatch: function(a) {
            a = fb.event.fix(a);
            var b, c, d, e, f, g = [], h = X.call(arguments), i = (fb._data(this, "events") || {})[a.type] || [], j = fb.event.special[a.type] || {};
            if (h[0] = a, a.delegateTarget = this, !j.preDispatch || j.preDispatch.call(this, a) !== !1) {
                for (g = fb.event.handlers.call(this, a, i), b = 0; (e = g[b++]) && !a.isPropagationStopped(); )
                    for (a.currentTarget = e.elem, f = 0; (d = e.handlers[f++]) && !a.isImmediatePropagationStopped(); )
                        (!a.namespace_re || a.namespace_re.test(d.namespace)) && (a.handleObj = d, a.data = d.data, c = ((fb.event.special[d.origType] || {}).handle || d.handler).apply(e.elem, h), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()));
                return j.postDispatch && j.postDispatch.call(this, a), a.result
            }
        },handlers: function(a, b) {
            var c, d, e, f, g = [], h = b.delegateCount, i = a.target;
            if (h && i.nodeType && (!a.button || "click" !== a.type))
                for (; i != this; i = i.parentNode || this)
                    if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                        for (e = [], f = 0; h > f; f++)
                            d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? fb(c, this).index(i) >= 0 : fb.find(c, this, null, [i]).length), e[c] && e.push(d);
                        e.length && g.push({elem: i,handlers: e})
                    }
            return h < b.length && g.push({elem: this,handlers: b.slice(h)}), g
        },fix: function(a) {
            if (a[fb.expando])
                return a;
            var b, c, d, e = a.type, f = a, g = this.fixHooks[e];
            for (g || (this.fixHooks[e] = g = Ib.test(e) ? this.mouseHooks : Hb.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new fb.Event(f), b = d.length; b--; )
                c = d[b], a[c] = f[c];
            return a.target || (a.target = f.srcElement || pb), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
        },props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks: {},keyHooks: {props: "char charCode key keyCode".split(" "),filter: function(a, b) {
            return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
        }},mouseHooks: {props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter: function(a, b) {
            var c, d, e, f = b.button, g = b.fromElement;
            return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || pb, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
        }},special: {load: {noBubble: !0},focus: {trigger: function() {
            if (this !== o() && this.focus)
                try {
                    return this.focus(), !1
                } catch (a) {
                }
        },delegateType: "focusin"},blur: {trigger: function() {
            return this === o() && this.blur ? (this.blur(), !1) : void 0
        },delegateType: "focusout"},click: {trigger: function() {
            return fb.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
        },_default: function(a) {
            return fb.nodeName(a.target, "a")
        }},beforeunload: {postDispatch: function(a) {
            void 0 !== a.result && (a.originalEvent.returnValue = a.result)
        }}},simulate: function(a, b, c, d) {
            var e = fb.extend(new fb.Event, c, {type: a,isSimulated: !0,originalEvent: {}});
            d ? fb.event.trigger(e, null, b) : fb.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
        }}, fb.removeEvent = pb.removeEventListener ? function(a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, !1)
        } : function(a, b, c) {
            var d = "on" + b;
            a.detachEvent && (typeof a[d] === yb && (a[d] = null), a.detachEvent(d, c))
        }, fb.Event = function(a, b) {
            return this instanceof fb.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && (a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault()) ? m : n) : this.type = a, b && fb.extend(this, b), this.timeStamp = a && a.timeStamp || fb.now(), void (this[fb.expando] = !0)) : new fb.Event(a, b)
        }, fb.Event.prototype = {isDefaultPrevented: n,isPropagationStopped: n,isImmediatePropagationStopped: n,preventDefault: function() {
            var a = this.originalEvent;
            this.isDefaultPrevented = m, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        },stopPropagation: function() {
            var a = this.originalEvent;
            this.isPropagationStopped = m, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
        },stopImmediatePropagation: function() {
            this.isImmediatePropagationStopped = m, this.stopPropagation()
        }}, fb.each({mouseenter: "mouseover",mouseleave: "mouseout"}, function(a, b) {
            fb.event.special[a] = {delegateType: b,bindType: b,handle: function(a) {
                var c, d = this, e = a.relatedTarget, f = a.handleObj;
                return (!e || e !== d && !fb.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
            }}
        }), db.submitBubbles || (fb.event.special.submit = {setup: function() {
            return fb.nodeName(this, "form") ? !1 : void fb.event.add(this, "click._submit keypress._submit", function(a) {
                var b = a.target, c = fb.nodeName(b, "input") || fb.nodeName(b, "button") ? b.form : void 0;
                c && !fb._data(c, "submitBubbles") && (fb.event.add(c, "submit._submit", function(a) {
                    a._submit_bubble = !0
                }), fb._data(c, "submitBubbles", !0))
            })
        },postDispatch: function(a) {
            a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && fb.event.simulate("submit", this.parentNode, a, !0))
        },teardown: function() {
            return fb.nodeName(this, "form") ? !1 : void fb.event.remove(this, "._submit")
        }}), db.changeBubbles || (fb.event.special.change = {setup: function() {
            return Gb.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (fb.event.add(this, "propertychange._change", function(a) {
                "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
            }), fb.event.add(this, "click._change", function(a) {
                this._just_changed && !a.isTrigger && (this._just_changed = !1), fb.event.simulate("change", this, a, !0)
            })), !1) : void fb.event.add(this, "beforeactivate._change", function(a) {
                var b = a.target;
                Gb.test(b.nodeName) && !fb._data(b, "changeBubbles") && (fb.event.add(b, "change._change", function(a) {
                    !this.parentNode || a.isSimulated || a.isTrigger || fb.event.simulate("change", this.parentNode, a, !0)
                }), fb._data(b, "changeBubbles", !0))
            })
        },handle: function(a) {
            var b = a.target;
            return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
        },teardown: function() {
            return fb.event.remove(this, "._change"), !Gb.test(this.nodeName)
        }}), db.focusinBubbles || fb.each({focus: "focusin",blur: "focusout"}, function(a, b) {
            var c = function(a) {
                fb.event.simulate(b, a.target, fb.event.fix(a), !0)
            };
            fb.event.special[b] = {setup: function() {
                var d = this.ownerDocument || this, e = fb._data(d, b);
                e || d.addEventListener(a, c, !0), fb._data(d, b, (e || 0) + 1)
            },teardown: function() {
                var d = this.ownerDocument || this, e = fb._data(d, b) - 1;
                e ? fb._data(d, b, e) : (d.removeEventListener(a, c, !0), fb._removeData(d, b))
            }}
        }), fb.fn.extend({on: function(a, b, c, d, e) {
            var f, g;
            if ("object" == typeof a) {
                "string" != typeof b && (c = c || b, b = void 0);
                for (f in a)
                    this.on(f, b, c, a[f], e);
                return this
            }
            if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1)
                d = n;
            else if (!d)
                return this;
            return 1 === e && (g = d, d = function(a) {
                return fb().off(a), g.apply(this, arguments)
            }, d.guid = g.guid || (g.guid = fb.guid++)), this.each(function() {
                fb.event.add(this, a, d, c, b)
            })
                },one: function(a, b, c, d) {
                    return this.on(a, b, c, d, 1)
                },off: function(a, b, c) {
                    var d, e;
                    if (a && a.preventDefault && a.handleObj)
                        return d = a.handleObj, fb(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
                    if ("object" == typeof a) {
                        for (e in a)
                            this.off(e, b, a[e]);
                        return this
                    }
                    return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = n), this.each(function() {
                        fb.event.remove(this, a, c, b)
                    })
                        },trigger: function(a, b) {
                            return this.each(function() {
                                fb.event.trigger(a, b, this)
                            })
                                },triggerHandler: function(a, b) {
                                    var c = this[0];
                                    return c ? fb.event.trigger(a, b, c, !0) : void 0
                                }});
        var Lb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", Mb = / jQuery\d+="(?:null|\d+)"/g, Nb = new RegExp("<(?:" + Lb + ")[\\s/>]", "i"), Ob = /^\s+/, Pb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, Qb = /<([\w:]+)/, Rb = /<tbody/i, Sb = /<|&#?\w+;/, Tb = /<(?:script|style|link)/i, Ub = /checked\s*(?:[^=]|=\s*.checked.)/i, Vb = /^$|\/(?:java|ecma)script/i, Wb = /^true\/(.*)/, Xb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, Yb = {option: [1, "<select multiple='multiple'>", "</select>"],legend: [1, "<fieldset>", "</fieldset>"],area: [1, "<map>", "</map>"],param: [1, "<object>", "</object>"],thead: [1, "<table>", "</table>"],tr: [2, "<table><tbody>", "</tbody></table>"],col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],_default: db.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]}, Zb = p(pb), $b = Zb.appendChild(pb.createElement("div"));
        Yb.optgroup = Yb.option, Yb.tbody = Yb.tfoot = Yb.colgroup = Yb.caption = Yb.thead, Yb.th = Yb.td, fb.extend({clone: function(a, b, c) {
            var d, e, f, g, h, i = fb.contains(a.ownerDocument, a);
            if (db.html5Clone || fb.isXMLDoc(a) || !Nb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : ($b.innerHTML = a.outerHTML, $b.removeChild(f = $b.firstChild)), !(db.noCloneEvent && db.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || fb.isXMLDoc(a)))
                for (d = q(f), h = q(a), g = 0; null != (e = h[g]); ++g)
                    d[g] && x(e, d[g]);
            if (b)
                if (c)
                    for (h = h || q(a), d = d || q(f), g = 0; null != (e = h[g]); g++)
                        w(e, d[g]);
            else
                w(a, f);
            return d = q(f, "script"), d.length > 0 && v(d, !i && q(a, "script")), d = h = e = null, f
        },buildFragment: function(a, b, c, d) {
            for (var e, f, g, h, i, j, k, l = a.length, m = p(b), n = [], o = 0; l > o; o++)
                if (f = a[o], f || 0 === f)
                    if ("object" === fb.type(f))
                        fb.merge(n, f.nodeType ? [f] : f);
            else if (Sb.test(f)) {
                for (h = h || m.appendChild(b.createElement("div")), i = (Qb.exec(f) || ["", ""])[1].toLowerCase(), k = Yb[i] || Yb._default, h.innerHTML = k[1] + f.replace(Pb, "<$1></$2>") + k[2], e = k[0]; e--; )
                    h = h.lastChild;
                if (!db.leadingWhitespace && Ob.test(f) && n.push(b.createTextNode(Ob.exec(f)[0])), !db.tbody)
                    for (f = "table" !== i || Rb.test(f) ? "<table>" !== k[1] || Rb.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length; e--; )
                        fb.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j);
                for (fb.merge(n, h.childNodes), h.textContent = ""; h.firstChild; )
                    h.removeChild(h.firstChild);
                h = m.lastChild
            } else
                n.push(b.createTextNode(f));
            for (h && m.removeChild(h), db.appendChecked || fb.grep(q(n, "input"), r), o = 0; f = n[o++]; )
                if ((!d || -1 === fb.inArray(f, d)) && (g = fb.contains(f.ownerDocument, f), h = q(m.appendChild(f), "script"), g && v(h), c))
                    for (e = 0; f = h[e++]; )
                        Vb.test(f.type || "") && c.push(f);
            return h = null, m
        },cleanData: function(a, b) {
            for (var c, d, e, f, g = 0, h = fb.expando, i = fb.cache, j = db.deleteExpando, k = fb.event.special; null != (c = a[g]); g++)
                if ((b || fb.acceptData(c)) && (e = c[h], f = e && i[e])) {
                    if (f.events)
                        for (d in f.events)
                            k[d] ? fb.event.remove(c, d) : fb.removeEvent(c, d, f.handle);
                    i[e] && (delete i[e], j ? delete c[h] : typeof c.removeAttribute !== yb ? c.removeAttribute(h) : c[h] = null, W.push(e))
                }
        }}), fb.fn.extend({text: function(a) {
            return Eb(this, function(a) {
                return void 0 === a ? fb.text(this) : this.empty().append((this[0] && this[0].ownerDocument || pb).createTextNode(a))
            }, null, a, arguments.length)
        },append: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = s(this, a);
                    b.appendChild(a)
                }
            })
        },prepend: function() {
            return this.domManip(arguments, function(a) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var b = s(this, a);
                    b.insertBefore(a, b.firstChild)
                }
            })
        },before: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this)
            })
        },after: function() {
            return this.domManip(arguments, function(a) {
                this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
            })
        },remove: function(a, b) {
            for (var c, d = a ? fb.filter(a, this) : this, e = 0; null != (c = d[e]); e++)
                b || 1 !== c.nodeType || fb.cleanData(q(c)), c.parentNode && (b && fb.contains(c.ownerDocument, c) && v(q(c, "script")), c.parentNode.removeChild(c));
            return this
        },empty: function() {
            for (var a, b = 0; null != (a = this[b]); b++) {
                for (1 === a.nodeType && fb.cleanData(q(a, !1)); a.firstChild; )
                    a.removeChild(a.firstChild);
                a.options && fb.nodeName(a, "select") && (a.options.length = 0)
            }
            return this
        },clone: function(a, b) {
            return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
                return fb.clone(this, a, b)
            })
        },html: function(a) {
            return Eb(this, function(a) {
                var b = this[0] || {}, c = 0, d = this.length;
                if (void 0 === a)
                    return 1 === b.nodeType ? b.innerHTML.replace(Mb, "") : void 0;
                if (!("string" != typeof a || Tb.test(a) || !db.htmlSerialize && Nb.test(a) || !db.leadingWhitespace && Ob.test(a) || Yb[(Qb.exec(a) || ["", ""])[1].toLowerCase()])) {
                    a = a.replace(Pb, "<$1></$2>");
                    try {
                        for (; d > c; c++)
                            b = this[c] || {}, 1 === b.nodeType && (fb.cleanData(q(b, !1)), b.innerHTML = a);
                        b = 0
                    } catch (e) {
                    }
                }
                b && this.empty().append(a)
            }, null, a, arguments.length)
        },replaceWith: function() {
            var a = arguments[0];
            return this.domManip(arguments, function(b) {
                a = this.parentNode, fb.cleanData(q(this)), a && a.replaceChild(b, this)
            }), a && (a.length || a.nodeType) ? this : this.remove()
        },detach: function(a) {
            return this.remove(a, !0)
        },domManip: function(a, b) {
            a = Y.apply([], a);
            var c, d, e, f, g, h, i = 0, j = this.length, k = this, l = j - 1, m = a[0], n = fb.isFunction(m);
            if (n || j > 1 && "string" == typeof m && !db.checkClone && Ub.test(m))
                return this.each(function(c) {
                    var d = k.eq(c);
                    n && (a[0] = m.call(this, c, d.html())), d.domManip(a, b)
                });
            if (j && (h = fb.buildFragment(a, this[0].ownerDocument, !1, this), c = h.firstChild, 1 === h.childNodes.length && (h = c), c)) {
                for (f = fb.map(q(h, "script"), t), e = f.length; j > i; i++)
                    d = h, i !== l && (d = fb.clone(d, !0, !0), e && fb.merge(f, q(d, "script"))), b.call(this[i], d, i);
                if (e)
                    for (g = f[f.length - 1].ownerDocument, fb.map(f, u), i = 0; e > i; i++)
                        d = f[i], Vb.test(d.type || "") && !fb._data(d, "globalEval") && fb.contains(g, d) && (d.src ? fb._evalUrl && fb._evalUrl(d.src) : fb.globalEval((d.text || d.textContent || d.innerHTML || "").replace(Xb, "")));
                h = c = null
            }
            return this
        }}), fb.each({appendTo: "append",prependTo: "prepend",insertBefore: "before",insertAfter: "after",replaceAll: "replaceWith"}, function(a, b) {
            fb.fn[a] = function(a) {
                for (var c, d = 0, e = [], f = fb(a), g = f.length - 1; g >= d; d++)
                    c = d === g ? this : this.clone(!0), fb(f[d])[b](c), Z.apply(e, c.get());
                return this.pushStack(e)
            }
        });
        var _b, ac = {};
        !function() {
            var a, b, c = pb.createElement("div"), d = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
            c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = c.getElementsByTagName("a")[0], a.style.cssText = "float:left;opacity:.5", db.opacity = /^0.5/.test(a.style.opacity), db.cssFloat = !!a.style.cssFloat, c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", db.clearCloneStyle = "content-box" === c.style.backgroundClip, a = c = null, db.shrinkWrapBlocks = function() {
                var a, c, e, f;
                if (null == b) {
                    if (a = pb.getElementsByTagName("body")[0], !a)
                        return;
                    f = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px", c = pb.createElement("div"), e = pb.createElement("div"), a.appendChild(c).appendChild(e), b = !1, typeof e.style.zoom !== yb && (e.style.cssText = d + ";width:1px;padding:1px;zoom:1", e.innerHTML = "<div></div>", e.firstChild.style.width = "5px", b = 3 !== e.offsetWidth), a.removeChild(c), a = c = e = null
                }
                return b
            }
        }();
        var bc, cc, dc = /^margin/, ec = new RegExp("^(" + Bb + ")(?!px)[a-z%]+$", "i"), fc = /^(top|right|bottom|left)$/;
        a.getComputedStyle ? (bc = function(a) {
            return a.ownerDocument.defaultView.getComputedStyle(a, null)
        }, cc = function(a, b, c) {
            var d, e, f, g, h = a.style;
            return c = c || bc(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || fb.contains(a.ownerDocument, a) || (g = fb.style(a, b)), ec.test(g) && dc.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + ""
        }) : pb.documentElement.currentStyle && (bc = function(a) {
            return a.currentStyle
        }, cc = function(a, b, c) {
            var d, e, f, g, h = a.style;
            return c = c || bc(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), ec.test(g) && !fc.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto"
        }), function() {
            function b() {
                var b, c, d = pb.getElementsByTagName("body")[0];
                d && (b = pb.createElement("div"), c = pb.createElement("div"), b.style.cssText = j, d.appendChild(b).appendChild(c), c.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%", fb.swap(d, null != d.style.zoom ? {zoom: 1} : {}, function() {
                    e = 4 === c.offsetWidth
                }), f = !0, g = !1, h = !0, a.getComputedStyle && (g = "1%" !== (a.getComputedStyle(c, null) || {}).top, f = "4px" === (a.getComputedStyle(c, null) || {width: "4px"}).width), d.removeChild(b), c = d = null)
            }
            var c, d, e, f, g, h, i = pb.createElement("div"), j = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px", k = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
            i.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", c = i.getElementsByTagName("a")[0], c.style.cssText = "float:left;opacity:.5", db.opacity = /^0.5/.test(c.style.opacity), db.cssFloat = !!c.style.cssFloat, i.style.backgroundClip = "content-box", i.cloneNode(!0).style.backgroundClip = "", db.clearCloneStyle = "content-box" === i.style.backgroundClip, c = i = null, fb.extend(db, {reliableHiddenOffsets: function() {
                if (null != d)
                    return d;
                var a, b, c, e = pb.createElement("div"), f = pb.getElementsByTagName("body")[0];
                if (f)
                    return e.setAttribute("className", "t"), e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = pb.createElement("div"), a.style.cssText = j, f.appendChild(a).appendChild(e), e.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", b = e.getElementsByTagName("td"), b[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = 0 === b[0].offsetHeight, b[0].style.display = "", b[1].style.display = "none", d = c && 0 === b[0].offsetHeight, f.removeChild(a), e = f = null, d
            },boxSizing: function() {
                return null == e && b(), e
            },boxSizingReliable: function() {
                return null == f && b(), f
            },pixelPosition: function() {
                return null == g && b(), g
            },reliableMarginRight: function() {
                var b, c, d, e;
                if (null == h && a.getComputedStyle) {
                    if (b = pb.getElementsByTagName("body")[0], !b)
                        return;
                    c = pb.createElement("div"), d = pb.createElement("div"), c.style.cssText = j, b.appendChild(c).appendChild(d), e = d.appendChild(pb.createElement("div")), e.style.cssText = d.style.cssText = k, e.style.marginRight = e.style.width = "0", d.style.width = "1px", h = !parseFloat((a.getComputedStyle(e, null) || {}).marginRight), b.removeChild(c)
                }
                return h
            }})
        }(), fb.swap = function(a, b, c, d) {
            var e, f, g = {};
            for (f in b)
                g[f] = a.style[f], a.style[f] = b[f];
            e = c.apply(a, d || []);
            for (f in b)
                a.style[f] = g[f];
            return e
        };
        var gc = /alpha\([^)]*\)/i, hc = /opacity\s*=\s*([^)]*)/, ic = /^(none|table(?!-c[ea]).+)/, jc = new RegExp("^(" + Bb + ")(.*)$", "i"), kc = new RegExp("^([+-])=(" + Bb + ")", "i"), lc = {position: "absolute",visibility: "hidden",display: "block"}, mc = {letterSpacing: 0,fontWeight: 400}, nc = ["Webkit", "O", "Moz", "ms"];
        fb.extend({cssHooks: {opacity: {get: function(a, b) {
            if (b) {
                var c = cc(a, "opacity");
                return "" === c ? "1" : c
            }
        }}},cssNumber: {columnCount: !0,fillOpacity: !0,fontWeight: !0,lineHeight: !0,opacity: !0,order: !0,orphans: !0,widows: !0,zIndex: !0,zoom: !0},cssProps: {"float": db.cssFloat ? "cssFloat" : "styleFloat"},style: function(a, b, c, d) {
            if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
                var e, f, g, h = fb.camelCase(b), i = a.style;
                if (b = fb.cssProps[h] || (fb.cssProps[h] = B(i, h)), g = fb.cssHooks[b] || fb.cssHooks[h], void 0 === c)
                    return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
                if (f = typeof c, "string" === f && (e = kc.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(fb.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || fb.cssNumber[h] || (c += "px"), db.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d)))))
                    try {
                        i[b] = "", i[b] = c
                    } catch (j) {
                    }
            }
        },css: function(a, b, c, d) {
            var e, f, g, h = fb.camelCase(b);
            return b = fb.cssProps[h] || (fb.cssProps[h] = B(a.style, h)), g = fb.cssHooks[b] || fb.cssHooks[h], g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = cc(a, b, d)), "normal" === f && b in mc && (f = mc[b]), "" === c || c ? (e = parseFloat(f), c === !0 || fb.isNumeric(e) ? e || 0 : f) : f
        }}), fb.each(["height", "width"], function(a, b) {
            fb.cssHooks[b] = {get: function(a, c, d) {
                return c ? 0 === a.offsetWidth && ic.test(fb.css(a, "display")) ? fb.swap(a, lc, function() {
                    return F(a, b, d)
                }) : F(a, b, d) : void 0
            },set: function(a, c, d) {
                var e = d && bc(a);
                return D(a, c, d ? E(a, b, d, db.boxSizing() && "border-box" === fb.css(a, "boxSizing", !1, e), e) : 0)
            }}
        }), db.opacity || (fb.cssHooks.opacity = {get: function(a, b) {
            return hc.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
        },set: function(a, b) {
            var c = a.style, d = a.currentStyle, e = fb.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "", f = d && d.filter || c.filter || "";
            c.zoom = 1, (b >= 1 || "" === b) && "" === fb.trim(f.replace(gc, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = gc.test(f) ? f.replace(gc, e) : f + " " + e)
        }}), fb.cssHooks.marginRight = A(db.reliableMarginRight, function(a, b) {
            return b ? fb.swap(a, {display: "inline-block"}, cc, [a, "marginRight"]) : void 0
        }), fb.each({margin: "",padding: "",border: "Width"}, function(a, b) {
            fb.cssHooks[a + b] = {expand: function(c) {
                for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++)
                    e[a + Cb[d] + b] = f[d] || f[d - 2] || f[0];
                return e
            }}, dc.test(a) || (fb.cssHooks[a + b].set = D)
        }), fb.fn.extend({css: function(a, b) {
            return Eb(this, function(a, b, c) {
                var d, e, f = {}, g = 0;
                if (fb.isArray(b)) {
                    for (d = bc(a), e = b.length; e > g; g++)
                        f[b[g]] = fb.css(a, b[g], !1, d);
                    return f
                }
                return void 0 !== c ? fb.style(a, b, c) : fb.css(a, b)
            }, a, b, arguments.length > 1)
        },show: function() {
            return C(this, !0)
        },hide: function() {
            return C(this)
        },toggle: function(a) {
            return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
                Db(this) ? fb(this).show() : fb(this).hide()
            })
                }}), fb.Tween = G, G.prototype = {constructor: G,init: function(a, b, c, d, e, f) {
                    this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (fb.cssNumber[c] ? "" : "px")
                },cur: function() {
                    var a = G.propHooks[this.prop];
                    return a && a.get ? a.get(this) : G.propHooks._default.get(this)
                },run: function(a) {
                    var b, c = G.propHooks[this.prop];
                    return this.pos = b = this.options.duration ? fb.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : G.propHooks._default.set(this), this
                }}, G.prototype.init.prototype = G.prototype, G.propHooks = {_default: {get: function(a) {
                    var b;
                    return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = fb.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
                },set: function(a) {
                    fb.fx.step[a.prop] ? fb.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[fb.cssProps[a.prop]] || fb.cssHooks[a.prop]) ? fb.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
                }}}, G.propHooks.scrollTop = G.propHooks.scrollLeft = {set: function(a) {
                    a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
                }}, fb.easing = {linear: function(a) {
                    return a
                },swing: function(a) {
                    return .5 - Math.cos(a * Math.PI) / 2
                }}, fb.fx = G.prototype.init, fb.fx.step = {};
        var oc, pc, qc = /^(?:toggle|show|hide)$/, rc = new RegExp("^(?:([+-])=|)(" + Bb + ")([a-z%]*)$", "i"), sc = /queueHooks$/, tc = [K], uc = {"*": [function(a, b) {
            var c = this.createTween(a, b), d = c.cur(), e = rc.exec(b), f = e && e[3] || (fb.cssNumber[a] ? "" : "px"), g = (fb.cssNumber[a] || "px" !== f && +d) && rc.exec(fb.css(c.elem, a)), h = 1, i = 20;
            if (g && g[3] !== f) {
                f = f || g[3], e = e || [], g = +d || 1;
                do
                    h = h || ".5", g /= h, fb.style(c.elem, a, g + f);
                while (h !== (h = c.cur() / d) && 1 !== h && --i)
            }
            return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
        }]};
        fb.Animation = fb.extend(M, {tweener: function(a, b) {
            fb.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++)
                c = a[d], uc[c] = uc[c] || [], uc[c].unshift(b)
        },prefilter: function(a, b) {
            b ? tc.unshift(a) : tc.push(a)
        }}), fb.speed = function(a, b, c) {
            var d = a && "object" == typeof a ? fb.extend({}, a) : {complete: c || !c && b || fb.isFunction(a) && a,duration: a,easing: c && b || b && !fb.isFunction(b) && b};
            return d.duration = fb.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in fb.fx.speeds ? fb.fx.speeds[d.duration] : fb.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
                fb.isFunction(d.old) && d.old.call(this), d.queue && fb.dequeue(this, d.queue)
            }, d
        }, fb.fn.extend({fadeTo: function(a, b, c, d) {
            return this.filter(Db).css("opacity", 0).show().end().animate({opacity: b}, a, c, d)
        },animate: function(a, b, c, d) {
            var e = fb.isEmptyObject(a), f = fb.speed(b, c, d), g = function() {
                var b = M(this, fb.extend({}, a), f);
                (e || fb._data(this, "finish")) && b.stop(!0)
            };
            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },stop: function(a, b, c) {
            var d = function(a) {
                var b = a.stop;
                delete a.stop, b(c)
            };
            return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                var b = !0, e = null != a && a + "queueHooks", f = fb.timers, g = fb._data(this);
                if (e)
                    g[e] && g[e].stop && d(g[e]);
                else
                    for (e in g)
                        g[e] && g[e].stop && sc.test(e) && d(g[e]);
                for (e = f.length; e--; )
                    f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                (b || !c) && fb.dequeue(this, a)
            })
                },finish: function(a) {
                    return a !== !1 && (a = a || "fx"), this.each(function() {
                        var b, c = fb._data(this), d = c[a + "queue"], e = c[a + "queueHooks"], f = fb.timers, g = d ? d.length : 0;
                        for (c.finish = !0, fb.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--; )
                            f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                        for (b = 0; g > b; b++)
                            d[b] && d[b].finish && d[b].finish.call(this);
                        delete c.finish
                    })
                        }}), fb.each(["toggle", "show", "hide"], function(a, b) {
                            var c = fb.fn[b];
                            fb.fn[b] = function(a, d, e) {
                                return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(I(b, !0), a, d, e)
                            }
                        }), fb.each({slideDown: I("show"),slideUp: I("hide"),slideToggle: I("toggle"),fadeIn: {opacity: "show"},fadeOut: {opacity: "hide"},fadeToggle: {opacity: "toggle"}}, function(a, b) {
                            fb.fn[a] = function(a, c, d) {
                                return this.animate(b, a, c, d)
                            }
                        }), fb.timers = [], fb.fx.tick = function() {
                            var a, b = fb.timers, c = 0;
                            for (oc = fb.now(); c < b.length; c++)
                                a = b[c], a() || b[c] !== a || b.splice(c--, 1);
                            b.length || fb.fx.stop(), oc = void 0
                        }, fb.fx.timer = function(a) {
                            fb.timers.push(a), a() ? fb.fx.start() : fb.timers.pop()
                        }, fb.fx.interval = 13, fb.fx.start = function() {
                            pc || (pc = setInterval(fb.fx.tick, fb.fx.interval))
                        }, fb.fx.stop = function() {
                            clearInterval(pc), pc = null
                        }, fb.fx.speeds = {slow: 600,fast: 200,_default: 400}, fb.fn.delay = function(a, b) {
                            return a = fb.fx ? fb.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                                var d = setTimeout(b, a);
                                c.stop = function() {
                                    clearTimeout(d)
                                }
                            })
                        }, function() {
                            var a, b, c, d, e = pb.createElement("div");
                            e.setAttribute("className", "t"), e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = e.getElementsByTagName("a")[0], c = pb.createElement("select"), d = c.appendChild(pb.createElement("option")), b = e.getElementsByTagName("input")[0], a.style.cssText = "top:1px", db.getSetAttribute = "t" !== e.className, db.style = /top/.test(a.getAttribute("style")), db.hrefNormalized = "/a" === a.getAttribute("href"), db.checkOn = !!b.value, db.optSelected = d.selected, db.enctype = !!pb.createElement("form").enctype, c.disabled = !0, db.optDisabled = !d.disabled, b = pb.createElement("input"), b.setAttribute("value", ""), db.input = "" === b.getAttribute("value"), b.value = "t", b.setAttribute("type", "radio"), db.radioValue = "t" === b.value, a = b = c = d = e = null
                        }();
        var vc = /\r/g;
        fb.fn.extend({val: function(a) {
            var b, c, d, e = this[0];
            {
                if (arguments.length)
                    return d = fb.isFunction(a), this.each(function(c) {
                        var e;
                        1 === this.nodeType && (e = d ? a.call(this, c, fb(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : fb.isArray(e) && (e = fb.map(e, function(a) {
                            return null == a ? "" : a + ""
                        })), b = fb.valHooks[this.type] || fb.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
                    });
                if (e)
                    return b = fb.valHooks[e.type] || fb.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(vc, "") : null == c ? "" : c)
            }
        }}), fb.extend({valHooks: {option: {get: function(a) {
            var b = fb.find.attr(a, "value");
            return null != b ? b : fb.text(a)
        }},select: {get: function(a) {
            for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                if (c = d[i], !(!c.selected && i !== e || (db.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && fb.nodeName(c.parentNode, "optgroup"))) {
                    if (b = fb(c).val(), f)
                        return b;
                    g.push(b)
                }
            return g
        },set: function(a, b) {
            for (var c, d, e = a.options, f = fb.makeArray(b), g = e.length; g--; )
                if (d = e[g], fb.inArray(fb.valHooks.option.get(d), f) >= 0)
                    try {
                        d.selected = c = !0
                    } catch (h) {
                        d.scrollHeight
                    }
            else
                d.selected = !1;
            return c || (a.selectedIndex = -1), e
        }}}}), fb.each(["radio", "checkbox"], function() {
            fb.valHooks[this] = {set: function(a, b) {
                return fb.isArray(b) ? a.checked = fb.inArray(fb(a).val(), b) >= 0 : void 0
            }}, db.checkOn || (fb.valHooks[this].get = function(a) {
                return null === a.getAttribute("value") ? "on" : a.value
            })
        });
        var wc, xc, yc = fb.expr.attrHandle, zc = /^(?:checked|selected)$/i, Ac = db.getSetAttribute, Bc = db.input;
        fb.fn.extend({attr: function(a, b) {
            return Eb(this, fb.attr, a, b, arguments.length > 1)
        },removeAttr: function(a) {
            return this.each(function() {
                fb.removeAttr(this, a)
            })
                }}), fb.extend({attr: function(a, b, c) {
                    var d, e, f = a.nodeType;
                    if (a && 3 !== f && 8 !== f && 2 !== f)
                        return typeof a.getAttribute === yb ? fb.prop(a, b, c) : (1 === f && fb.isXMLDoc(a) || (b = b.toLowerCase(), d = fb.attrHooks[b] || (fb.expr.match.bool.test(b) ? xc : wc)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = fb.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void fb.removeAttr(a, b))
                },removeAttr: function(a, b) {
                    var c, d, e = 0, f = b && b.match(ub);
                    if (f && 1 === a.nodeType)
                        for (; c = f[e++]; )
                            d = fb.propFix[c] || c, fb.expr.match.bool.test(c) ? Bc && Ac || !zc.test(c) ? a[d] = !1 : a[fb.camelCase("default-" + c)] = a[d] = !1 : fb.attr(a, c, ""), a.removeAttribute(Ac ? c : d)
                },attrHooks: {type: {set: function(a, b) {
                    if (!db.radioValue && "radio" === b && fb.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }}}}), xc = {set: function(a, b, c) {
                    return b === !1 ? fb.removeAttr(a, c) : Bc && Ac || !zc.test(c) ? a.setAttribute(!Ac && fb.propFix[c] || c, c) : a[fb.camelCase("default-" + c)] = a[c] = !0, c
                }}, fb.each(fb.expr.match.bool.source.match(/\w+/g), function(a, b) {
                    var c = yc[b] || fb.find.attr;
                    yc[b] = Bc && Ac || !zc.test(b) ? function(a, b, d) {
                        var e, f;
                        return d || (f = yc[b], yc[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, yc[b] = f), e
                    } : function(a, b, c) {
                        return c ? void 0 : a[fb.camelCase("default-" + b)] ? b.toLowerCase() : null
                    }
                }), Bc && Ac || (fb.attrHooks.value = {set: function(a, b, c) {
                    return fb.nodeName(a, "input") ? void (a.defaultValue = b) : wc && wc.set(a, b, c)
                }}), Ac || (wc = {set: function(a, b, c) {
                    var d = a.getAttributeNode(c);
                    return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
                }}, yc.id = yc.name = yc.coords = function(a, b, c) {
                    var d;
                    return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
                }, fb.valHooks.button = {get: function(a, b) {
                    var c = a.getAttributeNode(b);
                    return c && c.specified ? c.value : void 0
                },set: wc.set}, fb.attrHooks.contenteditable = {set: function(a, b, c) {
                    wc.set(a, "" === b ? !1 : b, c)
                }}, fb.each(["width", "height"], function(a, b) {
                    fb.attrHooks[b] = {set: function(a, c) {
                        return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
                    }}
                })), db.style || (fb.attrHooks.style = {get: function(a) {
                    return a.style.cssText || void 0
                },set: function(a, b) {
                    return a.style.cssText = b + ""
                }});
        var Cc = /^(?:input|select|textarea|button|object)$/i, Dc = /^(?:a|area)$/i;
        fb.fn.extend({prop: function(a, b) {
            return Eb(this, fb.prop, a, b, arguments.length > 1)
        },removeProp: function(a) {
            return a = fb.propFix[a] || a, this.each(function() {
                try {
                    this[a] = void 0, delete this[a]
                } catch (b) {
                }
            })
                }}), fb.extend({propFix: {"for": "htmlFor","class": "className"},prop: function(a, b, c) {
                    var d, e, f, g = a.nodeType;
                    if (a && 3 !== g && 8 !== g && 2 !== g)
                        return f = 1 !== g || !fb.isXMLDoc(a), f && (b = fb.propFix[b] || b, e = fb.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
                },propHooks: {tabIndex: {get: function(a) {
                    var b = fb.find.attr(a, "tabindex");
                    return b ? parseInt(b, 10) : Cc.test(a.nodeName) || Dc.test(a.nodeName) && a.href ? 0 : -1
                }}}}), db.hrefNormalized || fb.each(["href", "src"], function(a, b) {
                    fb.propHooks[b] = {get: function(a) {
                        return a.getAttribute(b, 4)
                    }}
                }), db.optSelected || (fb.propHooks.selected = {get: function(a) {
                    var b = a.parentNode;
                    return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
                }}), fb.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
                    fb.propFix[this.toLowerCase()] = this
                }), db.enctype || (fb.propFix.enctype = "encoding");
        var Ec = /[\t\r\n\f]/g;
        fb.fn.extend({addClass: function(a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = "string" == typeof a && a;
            if (fb.isFunction(a))
                return this.each(function(b) {
                    fb(this).addClass(a.call(this, b, this.className))
                });
            if (j)
                for (b = (a || "").match(ub) || []; i > h; h++)
                    if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Ec, " ") : " ")) {
                        for (f = 0; e = b[f++]; )
                            d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                        g = fb.trim(d), c.className !== g && (c.className = g)
                    }
            return this
        },removeClass: function(a) {
            var b, c, d, e, f, g, h = 0, i = this.length, j = 0 === arguments.length || "string" == typeof a && a;
            if (fb.isFunction(a))
                return this.each(function(b) {
                    fb(this).removeClass(a.call(this, b, this.className))
                });
            if (j)
                for (b = (a || "").match(ub) || []; i > h; h++)
                    if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(Ec, " ") : "")) {
                        for (f = 0; e = b[f++]; )
                            for (; d.indexOf(" " + e + " ") >= 0; )
                                d = d.replace(" " + e + " ", " ");
                        g = a ? fb.trim(d) : "", c.className !== g && (c.className = g)
                    }
            return this
        },toggleClass: function(a, b) {
            var c = typeof a;
            return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(fb.isFunction(a) ? function(c) {
                fb(this).toggleClass(a.call(this, c, this.className, b), b)
            } : function() {
                if ("string" === c)
                    for (var b, d = 0, e = fb(this), f = a.match(ub) || []; b = f[d++]; )
                        e.hasClass(b) ? e.removeClass(b) : e.addClass(b);
                else
                    (c === yb || "boolean" === c) && (this.className && fb._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : fb._data(this, "__className__") || "")
            })
                },hasClass: function(a) {
                    for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
                        if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(Ec, " ").indexOf(b) >= 0)
                            return !0;
                    return !1
                }}), fb.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
                    fb.fn[b] = function(a, c) {
                        return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
                    }
                }), fb.fn.extend({hover: function(a, b) {
                    return this.mouseenter(a).mouseleave(b || a)
                },bind: function(a, b, c) {
                    return this.on(a, null, b, c)
                },unbind: function(a, b) {
                    return this.off(a, null, b)
                },delegate: function(a, b, c, d) {
                    return this.on(b, a, c, d)
                },undelegate: function(a, b, c) {
                    return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
                }});
        var Fc = fb.now(), Gc = /\?/, Hc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
        fb.parseJSON = function(b) {
            if (a.JSON && a.JSON.parse)
                return a.JSON.parse(b + "");
            var c, d = null, e = fb.trim(b + "");
            return e && !fb.trim(e.replace(Hc, function(a, b, e, f) {
                return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "")
            })) ? Function("return " + e)() : fb.error("Invalid JSON: " + b)
        }, fb.parseXML = function(b) {
            var c, d;
            if (!b || "string" != typeof b)
                return null;
            try {
                a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
            } catch (e) {
                c = void 0
            }
            return c && c.documentElement && !c.getElementsByTagName("parsererror").length || fb.error("Invalid XML: " + b), c
        };
        var Ic, Jc, Kc = /#.*$/, Lc = /([?&])_=[^&]*/, Mc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, Nc = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, Oc = /^(?:GET|HEAD)$/, Pc = /^\/\//, Qc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, Rc = {}, Sc = {}, Tc = "*/".concat("*");
        try {
            Jc = location.href
        } catch (Uc) {
            Jc = pb.createElement("a"), Jc.href = "", Jc = Jc.href
        }
        Ic = Qc.exec(Jc.toLowerCase()) || [], fb.extend({active: 0,lastModified: {},etag: {},ajaxSettings: {url: Jc,type: "GET",isLocal: Nc.test(Ic[1]),global: !0,processData: !0,async: !0,contentType: "application/x-www-form-urlencoded; charset=UTF-8",accepts: {"*": Tc,text: "text/plain",html: "text/html",xml: "application/xml, text/xml",json: "application/json, text/javascript"},contents: {xml: /xml/,html: /html/,json: /json/},responseFields: {xml: "responseXML",text: "responseText",json: "responseJSON"},converters: {"* text": String,"text html": !0,"text json": fb.parseJSON,"text xml": fb.parseXML},flatOptions: {url: !0,context: !0}},ajaxSetup: function(a, b) {
            return b ? P(P(a, fb.ajaxSettings), b) : P(fb.ajaxSettings, a)
        },ajaxPrefilter: N(Rc),ajaxTransport: N(Sc),ajax: function(a, b) {
            function c(a, b, c, d) {
                var e, k, r, s, u, w = b;
                2 !== t && (t = 2, h && clearTimeout(h), j = void 0, g = d || "", v.readyState = a > 0 ? 4 : 0, e = a >= 200 && 300 > a || 304 === a, c && (s = Q(l, v, c)), s = R(l, s, v, e), e ? (l.ifModified && (u = v.getResponseHeader("Last-Modified"), u && (fb.lastModified[f] = u), u = v.getResponseHeader("etag"), u && (fb.etag[f] = u)), 204 === a || "HEAD" === l.type ? w = "nocontent" : 304 === a ? w = "notmodified" : (w = s.state, k = s.data, r = s.error, e = !r)) : (r = w, (a || !w) && (w = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || w) + "", e ? o.resolveWith(m, [k, w, v]) : o.rejectWith(m, [v, w, r]), v.statusCode(q), q = void 0, i && n.trigger(e ? "ajaxSuccess" : "ajaxError", [v, l, e ? k : r]), p.fireWith(m, [v, w]), i && (n.trigger("ajaxComplete", [v, l]), --fb.active || fb.event.trigger("ajaxStop")))
            }
            "object" == typeof a && (b = a, a = void 0), b = b || {};
            var d, e, f, g, h, i, j, k, l = fb.ajaxSetup({}, b), m = l.context || l, n = l.context && (m.nodeType || m.jquery) ? fb(m) : fb.event, o = fb.Deferred(), p = fb.Callbacks("once memory"), q = l.statusCode || {}, r = {}, s = {}, t = 0, u = "canceled", v = {readyState: 0,getResponseHeader: function(a) {
                var b;
                if (2 === t) {
                    if (!k)
                        for (k = {}; b = Mc.exec(g); )
                            k[b[1].toLowerCase()] = b[2];
                    b = k[a.toLowerCase()]
                }
                return null == b ? null : b
            },getAllResponseHeaders: function() {
                return 2 === t ? g : null
            },setRequestHeader: function(a, b) {
                var c = a.toLowerCase();
                return t || (a = s[c] = s[c] || a, r[a] = b), this
            },overrideMimeType: function(a) {
                return t || (l.mimeType = a), this
            },statusCode: function(a) {
                var b;
                if (a)
                    if (2 > t)
                        for (b in a)
                            q[b] = [q[b], a[b]];
                else
                    v.always(a[v.status]);
                return this
            },abort: function(a) {
                var b = a || u;
                return j && j.abort(b), c(0, b), this
            }};
            if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, l.url = ((a || l.url || Jc) + "").replace(Kc, "").replace(Pc, Ic[1] + "//"), l.type = b.method || b.type || l.method || l.type, l.dataTypes = fb.trim(l.dataType || "*").toLowerCase().match(ub) || [""], null == l.crossDomain && (d = Qc.exec(l.url.toLowerCase()), l.crossDomain = !(!d || d[1] === Ic[1] && d[2] === Ic[2] && (d[3] || ("http:" === d[1] ? "80" : "443")) === (Ic[3] || ("http:" === Ic[1] ? "80" : "443")))), l.data && l.processData && "string" != typeof l.data && (l.data = fb.param(l.data, l.traditional)), O(Rc, l, b, v), 2 === t)
                return v;
            i = l.global, i && 0 === fb.active++ && fb.event.trigger("ajaxStart"), l.type = l.type.toUpperCase(), l.hasContent = !Oc.test(l.type), f = l.url, l.hasContent || (l.data && (f = l.url += (Gc.test(f) ? "&" : "?") + l.data, delete l.data), l.cache === !1 && (l.url = Lc.test(f) ? f.replace(Lc, "$1_=" + Fc++) : f + (Gc.test(f) ? "&" : "?") + "_=" + Fc++)), l.ifModified && (fb.lastModified[f] && v.setRequestHeader("If-Modified-Since", fb.lastModified[f]), fb.etag[f] && v.setRequestHeader("If-None-Match", fb.etag[f])), (l.data && l.hasContent && l.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", l.contentType), v.setRequestHeader("Accept", l.dataTypes[0] && l.accepts[l.dataTypes[0]] ? l.accepts[l.dataTypes[0]] + ("*" !== l.dataTypes[0] ? ", " + Tc + "; q=0.01" : "") : l.accepts["*"]);
            for (e in l.headers)
                v.setRequestHeader(e, l.headers[e]);
            if (l.beforeSend && (l.beforeSend.call(m, v, l) === !1 || 2 === t))
                return v.abort();
            u = "abort";
            for (e in {success: 1,error: 1,complete: 1})
                v[e](l[e]);
            if (j = O(Sc, l, b, v)) {
                v.readyState = 1, i && n.trigger("ajaxSend", [v, l]), l.async && l.timeout > 0 && (h = setTimeout(function() {
                    v.abort("timeout")
                }, l.timeout));
                try {
                    t = 1, j.send(r, c)
                } catch (w) {
                    if (!(2 > t))
                        throw w;
                    c(-1, w)
                }
            } else
                c(-1, "No Transport");
            return v
        },getJSON: function(a, b, c) {
            return fb.get(a, b, c, "json")
        },getScript: function(a, b) {
            return fb.get(a, void 0, b, "script")
        }}), fb.each(["get", "post"], function(a, b) {
            fb[b] = function(a, c, d, e) {
                return fb.isFunction(c) && (e = e || d, d = c, c = void 0), fb.ajax({url: a,type: b,dataType: e,data: c,success: d})
            }
        }), fb.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
            fb.fn[b] = function(a) {
                return this.on(b, a)
            }
        }), fb._evalUrl = function(a) {
            return fb.ajax({url: a,type: "GET",dataType: "script",async: !1,global: !1,"throws": !0})
        }, fb.fn.extend({wrapAll: function(a) {
            if (fb.isFunction(a))
                return this.each(function(b) {
                    fb(this).wrapAll(a.call(this, b))
                });
            if (this[0]) {
                var b = fb(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    for (var a = this; a.firstChild && 1 === a.firstChild.nodeType; )
                        a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },wrapInner: function(a) {
            return this.each(fb.isFunction(a) ? function(b) {
                fb(this).wrapInner(a.call(this, b))
            } : function() {
                var b = fb(this), c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
                },wrap: function(a) {
                    var b = fb.isFunction(a);
                    return this.each(function(c) {
                        fb(this).wrapAll(b ? a.call(this, c) : a)
                    })
                        },unwrap: function() {
                            return this.parent().each(function() {
                                fb.nodeName(this, "body") || fb(this).replaceWith(this.childNodes)
                            }).end()
                        }}), fb.expr.filters.hidden = function(a) {
                            return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !db.reliableHiddenOffsets() && "none" === (a.style && a.style.display || fb.css(a, "display"))
                        }, fb.expr.filters.visible = function(a) {
                            return !fb.expr.filters.hidden(a)
                        };
        var Vc = /%20/g, Wc = /\[\]$/, Xc = /\r?\n/g, Yc = /^(?:submit|button|image|reset|file)$/i, Zc = /^(?:input|select|textarea|keygen)/i;
        fb.param = function(a, b) {
            var c, d = [], e = function(a, b) {
                b = fb.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
            };
            if (void 0 === b && (b = fb.ajaxSettings && fb.ajaxSettings.traditional), fb.isArray(a) || a.jquery && !fb.isPlainObject(a))
                fb.each(a, function() {
                    e(this.name, this.value)
                });
            else
                for (c in a)
                    S(c, a[c], b, e);
            return d.join("&").replace(Vc, "+")
        }, fb.fn.extend({serialize: function() {
            return fb.param(this.serializeArray())
        },serializeArray: function() {
            return this.map(function() {
                var a = fb.prop(this, "elements");
                return a ? fb.makeArray(a) : this
            }).filter(function() {
                var a = this.type;
                return this.name && !fb(this).is(":disabled") && Zc.test(this.nodeName) && !Yc.test(a) && (this.checked || !Fb.test(a))
            }).map(function(a, b) {
                var c = fb(this).val();
                return null == c ? null : fb.isArray(c) ? fb.map(c, function(a) {
                    return {name: b.name,value: a.replace(Xc, "\r\n")}
                }) : {name: b.name,value: c.replace(Xc, "\r\n")}
            }).get()
        }}), fb.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
            return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && T() || U()
        } : T;
        var $c = 0, _c = {}, ad = fb.ajaxSettings.xhr();
        a.ActiveXObject && fb(a).on("unload", function() {
            for (var a in _c)
                _c[a](void 0, !0)
        }), db.cors = !!ad && "withCredentials" in ad, ad = db.ajax = !!ad, ad && fb.ajaxTransport(function(a) {
            if (!a.crossDomain || db.cors) {
                var b;
                return {send: function(c, d) {
                    var e, f = a.xhr(), g = ++$c;
                    if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
                        for (e in a.xhrFields)
                            f[e] = a.xhrFields[e];
                    a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                    for (e in c)
                        void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                    f.send(a.hasContent && a.data || null), b = function(c, e) {
                        var h, i, j;
                        if (b && (e || 4 === f.readyState))
                            if (delete _c[g], b = void 0, f.onreadystatechange = fb.noop, e)
                                4 !== f.readyState && f.abort();
                        else {
                            j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                            try {
                                i = f.statusText
                            } catch (k) {
                                i = ""
                            }
                            h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                        }
                        j && d(h, i, j, f.getAllResponseHeaders())
                    }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = _c[g] = b : b()
                },abort: function() {
                    b && b(void 0, !0)
                }}
            }
        }), fb.ajaxSetup({accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents: {script: /(?:java|ecma)script/},converters: {"text script": function(a) {
            return fb.globalEval(a), a
        }}}), fb.ajaxPrefilter("script", function(a) {
            void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
        }), fb.ajaxTransport("script", function(a) {
            if (a.crossDomain) {
                var b, c = pb.head || fb("head")[0] || pb.documentElement;
                return {send: function(d, e) {
                    b = pb.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                        (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
                    }, c.insertBefore(b, c.firstChild)
                },abort: function() {
                    b && b.onload(void 0, !0)
                }}
            }
        });
        var bd = [], cd = /(=)\?(?=&|$)|\?\?/;
        fb.ajaxSetup({jsonp: "callback",jsonpCallback: function() {
            var a = bd.pop() || fb.expando + "_" + Fc++;
            return this[a] = !0, a
        }}), fb.ajaxPrefilter("json jsonp", function(b, c, d) {
            var e, f, g, h = b.jsonp !== !1 && (cd.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && cd.test(b.data) && "data");
            return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = fb.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(cd, "$1" + e) : b.jsonp !== !1 && (b.url += (Gc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function() {
                return g || fb.error(e + " was not called"), g[0]
            }, b.dataTypes[0] = "json", f = a[e], a[e] = function() {
                g = arguments
            }, d.always(function() {
                a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, bd.push(e)), g && fb.isFunction(f) && f(g[0]), g = f = void 0
            }), "script") : void 0
        }), fb.parseHTML = function(a, b, c) {
            if (!a || "string" != typeof a)
                return null;
            "boolean" == typeof b && (c = b, b = !1), b = b || pb;
            var d = mb.exec(a), e = !c && [];
            return d ? [b.createElement(d[1])] : (d = fb.buildFragment([a], b, e), e && e.length && fb(e).remove(), fb.merge([], d.childNodes))
        };
        var dd = fb.fn.load;
        fb.fn.load = function(a, b, c) {
            if ("string" != typeof a && dd)
                return dd.apply(this, arguments);
            var d, e, f, g = this, h = a.indexOf(" ");
            return h >= 0 && (d = a.slice(h, a.length), a = a.slice(0, h)), fb.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && fb.ajax({url: a,type: f,dataType: "html",data: b}).done(function(a) {
                e = arguments, g.html(d ? fb("<div>").append(fb.parseHTML(a)).find(d) : a)
            }).complete(c && function(a, b) {
                g.each(c, e || [a.responseText, b, a])
                    }), this
        }, fb.expr.filters.animated = function(a) {
            return fb.grep(fb.timers, function(b) {
                return a === b.elem
            }).length
        };
        var ed = a.document.documentElement;
        fb.offset = {setOffset: function(a, b, c) {
            var d, e, f, g, h, i, j, k = fb.css(a, "position"), l = fb(a), m = {};
            "static" === k && (a.style.position = "relative"), h = l.offset(), f = fb.css(a, "top"), i = fb.css(a, "left"), j = ("absolute" === k || "fixed" === k) && fb.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), fb.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
        }}, fb.fn.extend({offset: function(a) {
            if (arguments.length)
                return void 0 === a ? this : this.each(function(b) {
                    fb.offset.setOffset(this, a, b)
                });
            var b, c, d = {top: 0,left: 0}, e = this[0], f = e && e.ownerDocument;
            if (f)
                return b = f.documentElement, fb.contains(b, e) ? (typeof e.getBoundingClientRect !== yb && (d = e.getBoundingClientRect()), c = V(f), {top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)}) : d
        },position: function() {
            if (this[0]) {
                var a, b, c = {top: 0,left: 0}, d = this[0];
                return "fixed" === fb.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), fb.nodeName(a[0], "html") || (c = a.offset()), c.top += fb.css(a[0], "borderTopWidth", !0), c.left += fb.css(a[0], "borderLeftWidth", !0)), {top: b.top - c.top - fb.css(d, "marginTop", !0),left: b.left - c.left - fb.css(d, "marginLeft", !0)}
            }
        },offsetParent: function() {
            return this.map(function() {
                for (var a = this.offsetParent || ed; a && !fb.nodeName(a, "html") && "static" === fb.css(a, "position"); )
                    a = a.offsetParent;
                return a || ed
            })
        }}), fb.each({scrollLeft: "pageXOffset",scrollTop: "pageYOffset"}, function(a, b) {
            var c = /Y/.test(b);
            fb.fn[a] = function(d) {
                return Eb(this, function(a, d, e) {
                    var f = V(a);
                    return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void (f ? f.scrollTo(c ? fb(f).scrollLeft() : e, c ? e : fb(f).scrollTop()) : a[d] = e)
                }, a, d, arguments.length, null)
            }
        }), fb.each(["top", "left"], function(a, b) {
            fb.cssHooks[b] = A(db.pixelPosition, function(a, c) {
                return c ? (c = cc(a, b), ec.test(c) ? fb(a).position()[b] + "px" : c) : void 0
            })
        }), fb.each({Height: "height",Width: "width"}, function(a, b) {
            fb.each({padding: "inner" + a,content: b,"": "outer" + a}, function(c, d) {
                fb.fn[d] = function(d, e) {
                    var f = arguments.length && (c || "boolean" != typeof d), g = c || (d === !0 || e === !0 ? "margin" : "border");
                    return Eb(this, function(b, c, d) {
                        var e;
                        return fb.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? fb.css(b, c, g) : fb.style(b, c, d, g)
                    }, b, f ? d : void 0, f, null)
                }
            })
                }), fb.fn.size = function() {
                    return this.length
                }, fb.fn.andSelf = fb.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
                    return fb
                });
        var fd = a.jQuery, gd = a.$;
        return fb.noConflict = function(b) {
            return a.$ === fb && (a.$ = gd), b && a.jQuery === fb && (a.jQuery = fd), fb
        }, typeof b === yb && (a.jQuery = a.$ = fb), fb
    }), define("json2", [], function() {
        "use strict";
        function quote(a) {
            return escapable.lastIndex = 0, escapable.test(a) ? '"' + a.replace(escapable, function(a) {
                var b = meta[a];
                return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            }) + '"' : '"' + a + '"'
        }
        function str(a, b) {
            var c, d, e, f, g, h = gap, i = b[a];
            switch ("function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
            case "string":
                return quote(i);
            case "number":
                return isFinite(i) ? String(i) : "null";
            case "boolean":
            case "null":
                return String(i);
            case "object":
                if (!i)
                    return "null";
                if (gap += indent, g = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                    for (f = i.length, c = 0; f > c; c += 1)
                        g[c] = str(c, i) || "null";
                    return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]", gap = h, e
                }
                if (rep && "object" == typeof rep)
                    for (f = rep.length, c = 0; f > c; c += 1)
                        "string" == typeof rep[c] && (d = rep[c], e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                else
                    for (d in i)
                        Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}", gap = h, e
            }
        }
        var JSON = {}, cx, escapable, gap, indent, meta, rep;
        return escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, meta = {"\b": "\\b","	": "\\t","\n": "\\n","\f": "\\f","\r": "\\r",'"': '\\"',"\\": "\\\\"}, JSON.stringify = function(a, b, c) {
            var d;
            if (gap = "", indent = "", "number" == typeof c)
                for (d = 0; c > d; d += 1)
                    indent += " ";
            else
                "string" == typeof c && (indent = c);
            if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length))
                throw new Error("JSON.stringify");
            return str("", {"": a})
        }, cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, JSON.parse = function(text, reviver) {
            function walk(a, b) {
                var c, d, e = a[b];
                if (e && "object" == typeof e)
                    for (c in e)
                        Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), void 0 !== d ? e[c] = d : delete e[c]);
                return reviver.call(a, b, e)
            }
            var j;
            if (text = String(text), cx.lastIndex = 0, cx.test(text) && (text = text.replace(cx, function(a) {
                return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
            })), /^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
                return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({"": j}, "") : j;
            throw new SyntaxError("JSON.parse")
        }, JSON
    }), function() {
        var a = this, b = a._, c = Array.prototype, d = Object.prototype, e = Function.prototype, f = c.push, g = c.slice, h = c.concat, i = d.toString, j = d.hasOwnProperty, k = Array.isArray, l = Object.keys, m = e.bind, n = function(a) {
            return a instanceof n ? a : this instanceof n ? void (this._wrapped = a) : new n(a)
        };
        "undefined" != typeof exports ? ("undefined" != typeof module && module.exports && (exports = module.exports = n), exports._ = n) : a._ = n, n.VERSION = "1.7.0";
        var o = function(a, b, c) {
            if (void 0 === b)
                return a;
            switch (null == c ? 3 : c) {
            case 1:
                return function(c) {
                    return a.call(b, c)
                };
            case 2:
                return function(c, d) {
                    return a.call(b, c, d)
                };
            case 3:
                return function(c, d, e) {
                    return a.call(b, c, d, e)
                };
            case 4:
                return function(c, d, e, f) {
                    return a.call(b, c, d, e, f)
                }
            }
            return function() {
                return a.apply(b, arguments)
            }
        };
        n.iteratee = function(a, b, c) {
            return null == a ? n.identity : n.isFunction(a) ? o(a, b, c) : n.isObject(a) ? n.matches(a) : n.property(a)
        }, n.each = n.forEach = function(a, b, c) {
            if (null == a)
                return a;
            b = o(b, c);
            var d, e = a.length;
            if (e === +e)
                for (d = 0; e > d; d++)
                    b(a[d], d, a);
            else {
                var f = n.keys(a);
                for (d = 0, e = f.length; e > d; d++)
                    b(a[f[d]], f[d], a)
            }
            return a
        }, n.map = n.collect = function(a, b, c) {
            if (null == a)
                return [];
            b = n.iteratee(b, c);
            for (var d, e = a.length !== +a.length && n.keys(a), f = (e || a).length, g = Array(f), h = 0; f > h; h++)
                d = e ? e[h] : h, g[h] = b(a[d], d, a);
            return g
        };
        var p = "Reduce of empty array with no initial value";
        n.reduce = n.foldl = n.inject = function(a, b, c, d) {
            null == a && (a = []), b = o(b, d, 4);
            var e, f = a.length !== +a.length && n.keys(a), g = (f || a).length, h = 0;
            if (arguments.length < 3) {
                if (!g)
                    throw new TypeError(p);
                c = a[f ? f[h++] : h++]
            }
            for (; g > h; h++)
                e = f ? f[h] : h, c = b(c, a[e], e, a);
            return c
        }, n.reduceRight = n.foldr = function(a, b, c, d) {
            null == a && (a = []), b = o(b, d, 4);
            var e, f = a.length !== +a.length && n.keys(a), g = (f || a).length;
            if (arguments.length < 3) {
                if (!g)
                    throw new TypeError(p);
                c = a[f ? f[--g] : --g]
            }
            for (; g--; )
                e = f ? f[g] : g, c = b(c, a[e], e, a);
            return c
        }, n.find = n.detect = function(a, b, c) {
            var d;
            return b = n.iteratee(b, c), n.some(a, function(a, c, e) {
                return b(a, c, e) ? (d = a, !0) : void 0
            }), d
        }, n.filter = n.select = function(a, b, c) {
            var d = [];
            return null == a ? d : (b = n.iteratee(b, c), n.each(a, function(a, c, e) {
                b(a, c, e) && d.push(a)
            }), d)
        }, n.reject = function(a, b, c) {
            return n.filter(a, n.negate(n.iteratee(b)), c)
        }, n.every = n.all = function(a, b, c) {
            if (null == a)
                return !0;
            b = n.iteratee(b, c);
            var d, e, f = a.length !== +a.length && n.keys(a), g = (f || a).length;
            for (d = 0; g > d; d++)
                if (e = f ? f[d] : d, !b(a[e], e, a))
                    return !1;
            return !0
        }, n.some = n.any = function(a, b, c) {
            if (null == a)
                return !1;
            b = n.iteratee(b, c);
            var d, e, f = a.length !== +a.length && n.keys(a), g = (f || a).length;
            for (d = 0; g > d; d++)
                if (e = f ? f[d] : d, b(a[e], e, a))
                    return !0;
            return !1
        }, n.contains = n.include = function(a, b) {
            return null == a ? !1 : (a.length !== +a.length && (a = n.values(a)), n.indexOf(a, b) >= 0)
        }, n.invoke = function(a, b) {
            var c = g.call(arguments, 2), d = n.isFunction(b);
            return n.map(a, function(a) {
                return (d ? b : a[b]).apply(a, c)
            })
        }, n.pluck = function(a, b) {
            return n.map(a, n.property(b))
        }, n.where = function(a, b) {
            return n.filter(a, n.matches(b))
        }, n.findWhere = function(a, b) {
            return n.find(a, n.matches(b))
        }, n.max = function(a, b, c) {
            var d, e, f = -1 / 0, g = -1 / 0;
            if (null == b && null != a) {
                a = a.length === +a.length ? a : n.values(a);
                for (var h = 0, i = a.length; i > h; h++)
                    d = a[h], d > f && (f = d)
            } else
                b = n.iteratee(b, c), n.each(a, function(a, c, d) {
                    e = b(a, c, d), (e > g || e === -1 / 0 && f === -1 / 0) && (f = a, g = e)
                });
            return f
        }, n.min = function(a, b, c) {
            var d, e, f = 1 / 0, g = 1 / 0;
            if (null == b && null != a) {
                a = a.length === +a.length ? a : n.values(a);
                for (var h = 0, i = a.length; i > h; h++)
                    d = a[h], f > d && (f = d)
            } else
                b = n.iteratee(b, c), n.each(a, function(a, c, d) {
                    e = b(a, c, d), (g > e || 1 / 0 === e && 1 / 0 === f) && (f = a, g = e)
                });
            return f
        }, n.shuffle = function(a) {
            for (var b, c = a && a.length === +a.length ? a : n.values(a), d = c.length, e = Array(d), f = 0; d > f; f++)
                b = n.random(0, f), b !== f && (e[f] = e[b]), e[b] = c[f];
            return e
        }, n.sample = function(a, b, c) {
            return null == b || c ? (a.length !== +a.length && (a = n.values(a)), a[n.random(a.length - 1)]) : n.shuffle(a).slice(0, Math.max(0, b))
        }, n.sortBy = function(a, b, c) {
            return b = n.iteratee(b, c), n.pluck(n.map(a, function(a, c, d) {
                return {value: a,index: c,criteria: b(a, c, d)}
            }).sort(function(a, b) {
                var c = a.criteria, d = b.criteria;
                if (c !== d) {
                    if (c > d || void 0 === c)
                        return 1;
                    if (d > c || void 0 === d)
                        return -1
                }
                return a.index - b.index
            }), "value")
        };
        var q = function(a) {
            return function(b, c, d) {
                var e = {};
                return c = n.iteratee(c, d), n.each(b, function(d, f) {
                    var g = c(d, f, b);
                    a(e, d, g)
                }), e
            }
        };
        n.groupBy = q(function(a, b, c) {
            n.has(a, c) ? a[c].push(b) : a[c] = [b]
        }), n.indexBy = q(function(a, b, c) {
            a[c] = b
        }), n.countBy = q(function(a, b, c) {
            n.has(a, c) ? a[c]++ : a[c] = 1
        }), n.sortedIndex = function(a, b, c, d) {
            c = n.iteratee(c, d, 1);
            for (var e = c(b), f = 0, g = a.length; g > f; ) {
                var h = f + g >>> 1;
                c(a[h]) < e ? f = h + 1 : g = h
            }
            return f
        }, n.toArray = function(a) {
            return a ? n.isArray(a) ? g.call(a) : a.length === +a.length ? n.map(a, n.identity) : n.values(a) : []
        }, n.size = function(a) {
            return null == a ? 0 : a.length === +a.length ? a.length : n.keys(a).length
        }, n.partition = function(a, b, c) {
            b = n.iteratee(b, c);
            var d = [], e = [];
            return n.each(a, function(a, c, f) {
                (b(a, c, f) ? d : e).push(a)
            }), [d, e]
        }, n.first = n.head = n.take = function(a, b, c) {
            return null == a ? void 0 : null == b || c ? a[0] : 0 > b ? [] : g.call(a, 0, b)
        }, n.initial = function(a, b, c) {
            return g.call(a, 0, Math.max(0, a.length - (null == b || c ? 1 : b)))
        }, n.last = function(a, b, c) {
            return null == a ? void 0 : null == b || c ? a[a.length - 1] : g.call(a, Math.max(a.length - b, 0))
        }, n.rest = n.tail = n.drop = function(a, b, c) {
            return g.call(a, null == b || c ? 1 : b)
        }, n.compact = function(a) {
            return n.filter(a, n.identity)
        };
        var r = function(a, b, c, d) {
            if (b && n.every(a, n.isArray))
                return h.apply(d, a);
            for (var e = 0, g = a.length; g > e; e++) {
                var i = a[e];
                n.isArray(i) || n.isArguments(i) ? b ? f.apply(d, i) : r(i, b, c, d) : c || d.push(i)
            }
            return d
        };
        n.flatten = function(a, b) {
            return r(a, b, !1, [])
        }, n.without = function(a) {
            return n.difference(a, g.call(arguments, 1))
        }, n.uniq = n.unique = function(a, b, c, d) {
            if (null == a)
                return [];
            n.isBoolean(b) || (d = c, c = b, b = !1), null != c && (c = n.iteratee(c, d));
            for (var e = [], f = [], g = 0, h = a.length; h > g; g++) {
                var i = a[g];
                if (b)
                    g && f === i || e.push(i), f = i;
                else if (c) {
                    var j = c(i, g, a);
                    n.indexOf(f, j) < 0 && (f.push(j), e.push(i))
                } else
                    n.indexOf(e, i) < 0 && e.push(i)
            }
            return e
        }, n.union = function() {
            return n.uniq(r(arguments, !0, !0, []))
        }, n.intersection = function(a) {
            if (null == a)
                return [];
            for (var b = [], c = arguments.length, d = 0, e = a.length; e > d; d++) {
                var f = a[d];
                if (!n.contains(b, f)) {
                    for (var g = 1; c > g && n.contains(arguments[g], f); g++)
                        ;
                    g === c && b.push(f)
                }
            }
            return b
        }, n.difference = function(a) {
            var b = r(g.call(arguments, 1), !0, !0, []);
            return n.filter(a, function(a) {
                return !n.contains(b, a)
            })
        }, n.zip = function(a) {
            if (null == a)
                return [];
            for (var b = n.max(arguments, "length").length, c = Array(b), d = 0; b > d; d++)
                c[d] = n.pluck(arguments, d);
            return c
        }, n.object = function(a, b) {
            if (null == a)
                return {};
            for (var c = {}, d = 0, e = a.length; e > d; d++)
                b ? c[a[d]] = b[d] : c[a[d][0]] = a[d][1];
            return c
        }, n.indexOf = function(a, b, c) {
            if (null == a)
                return -1;
            var d = 0, e = a.length;
            if (c) {
                if ("number" != typeof c)
                    return d = n.sortedIndex(a, b), a[d] === b ? d : -1;
                d = 0 > c ? Math.max(0, e + c) : c
            }
            for (; e > d; d++)
                if (a[d] === b)
                    return d;
            return -1
        }, n.lastIndexOf = function(a, b, c) {
            if (null == a)
                return -1;
            var d = a.length;
            for ("number" == typeof c && (d = 0 > c ? d + c + 1 : Math.min(d, c + 1)); --d >= 0; )
                if (a[d] === b)
                    return d;
            return -1
        }, n.range = function(a, b, c) {
            arguments.length <= 1 && (b = a || 0, a = 0), c = c || 1;
            for (var d = Math.max(Math.ceil((b - a) / c), 0), e = Array(d), f = 0; d > f; f++, a += c)
                e[f] = a;
            return e
        };
        var s = function() {
        };
        n.bind = function(a, b) {
            var c, d;
            if (m && a.bind === m)
                return m.apply(a, g.call(arguments, 1));
            if (!n.isFunction(a))
                throw new TypeError("Bind must be called on a function");
            return c = g.call(arguments, 2), d = function() {
                if (!(this instanceof d))
                    return a.apply(b, c.concat(g.call(arguments)));
                s.prototype = a.prototype;
                var e = new s;
                s.prototype = null;
                var f = a.apply(e, c.concat(g.call(arguments)));
                return n.isObject(f) ? f : e
            }
        }, n.partial = function(a) {
            var b = g.call(arguments, 1);
            return function() {
                for (var c = 0, d = b.slice(), e = 0, f = d.length; f > e; e++)
                    d[e] === n && (d[e] = arguments[c++]);
                for (; c < arguments.length; )
                    d.push(arguments[c++]);
                return a.apply(this, d)
            }
        }, n.bindAll = function(a) {
            var b, c, d = arguments.length;
            if (1 >= d)
                throw new Error("bindAll must be passed function names");
            for (b = 1; d > b; b++)
                c = arguments[b], a[c] = n.bind(a[c], a);
            return a
        }, n.memoize = function(a, b) {
            var c = function(d) {
                var e = c.cache, f = b ? b.apply(this, arguments) : d;
                return n.has(e, f) || (e[f] = a.apply(this, arguments)), e[f]
            };
            return c.cache = {}, c
        }, n.delay = function(a, b) {
            var c = g.call(arguments, 2);
            return setTimeout(function() {
                return a.apply(null, c)
            }, b)
        }, n.defer = function(a) {
            return n.delay.apply(n, [a, 1].concat(g.call(arguments, 1)))
        }, n.throttle = function(a, b, c) {
            var d, e, f, g = null, h = 0;
            c || (c = {});
            var i = function() {
                h = c.leading === !1 ? 0 : n.now(), g = null, f = a.apply(d, e), g || (d = e = null)
            };
            return function() {
                var j = n.now();
                h || c.leading !== !1 || (h = j);
                var k = b - (j - h);
                return d = this, e = arguments, 0 >= k || k > b ? (clearTimeout(g), g = null, h = j, f = a.apply(d, e), g || (d = e = null)) : g || c.trailing === !1 || (g = setTimeout(i, k)), f
            }
        }, n.debounce = function(a, b, c) {
            var d, e, f, g, h, i = function() {
                var j = n.now() - g;
                b > j && j > 0 ? d = setTimeout(i, b - j) : (d = null, c || (h = a.apply(f, e), d || (f = e = null)))
            };
            return function() {
                f = this, e = arguments, g = n.now();
                var j = c && !d;
                return d || (d = setTimeout(i, b)), j && (h = a.apply(f, e), f = e = null), h
            }
        }, n.wrap = function(a, b) {
            return n.partial(b, a)
        }, n.negate = function(a) {
            return function() {
                return !a.apply(this, arguments)
            }
        }, n.compose = function() {
            var a = arguments, b = a.length - 1;
            return function() {
                for (var c = b, d = a[b].apply(this, arguments); c--; )
                    d = a[c].call(this, d);
                return d
            }
        }, n.after = function(a, b) {
            return function() {
                return --a < 1 ? b.apply(this, arguments) : void 0
            }
        }, n.before = function(a, b) {
            var c;
            return function() {
                return --a > 0 ? c = b.apply(this, arguments) : b = null, c
            }
        }, n.once = n.partial(n.before, 2), n.keys = function(a) {
            if (!n.isObject(a))
                return [];
            if (l)
                return l(a);
            var b = [];
            for (var c in a)
                n.has(a, c) && b.push(c);
            return b
        }, n.values = function(a) {
            for (var b = n.keys(a), c = b.length, d = Array(c), e = 0; c > e; e++)
                d[e] = a[b[e]];
            return d
        }, n.pairs = function(a) {
            for (var b = n.keys(a), c = b.length, d = Array(c), e = 0; c > e; e++)
                d[e] = [b[e], a[b[e]]];
            return d
        }, n.invert = function(a) {
            for (var b = {}, c = n.keys(a), d = 0, e = c.length; e > d; d++)
                b[a[c[d]]] = c[d];
            return b
        }, n.functions = n.methods = function(a) {
            var b = [];
            for (var c in a)
                n.isFunction(a[c]) && b.push(c);
            return b.sort()
        }, n.extend = function(a) {
            if (!n.isObject(a))
                return a;
            for (var b, c, d = 1, e = arguments.length; e > d; d++) {
                b = arguments[d];
                for (c in b)
                    j.call(b, c) && (a[c] = b[c])
            }
            return a
        }, n.pick = function(a, b, c) {
            var d, e = {};
            if (null == a)
                return e;
            if (n.isFunction(b)) {
                b = o(b, c);
                for (d in a) {
                    var f = a[d];
                    b(f, d, a) && (e[d] = f)
                }
            } else {
                var i = h.apply([], g.call(arguments, 1));
                a = new Object(a);
                for (var j = 0, k = i.length; k > j; j++)
                    d = i[j], d in a && (e[d] = a[d])
            }
            return e
        }, n.omit = function(a, b, c) {
            if (n.isFunction(b))
                b = n.negate(b);
            else {
                var d = n.map(h.apply([], g.call(arguments, 1)), String);
                b = function(a, b) {
                    return !n.contains(d, b)
                }
            }
            return n.pick(a, b, c)
        }, n.defaults = function(a) {
            if (!n.isObject(a))
                return a;
            for (var b = 1, c = arguments.length; c > b; b++) {
                var d = arguments[b];
                for (var e in d)
                    void 0 === a[e] && (a[e] = d[e])
            }
            return a
        }, n.clone = function(a) {
            return n.isObject(a) ? n.isArray(a) ? a.slice() : n.extend({}, a) : a
        }, n.tap = function(a, b) {
            return b(a), a
        };
        var t = function(a, b, c, d) {
            if (a === b)
                return 0 !== a || 1 / a === 1 / b;
            if (null == a || null == b)
                return a === b;
            a instanceof n && (a = a._wrapped), b instanceof n && (b = b._wrapped);
            var e = i.call(a);
            if (e !== i.call(b))
                return !1;
            switch (e) {
            case "[object RegExp]":
            case "[object String]":
                return "" + a == "" + b;
            case "[object Number]":
                return +a !== +a ? +b !== +b : 0 === +a ? 1 / +a === 1 / b : +a === +b;
            case "[object Date]":
            case "[object Boolean]":
                return +a === +b
            }
            if ("object" != typeof a || "object" != typeof b)
                return !1;
            for (var f = c.length; f--; )
                if (c[f] === a)
                    return d[f] === b;
            var g = a.constructor, h = b.constructor;
            if (g !== h && "constructor" in a && "constructor" in b && !(n.isFunction(g) && g instanceof g && n.isFunction(h) && h instanceof h))
                return !1;
            c.push(a), d.push(b);
            var j, k;
            if ("[object Array]" === e) {
                if (j = a.length, k = j === b.length)
                    for (; j-- && (k = t(a[j], b[j], c, d)); )
                        ;
            } else {
                var l, m = n.keys(a);
                if (j = m.length, k = n.keys(b).length === j)
                    for (; j-- && (l = m[j], k = n.has(b, l) && t(a[l], b[l], c, d)); )
                        ;
            }
            return c.pop(), d.pop(), k
        };
        n.isEqual = function(a, b) {
            return t(a, b, [], [])
        }, n.isEmpty = function(a) {
            if (null == a)
                return !0;
            if (n.isArray(a) || n.isString(a) || n.isArguments(a))
                return 0 === a.length;
            for (var b in a)
                if (n.has(a, b))
                    return !1;
            return !0
        }, n.isElement = function(a) {
            return !(!a || 1 !== a.nodeType)
        }, n.isArray = k || function(a) {
            return "[object Array]" === i.call(a)
        }, n.isObject = function(a) {
            var b = typeof a;
            return "function" === b || "object" === b && !!a
        }, n.each(["Arguments", "Function", "String", "Number", "Date", "RegExp"], function(a) {
            n["is" + a] = function(b) {
                return i.call(b) === "[object " + a + "]"
            }
        }), n.isArguments(arguments) || (n.isArguments = function(a) {
            return n.has(a, "callee")
        }), "function" != typeof /./ && (n.isFunction = function(a) {
            return "function" == typeof a || !1
        }), n.isFinite = function(a) {
            return isFinite(a) && !isNaN(parseFloat(a))
        }, n.isNaN = function(a) {
            return n.isNumber(a) && a !== +a
        }, n.isBoolean = function(a) {
            return a === !0 || a === !1 || "[object Boolean]" === i.call(a)
        }, n.isNull = function(a) {
            return null === a
        }, n.isUndefined = function(a) {
            return void 0 === a
        }, n.has = function(a, b) {
            return null != a && j.call(a, b)
        }, n.noConflict = function() {
            return a._ = b, this
        }, n.identity = function(a) {
            return a
        }, n.constant = function(a) {
            return function() {
                return a
            }
        }, n.noop = function() {
        }, n.property = function(a) {
            return function(b) {
                return b[a]
            }
        }, n.matches = function(a) {
            var b = n.pairs(a), c = b.length;
            return function(a) {
                if (null == a)
                    return !c;
                a = new Object(a);
                for (var d = 0; c > d; d++) {
                    var e = b[d], f = e[0];
                    if (e[1] !== a[f] || !(f in a))
                        return !1
                }
                return !0
            }
        }, n.times = function(a, b, c) {
            var d = Array(Math.max(0, a));
            b = o(b, c, 1);
            for (var e = 0; a > e; e++)
                d[e] = b(e);
            return d
        }, n.random = function(a, b) {
            return null == b && (b = a, a = 0), a + Math.floor(Math.random() * (b - a + 1))
        }, n.now = Date.now || function() {
            return (new Date).getTime()
        };
        var u = {"&": "&amp;","<": "&lt;",">": "&gt;",'"': "&quot;","'": "&#x27;","`": "&#x60;"}, v = n.invert(u), w = function(a) {
            var b = function(b) {
                return a[b]
            }, c = "(?:" + n.keys(a).join("|") + ")", d = RegExp(c), e = RegExp(c, "g");
            return function(a) {
                return a = null == a ? "" : "" + a, d.test(a) ? a.replace(e, b) : a
            }
        };
        n.escape = w(u), n.unescape = w(v), n.result = function(a, b) {
            if (null == a)
                return void 0;
            var c = a[b];
            return n.isFunction(c) ? a[b]() : c
        };
        var x = 0;
        n.uniqueId = function(a) {
            var b = ++x + "";
            return a ? a + b : b
        }, n.templateSettings = {evaluate: /<%([\s\S]+?)%>/g,interpolate: /<%=([\s\S]+?)%>/g,escape: /<%-([\s\S]+?)%>/g};
        var y = /(.)^/, z = {"'": "'","\\": "\\","\r": "r","\n": "n","\u2028": "u2028","\u2029": "u2029"}, A = /\\|'|\r|\n|\u2028|\u2029/g, B = function(a) {
            return "\\" + z[a]
        };
        n.template = function(a, b, c) {
            !b && c && (b = c), b = n.defaults({}, b, n.templateSettings);
            var d = RegExp([(b.escape || y).source, (b.interpolate || y).source, (b.evaluate || y).source].join("|") + "|$", "g"), e = 0, f = "__p+='";
            a.replace(d, function(b, c, d, g, h) {
                return f += a.slice(e, h).replace(A, B), e = h + b.length, c ? f += "'+\n((__t=(" + c + "))==null?'':_.escape(__t))+\n'" : d ? f += "'+\n((__t=(" + d + "))==null?'':__t)+\n'" : g && (f += "';\n" + g + "\n__p+='"), b
            }), f += "';\n", b.variable || (f = "with(obj||{}){\n" + f + "}\n"), f = "var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n" + f + "return __p;\n";
            try {
                var g = new Function(b.variable || "obj", "_", f)
            } catch (h) {
                throw h.source = f, h
            }
            var i = function(a) {
                return g.call(this, a, n)
            }, j = b.variable || "obj";
            return i.source = "function(" + j + "){\n" + f + "}", i
        }, n.chain = function(a) {
            var b = n(a);
            return b._chain = !0, b
        };
        var C = function(a) {
            return this._chain ? n(a).chain() : a
        };
        n.mixin = function(a) {
            n.each(n.functions(a), function(b) {
                var c = n[b] = a[b];
                n.prototype[b] = function() {
                    var a = [this._wrapped];
                    return f.apply(a, arguments), C.call(this, c.apply(n, a))
                }
            })
                }, n.mixin(n), n.each(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function(a) {
                    var b = c[a];
                    n.prototype[a] = function() {
                        var c = this._wrapped;
                        return b.apply(c, arguments), "shift" !== a && "splice" !== a || 0 !== c.length || delete c[0], C.call(this, c)
                    }
                }), n.each(["concat", "join", "slice"], function(a) {
                    var b = c[a];
                    n.prototype[a] = function() {
                        return C.call(this, b.apply(this._wrapped, arguments))
                    }
                }), n.prototype.value = function() {
                    return this._wrapped
                }, "function" == typeof define && define.amd && define("underscore", [], function() {
                    return n
                })
    }.call(this), function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("nexus-client", ["underscore", "atmosphere", "nexus-connection"], function(c, d, e) {
            return b(a, c, d, e)
        }) : a.NexusClient = b(a, a._, a.atmosphere, a.NexusConnection)
    }(this, function(a, b, c, d) {
        "use strict";
        function e(a, b) {
            this._endpoints = a, this._logger = b, this._seenMessages = {}, this._userIsPresent = !1, this._sendPresenceImmediatelyWhenPresent = !0, this._userPresenceFrequencySecs = 60, this.connections = this._createConnections(), this._startPingTest(), this._startConnectionKeepAlive()
        }
        var f = 12e5, g = "0.0.66";
        return e.prototype.addListener = function(a, c) {
            b.each(this.connections, function(b) {
                b.addListener(a, c)
            })
                }, e.prototype.setListener = function(a, b) {
                    this.addListener(a, b)
                }, e.prototype.sendEvent = function(a, b) {
                    this._publish({eventName: a,eventData: b})
                }, e.prototype.sendUserEvent = function(a, b, c) {
                    this._publish({"nx.ToUser": a,eventName: b,eventData: c})
                }, e.prototype.newMessage = function(a) {
                    this.sendEvent("NewMessage", a)
                }, e.prototype.newComment = function(a) {
                    this.sendEvent("NewComment", a)
                }, e.prototype.getMetrics = function() {
                    return void 0 !== this._lastResetMetrics && (new Date).getTime() - this._lastResetMetrics > f ? void 0 : {version: g,endpoints: b.map(this.connections, function(a) {
                        return a.getMetrics()
                    })}
                }, e.prototype.resetMetrics = function() {
                    b.each(this.connections, function(a) {
                        a.resetMetrics()
                    }), this._lastResetMetrics = (new Date).getTime()
                }, e.prototype.getEndpoints = function() {
                    return this._endpoints
                }, e.prototype.setUserPresent = function() {
                    this._userIsPresent || (this._userIsPresent = !0, this._sendPresenceImmediatelyWhenPresent && (this._sendPresenceImmediatelyWhenPresent = !1, this._userPresence(), this._startUserPresence()))
                }, e.prototype.setUserAbsent = function() {
                    this._userIsPresent = !1
                }, e.prototype.shutdown = function() {
                    this._stopUserPresence(), b.each(this.connections, function(a) {
                        a.shutdown()
                    })
                        }, e.prototype.unsubscribe = function() {
                            this.shutdown()
                        }, e.prototype._publish = function(a) {
                            var c = this._generateGuid();
                            a.eventGuid = c, b.each(this.connections, function(b) {
                                b.publish(a)
                            })
                                }, e.prototype._userPresence = function() {
                                    this._userIsPresent ? this._sendUserPresenceEvent() : (this._sendPresenceImmediatelyWhenPresent = !0, this._stopUserPresence())
                                }, e.prototype._sendUserPresenceEvent = function() {
                                    this.sendEvent("nx.UserPresence", {current_page: this._getCurrentPage()})
                                }, e.prototype._startUserPresence = function() {
                                    this.userPresenceInterval = setInterval(b.bind(this._userPresence, this), 1e3 * this._userPresenceFrequencySecs)
                                }, e.prototype._stopUserPresence = function() {
                                    this.userPresenceInterval && (this.userPresenceInterval = clearInterval(this.userPresenceInterval))
                                }, e.prototype._createConnections = function() {
                                    return b.map(this._endpoints, function(a) {
                                        return new d(a, g, this._seenMessages, b.bind(this._sendUserPresenceEvent, this), this._logger)
                                    }, this)
                                }, e.prototype._startPingTest = function() {
                                    b.each(this.connections, function(a) {
                                        a.startPingTest()
                                    })
                                        }, e.prototype._startConnectionKeepAlive = function() {
                                            b.each(this.connections, function(a) {
                                                a.startConnectionKeepAlive()
                                            })
                                                }, e.prototype._generateGuid = function() {
                                                    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(a) {
                                                        var b = 16 * Math.random() | 0, c = "x" === a ? b : 3 & b | 8;
                                                        return c.toString(16)
                                                    })
                                                }, e.prototype._getCurrentPage = function() {
                                                    return window.location.href
                                                }, e
    }), function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("nexus-connection", ["underscore", "atmosphere"], function(c, d) {
            return b(a, c, d)
        }) : a.NexusConnection = b(a, a._, a.atmosphere)
    }(this, function(a, b, c) {
        "use strict";
        function d(a, b, c, d, e) {
            this._endpoint = a, this._transport = this._getTransport(), this._logger = e, this._clientVersion = b, this._onFirstConnect = d, this._allowReconnect = !0, this._listeners = {}, this._seenMessages = c, this._connectionAttempts = 0, this._lastMessageSentAt = this._now(), this.websocket = {hadConnection: !1}, this["long-polling"] = {hadConnection: !1}, this.jsonp = {hadConnection: !1}, this.resetMetrics(), this._subscribe()
        }
        var e = "/client-test", f = 33e4;
        return d.prototype.addListener = function(a, b) {
            void 0 === this._listeners[a] ? this._listeners[a] = [b] : this._listeners[a].push(b)
        }, d.prototype.resetMetrics = function() {
            var a = {connections: 0,connectionDuration: 0,reconnections: 0,backoffDuration: 0}, c = {endpoint: this._endpoint,messagesReceived: 0,uniqueMessagesReceived: 0,errors: 0,messagesPublished: 0,timeouts: 0,transportFailures: 0,attempts: 0,successes: 0,failures: 0,totalTransitTime: 0,healthcheckFailures: 0,transports: {websocket: b.clone(a),"long-polling": b.clone(a),jsonp: b.clone(a)}};
            this.metrics = b.clone(c)
        }, d.prototype.getMetrics = function() {
            return this._sliceTimingMetrics(), this.metrics
        }, d.prototype.publish = function(a) {
            this._hasSubscription() && (this._seenMessages[a.eventGuid] = !0, this._subscription.push(JSON.stringify(a)), this._lastMessageSentAt = this._now())
        }, d.prototype.startPingTest = function() {
            this.addListener("ACK", b.bind(this._handlePingResponse, this)), this._pingTestInterval = setInterval(b.bind(function() {
                this._ping()
            }, this), 3e5)
        }, d.prototype.stopPingTest = function() {
            void 0 !== this._pingTestInterval && clearInterval(this._pingTestInterval)
        }, d.prototype.startConnectionKeepAlive = function() {
            this._keepAliveInterval = setInterval(b.bind(function() {
                this._keepAlive()
            }, this), 3e5)
        }, d.prototype.stopKeepAlive = function() {
            void 0 !== this._keepAliveInterval && clearInterval(this._keepAliveInterval)
        }, d.prototype.shutdown = function() {
            this._allowReconnect = !1, this.stopPingTest(), this.stopKeepAlive(), this._subscription.close()
        }, d.prototype._subscribe = function() {
            if (window.XDomainRequest)
                return this._logger.info("Not running Nexus client test on IE8/9"), this._createSubscription(), void this._setConnectionStart();
            var a = this._healthcheckEndpoint(), c = new XMLHttpRequest;
            c.onreadystatechange = b.bind(function() {
                4 === c.readyState && 200 === c.status ? (this._createSubscription(), this._setConnectionStart()) : 4 === c.readyState && 200 !== c.status && (this.metrics.healthcheckFailures++, this._connectionAttempts++, this._logger.info("Endpoint " + a + " unavailable, scheduling resubscribe"), this._scheduleReconnect("healthcheck-failure"))
            }, this), c.open("GET", a, !0), c.timeout = 2e3, c.send(null)
        }, d.prototype._createSubscription = function() {
            var a = this._endpoint, d = this._transport;
                -1 !== a.indexOf("router") ? "long-polling" === d || "jsonp" === d ? (a = a.replace(/nexus-router-a-\d+/, "nexus-long-poller-a"), a = a.replace(/nexus-router-b-\d+/, "nexus-long-poller-b")) : (a = a.replace(/nexus-router-a-\d+/, "nexus-websocket-a"), a = a.replace(/nexus-router-b-\d+/, "nexus-websocket-b")) : ("long-polling" === d || "jsonp" === d) && (a = a.replace(/websocket/, "long-poller"));
            var e = {websocket: {connectTimeout: 2e4},"long-polling": {connectTimeout: -1,enableXDR: !0,withCredentials: !0},jsonp: {connectTimeout: -1,enableXDR: !0,withCredentials: !0}}, f = {url: a,shared: !1,transport: d,fallbackTransport: "none",maxReconnectOnClose: 0,reconnectOnServerError: !1,closeAsync: !0,timeout: 13e4,onOpen: b.bind(this._onOpen, this),onClose: b.bind(this._onClose, this),onMessage: b.bind(this._onMessage, this),onError: b.bind(this._onError, this),onMessagePublished: b.bind(this._onMessagePublished, this),onClientTimeout: b.bind(this._onClientTimeout, this),onTransportFailure: b.bind(this._onTransportFailure, this),environment: "production",headers: {"X-Nexus-Version": this._clientVersion}};
            b.extend(f, e[d]), this._logger.info("Connecting to Nexus at " + a + " via " + d), this._subscription = c.subscribe(f)
        }, d.prototype._onOpen = function(a) {
            this[a.transport].hadConnection = !0, this.metrics.transports[a.transport].connections++, this._logger.info("Opened " + a.transport + " Nexus connection " + this._connectionUuidForResponse(a)), 0 === this._connectionAttempts && this._onFirstConnect()
        }, d.prototype._onClose = function(a) {
            this._logger.info("Closed " + a.transport + " Nexus connection " + this._connectionUuidForResponse(a))
        }, d.prototype._onMessage = function(a) {
            this.metrics.messagesReceived++;
            try {
                var b = JSON.parse(a.messages[0]), c = b.eventGuid;
                if (void 0 !== this._seenMessages[c])
                    return;
                this._seenMessages[c] = !0, this.metrics.uniqueMessagesReceived++, this._callListeners(b.eventName, b)
            } catch (d) {
                this.metrics.errors++, this._logger.error(d)
            }
        }, d.prototype._onError = function(a) {
            var b = this._connectionUuidForResponse(a);
            "maxReconnectOnClose reached" === a.reasonPhrase && "jsonp" === this._transport && this[this._transport].hadConnection && 0 === a.status ? this._reconnect(b) : ("maxReconnectOnClose reached" === a.reasonPhrase || "Unable to reconnect with fallback transport" === a.reasonPhrase || a.status >= 500 && a.status < 600) && this._retry(b), this._logger.info("Error for Nexus connection " + b + ": " + a.status + " - " + a.reasonPhrase), this.metrics.errors++
        }, d.prototype._onMessagePublished = function() {
            this.metrics.messagesPublished++
        }, d.prototype._onClientTimeout = function(a) {
            this._logger.info("Client timeout for Nexus connection " + a.uuid), this._retry(a.uuid), this.metrics.timeouts++
        }, d.prototype._onTransportFailure = function(a, b) {
            this._logger.info("Client timeout for Nexus connection " + b.uuid + ": " + a), this.metrics.transportFailures++
        }, d.prototype._retry = function(a) {
            return this._recordConnectionEnd(), "websocket" !== this._transport || this[this._transport].hadConnection ? (this[this._transport].hadConnection = !1, this._transport = this._getTransport(), this._connectionAttempts++, void this._scheduleReconnect(a)) : (this._transport = this._getFallbackTransport(), void this._reconnect(a))
        }, d.prototype._scheduleReconnect = function(a) {
            var c = this._calculateBackoff();
            this._logger.info("On retry number " + this._connectionAttempts + " for endpoint " + this._endpoint + " - backing off for " + c + "ms"), this._setBackoffStart(), b.delay(b.bind(function() {
                this._recordBackoffEnd(), this._reconnect(a)
            }, this), c)
        }, d.prototype._reconnect = function(a) {
            this._allowReconnect && ("healthcheck-failure" === a ? this._subscribe() : this._subscriptionReconnect(a))
        }, d.prototype._subscriptionReconnect = function(a) {
            a === this._subscription.getUUID() ? (this._subscription.close(), this._subscribe()) : this._logger.info("Not reconnecting to Nexus: asked to reconnect for " + a + ' (probably due to a "close" request failure) but current connection is ' + this._subscription.getUUID())
        }, d.prototype._setConnectionStart = function() {
            this[this._transport].lastConnectionAt = this._now()
        }, d.prototype._setBackoffStart = function() {
            this[this._transport].lastBackoffAt = this._now()
        }, d.prototype._recordConnectionEnd = function() {
            var a = this._transport;
            this.metrics.transports[a].connectionDuration += this._now() - this[a].lastConnectionAt, this[a].lastConnectionAt = void 0
        }, d.prototype._recordBackoffEnd = function() {
            var a = this._transport;
            this.metrics.transports[a].reconnections++, this.metrics.transports[a].backoffDuration += this._now() - this[a].lastBackoffAt, this[a].lastBackoffAt = void 0
        }, d.prototype._sliceTimingMetrics = function() {
            var a = this._transport;
            void 0 !== this[a].lastConnectionAt ? (this.metrics.transports[a].connectionDuration += this._now() - this[a].lastConnectionAt, this._setConnectionStart()) : void 0 !== this[a].lastBackoffAt && (this.metrics.transports[a].backoffDuration += this._now() - this[a].lastBackoffAt, this._setBackoffStart())
        }, d.prototype._handlePingResponse = function(a) {
            if (!b.isNumber(this._inFlightPing) || this._inFlightPing !== a.ACK.sendTime)
                return this._logger.info("Received unexpected ACK - something else is pinging for this user's channel - disabling pinging"), void clearInterval(this._pingTestInterval);
            var c = this._now() - a.ACK.sendTime;
            this.metrics.successes++, this.metrics.totalTransitTime += c, this._connectionAttempts > 0 && this._connectionAttempts--, delete this._inFlightPing
        }, d.prototype._keepAlive = function() {
            if (this._hasSubscription() && this._now() - this._lastMessageSentAt > f) {
                var a = this._now(), b = {eventName: "nx.KeepAlive",eventGuid: a,eventData: {sendTime: a}};
                this.publish(b)
            }
        }, d.prototype._ping = function() {
            if (this._hasSubscription()) {
                b.isNumber(this._inFlightPing) && this.metrics.failures++;
                var a = this._now();
                this._inFlightPing = a;
                var c = {eventName: "nx.Ping",eventGuid: a,eventData: {sendTime: a,endpoint: this._endpoint}};
                this.metrics.attempts++, this.publish(c)
            }
        }, d.prototype._callListeners = function(a, c) {
            b.each(this._listeners[a], b.bind(function(a) {
                a(c)
            }, this))
                }, d.prototype._connectionUuidForResponse = function(a) {
                    return b.isObject(a.request) ? a.request.uuid : this._subscription.getUUID()
                }, d.prototype._calculateBackoff = function() {
                    var a = Math.min(10, this._connectionAttempts + 4), b = Math.pow(2, a), c = b * Math.random(), d = b + c;
                    return 1e3 * d
                }, d.prototype._getTransport = function() {
                    return this._supportsWebSocket() ? "websocket" : this._getFallbackTransport()
                }, d.prototype._getFallbackTransport = function() {
                    return window.XDomainRequest && document.location.protocol !== this._parsedEndpoint().protocol ? "jsonp" : "long-polling"
                }, d.prototype._supportsWebSocket = function() {
                    return window.WebSocket || window.MozWebSocket
                }, d.prototype._healthcheckEndpoint = function() {
                    var a = this._parsedEndpoint();
                    return a.protocol + "//" + a.host + e
                }, d.prototype._parsedEndpoint = function() {
                    var a = document.createElement("a");
                    return a.href = this._endpoint, {host: a.host,hostname: a.hostname,pathname: a.pathname,port: a.port,protocol: a.protocol,search: a.search,hash: a.hash}
                }, d.prototype._hasSubscription = function() {
                    return void 0 !== this._subscription
                }, d.prototype._now = function() {
                    return (new Date).getTime()
                }, d
    }), function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("atmosphere", [], function() {
            return b()
        }) : a.atmosphere = b()
    }(this, function() {
        "use strict";
        var a, b = "2.2.6-javascript", c = {}, d = !1, e = [], f = [], g = 0, h = "production", i = Object.prototype.hasOwnProperty;
        return c = {onError: function() {
        },onClose: function() {
        },onOpen: function() {
        },onReopen: function() {
        },onMessage: function() {
        },onReconnect: function() {
        },onMessagePublished: function() {
        },onTransportFailure: function() {
        },onLocalMessage: function() {
        },onFailureToReconnect: function() {
        },onClientTimeout: function() {
        },onOpenAfterResume: function() {
        },WebsocketApiAdapter: function(a) {
            var b, d;
            return a.onMessage = function(a) {
                d.onmessage({data: a.responseBody})
            }, a.onMessagePublished = function(a) {
                d.onmessage({data: a.responseBody})
            }, a.onOpen = function(a) {
                d.onopen(a)
            }, d = {close: function() {
                b.close()
            },send: function(a) {
                b.push(a)
            },onmessage: function() {
            },onopen: function() {
            },onclose: function() {
            },onerror: function() {
            }}, b = new c.subscribe(a), d
        },AtmosphereRequest: function(a) {
            function e() {
                ub = !0, yb = !1, vb = 0, pb = null, qb = null, rb = null, sb = null
            }
            function i() {
                n(), e()
            }
            function j(a) {
                return "debug" == a ? "debug" === nb.logLevel : "info" == a ? "info" === nb.logLevel || "debug" === nb.logLevel : "warn" == a ? "warn" === nb.logLevel || "info" === nb.logLevel || "debug" === nb.logLevel : "error" == a ? "error" === nb.logLevel || "warn" === nb.logLevel || "info" === nb.logLevel || "debug" === nb.logLevel : !1
            }
            function k(a, b) {
                return "" === ob.partialMessage && "streaming" === b.transport && a.responseText.length > b.maxStreamingLength ? !0 : !1
            }
            function l() {
                if (nb.enableProtocol && !nb.firstMessage && "websocket" !== nb.transport) {
                    var a = "X-Atmosphere-Transport=close&X-Atmosphere-tracking-id=" + nb.uuid;
                    c.util.each(nb.headers, function(b, d) {
                        var e = c.util.isFunction(d) ? d.call(this, nb, nb, ob) : d;
                        null != e && (a += "&" + encodeURIComponent(b) + "=" + encodeURIComponent(e))
                    });
                    var b = nb.url.replace(/([?&])_=[^&]*/, a);
                    b += b === nb.url ? (/\?/.test(nb.url) ? "&" : "?") + a : "";
                    var d = {connected: !1}, e = new c.AtmosphereRequest(d);
                    e.attachHeadersAsQueryString = !1, e.dropHeaders = !0, e.url = b, e.contentType = "text/plain", e.transport = "polling", e.method = "GET", e.data = "", nb.enableXDR && (e.enableXDR = nb.enableXDR), e.async = nb.closeAsync, W("", e)
                }
            }
            function m() {
                j("debug") && c.util.debug("Closing"), yb = !0, nb.reconnectId && (clearTimeout(nb.reconnectId), delete nb.reconnectId), nb.heartbeatTimer && clearTimeout(nb.heartbeatTimer), nb.reconnect = !1, ob.request = nb, ob.state = "unsubscribe", ob.responseBody = "", ob.status = 408, ob.partialMessage = "", jb(), l(), n()
            }
            function n() {
                ob.partialMessage = "", nb.id && clearTimeout(nb.id), nb.heartbeatTimer && clearTimeout(nb.heartbeatTimer), null != sb && (sb.close(), sb = null), null != tb && (tb.abort(), tb = null), null != rb && (rb.abort(), rb = null), null != pb && (pb.close(), pb = null), null != qb && (qb.close(), qb = null), o()
            }
            function o() {
                null != kb && (clearInterval(lb), document.cookie = mb + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/", kb.signal("close", {reason: "",heir: yb ? (kb.get("children") || [])[0] : Bb}), kb.close()), null != Ab && Ab.close()
            }
            function p(a) {
                i(), nb = c.util.extend(nb, a), h = nb.environment, nb.mrequest = nb.reconnect, nb.reconnect || (nb.reconnect = !0)
            }
            function q() {
                return null != nb.webSocketImpl || window.WebSocket || window.MozWebSocket
            }
            function r() {
                return window.EventSource
            }
            function s() {
                if (nb.shared) {
                    if (Ab = t(nb), null != Ab && (j("debug") && c.util.debug("Storage service available. All communication will be local"), Ab.open(nb)))
                        return;
                    j("debug") && c.util.debug("No Storage service available."), Ab = null
                }
                nb.firstMessage = 0 == g ? !0 : !1, nb.isOpen = !1, nb.ctime = c.util.now(), 0 === nb.uuid && (nb.uuid = g), ob.closedByClientTimeout = !1, "websocket" !== nb.transport && "sse" !== nb.transport ? L(nb) : "websocket" === nb.transport ? q() ? B(!1) : H("Websocket is not supported, using request.fallbackTransport (" + nb.fallbackTransport + ")") : "sse" === nb.transport && (r() ? A(!1) : H("Server Side Events(SSE) is not supported, using request.fallbackTransport (" + nb.fallbackTransport + ")"))
            }
            function t(a) {
                function b(a, b) {
                    var c, d = a.length;
                    for (c = 0; d > c; c++)
                        a[c] === b && a.splice(c, 1);
                    return d !== a.length
                }
                function d(b) {
                    var d = c.util.parseJSON(b), e = d.data;
                    if ("c" === d.target)
                        switch (d.type) {
                        case "open":
                            v("opening", "local", nb);
                            break;
                        case "close":
                            h || (h = !0, "aborted" === e.reason ? m() : e.heir === Bb ? s() : setTimeout(function() {
                                s()
                            }, 100));
                            break;
                        case "message":
                            eb(e, "messageReceived", 200, a.transport);
                            break;
                        case "localMessage":
                            db(e)
                        }
                }
                function e() {
                    var a = new RegExp("(?:^|; )(" + encodeURIComponent(i) + ")=([^;]*)").exec(document.cookie);
                    return a ? c.util.parseJSON(decodeURIComponent(a[2])) : void 0
                }
                var f, g, h, i = "atmosphere-" + a.url, j = {storage: function() {
                    function e(a) {
                        a.key === i && a.newValue && d(a.newValue)
                    }
                    if (c.util.storage) {
                        var f = window.localStorage, g = function(a) {
                            return c.util.parseJSON(f.getItem(i + "-" + a))
                        }, h = function(a, b) {
                            f.setItem(i + "-" + a, c.util.stringifyJSON(b))
                        };
                        return {init: function() {
                            return h("children", g("children").concat([Bb])), c.util.on(window, "storage", e), g("opened")
                        },signal: function(a, b) {
                            f.setItem(i, c.util.stringifyJSON({target: "p",type: a,data: b}))
                        },close: function() {
                            var d = g("children");
                            c.util.off(window, "storage", e), d && b(d, a.id) && h("children", d)
                        }}
                    }
                },windowref: function() {
                    var a = window.open("", i.replace(/\W/g, ""));
                    if (a && !a.closed && a.callbacks)
                        return {init: function() {
                            return a.callbacks.push(d), a.children.push(Bb), a.opened
                        },signal: function(b, d) {
                            !a.closed && a.fire && a.fire(c.util.stringifyJSON({target: "p",type: b,data: d}))
                        },close: function() {
                            h || (b(a.callbacks, d), b(a.children, Bb))
                        }}
                }};
                return f = e(), !f || c.util.now() - f.ts > 1e3 || !(g = j.storage() || j.windowref()) ? void 0 : {open: function() {
                    var b;
                    return lb = setInterval(function() {
                        var a = f;
                        f = e(), f && a.ts !== f.ts || d(c.util.stringifyJSON({target: "c",type: "close",data: {reason: "error",heir: a.heir}}))
                    }, 1e3), b = g.init(), b && setTimeout(function() {
                        v("opening", "local", a)
                    }, 50), b
                },send: function(a) {
                    g.signal("send", a)
                },localSend: function(a) {
                    g.signal("localSend", c.util.stringifyJSON({id: Bb,event: a}))
                },close: function() {
                    yb || (clearInterval(lb), g.signal("close"), g.close())
                }}
            }
            function u() {
                function a(a) {
                    var b = c.util.parseJSON(a), d = b.data;
                    if ("p" === b.target)
                        switch (b.type) {
                        case "send":
                            V(d);
                            break;
                        case "localSend":
                            db(d);
                            break;
                        case "close":
                            m()
                        }
                }
                function b() {
                    document.cookie = mb + "=" + encodeURIComponent(c.util.stringifyJSON({ts: c.util.now() + 1,heir: (d.get("children") || [])[0]})) + "; path=/"
                }
                var d, e = "atmosphere-" + nb.url, f = {storage: function() {
                    function b(b) {
                        b.key === e && b.newValue && a(b.newValue)
                    }
                    if (c.util.storage) {
                        var d = window.localStorage;
                        return {init: function() {
                            c.util.on(window, "storage", b)
                        },signal: function(a, b) {
                            d.setItem(e, c.util.stringifyJSON({target: "c",type: a,data: b}))
                        },get: function(a) {
                            return c.util.parseJSON(d.getItem(e + "-" + a))
                        },set: function(a, b) {
                            d.setItem(e + "-" + a, c.util.stringifyJSON(b))
                        },close: function() {
                            c.util.off(window, "storage", b), d.removeItem(e), d.removeItem(e + "-opened"), d.removeItem(e + "-children")
                        }}
                    }
                },windowref: function() {
                    var b, d = e.replace(/\W/g, ""), f = document.getElementById(d);
                    return f || (f = document.createElement("div"), f.id = d, f.style.display = "none", f.innerHTML = '<iframe name="' + d + '" />', document.body.appendChild(f)), b = f.firstChild.contentWindow, {init: function() {
                        b.callbacks = [a], b.fire = function(a) {
                            var c;
                            for (c = 0; c < b.callbacks.length; c++)
                                b.callbacks[c](a)
                        }
                    },signal: function(a, d) {
                        !b.closed && b.fire && b.fire(c.util.stringifyJSON({target: "c",type: a,data: d}))
                    },get: function(a) {
                        return b.closed ? null : b[a]
                    },set: function(a, c) {
                        b.closed || (b[a] = c)
                    },close: function() {
                    }}
                }};
                zb = function(a) {
                    d.signal("message", a)
                }, d = f.storage() || f.windowref(), d.init(), j("debug") && c.util.debug("Installed StorageService " + d), d.set("children", []), null == d.get("opened") || d.get("opened") || d.set("opened", !1), mb = encodeURIComponent(e), b(), lb = setInterval(b, 1e3), kb = d
            }
            function v(a, b, c) {
                if (nb.shared && "local" !== b && u(), null != kb && kb.set("opened", !0), c.close = function() {
                    m()
                }, vb > 0 && "re-connecting" === a)
                    c.isReopen = !0, P(ob);
                else if (null == ob.error) {
                    ob.request = c;
                    var d = ob.state;
                    ob.state = a;
                    var e = ob.transport;
                    ob.transport = b;
                    var f = ob.responseBody;
                    jb(), ob.responseBody = f, ob.state = d, ob.transport = e
                }
            }
            function w(a) {
                a.transport = "jsonp";
                var b, d = nb;
                null != a && "undefined" != typeof a && (d = a), tb = {open: function() {
                    function e() {
                        d.lastIndex = 0, d.openId && clearTimeout(d.openId), d.heartbeatTimer && clearTimeout(d.heartbeatTimer), d.reconnect && vb++ < d.maxReconnectOnClose ? (v("re-connecting", d.transport, d), O(tb, d, a.reconnectInterval), d.openId = setTimeout(function() {
                            J(d)
                        }, d.reconnectInterval + 1e3)) : F(0, "maxReconnectOnClose reached")
                    }
                    function f() {
                        var c = d.url;
                        null != d.dispatchUrl && (c += d.dispatchUrl);
                        var f = d.data;
                        d.attachHeadersAsQueryString && (c = I(d), "" !== f && (c += "&X-Atmosphere-Post-Body=" + encodeURIComponent(f)), f = "");
                        var h = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
                        b = document.createElement("script"), b.src = c + "&jsonpTransport=" + g, b.clean = function() {
                            b.clean = b.onerror = b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), 2 === ++a.scriptCount && (a.scriptCount = 1, e())
                        }, b.onload = b.onreadystatechange = function() {
                            (!b.readyState || /loaded|complete/.test(b.readyState)) && b.clean()
                        }, b.onerror = function() {
                            a.scriptCount = 1, b.clean()
                        }, h.insertBefore(b, h.firstChild)
                    }
                    var g = "atmosphere" + (Bb = c.util.random());
                    window[g] = function(b) {
                        if ("" !== b.message)
                            if (a.scriptCount = 0, d.reconnect && -1 === d.maxRequest || d.requestCount++ < d.maxRequest) {
                                if (d.executeCallbackBeforeReconnect || O(tb, d, d.pollingInterval), null != b && "string" != typeof b)
                                    try {
                                        b = b.message
                                    } catch (e) {
                                    }
                                var f = G(b, d, ob);
                                f || eb(ob.responseBody, "messageReceived", 200, d.transport), d.executeCallbackBeforeReconnect && O(tb, d, d.pollingInterval), D(d)
                            } else
                                c.util.log(nb.logLevel, ["JSONP reconnect maximum try reached " + nb.requestCount]), F(0, "maxRequest reached")
                    }, setTimeout(function() {
                        f()
                    }, 50)
                },abort: function() {
                    b && b.clean && b.clean()
                }}, tb.open()
            }
            function x(a) {
                return null != nb.webSocketImpl ? nb.webSocketImpl : window.WebSocket ? new WebSocket(a) : new MozWebSocket(a)
            }
            function y() {
                return I(nb, c.util.getAbsoluteURL(nb.webSocketUrl || nb.url)).replace(/^http/, "ws")
            }
            function z() {
                var a = I(nb);
                return a
            }
            function A(a) {
                ob.transport = "sse";
                var b = z();
                if (j("debug") && (c.util.debug("Invoking executeSSE"), c.util.debug("Using URL: " + b)), a && !nb.reconnect)
                    return void (null != qb && n());
                try {
                    qb = new EventSource(b, {withCredentials: nb.withCredentials})
                } catch (d) {
                    return F(0, d), void H("SSE failed. Downgrading to fallback transport and resending")
                }
                nb.connectTimeout > 0 && (nb.id = setTimeout(function() {
                    a || n()
                }, nb.connectTimeout)), qb.onopen = function() {
                    D(nb), j("debug") && c.util.debug("SSE successfully opened"), nb.enableProtocol ? nb.isReopen && (nb.isReopen = !1, v("re-opening", nb.transport, nb)) : a ? v("re-opening", "sse", nb) : v("opening", "sse", nb), a = !0, "POST" === nb.method && (ob.state = "messageReceived", qb.send(nb.data))
                }, qb.onmessage = function(a) {
                    if (D(nb), !nb.enableXDR && a.origin && a.origin !== window.location.protocol + "//" + window.location.host)
                        return void c.util.log(nb.logLevel, ["Origin was not " + window.location.protocol + "//" + window.location.host]);
                    ob.state = "messageReceived", ob.status = 200, a = a.data;
                    var b = G(a, nb, ob);
                    b || (jb(), ob.responseBody = "", ob.messages = [])
                }, qb.onerror = function() {
                    clearTimeout(nb.id), nb.heartbeatTimer && clearTimeout(nb.heartbeatTimer), ob.closedByClientTimeout || (ib(a), n(), yb ? c.util.log(nb.logLevel, ["SSE closed normally"]) : a ? nb.reconnect && "sse" === ob.transport && (vb++ < nb.maxReconnectOnClose ? (v("re-connecting", nb.transport, nb), nb.reconnectInterval > 0 ? nb.reconnectId = setTimeout(function() {
                        A(!0)
                    }, nb.reconnectInterval) : A(!0), ob.responseBody = "", ob.messages = []) : (c.util.log(nb.logLevel, ["SSE reconnect maximum try reached " + vb]), F(0, "maxReconnectOnClose reached"))) : H("SSE failed. Downgrading to fallback transport and resending"))
                }
            }
            function B(a) {
                ob.transport = "websocket";
                var b = y(nb.url);
                if (j("debug") && (c.util.debug("Invoking executeWebSocket"), c.util.debug("Using URL: " + b)), a && !nb.reconnect)
                    return void (null != pb && n());
                pb = x(b), null != nb.webSocketBinaryType && (pb.binaryType = nb.webSocketBinaryType), nb.connectTimeout > 0 && (nb.id = setTimeout(function() {
                    if (a)
                        ;
                    else {
                        var b = {code: 1002,reason: "",wasClean: !1};
                        pb.onclose(b);
                        try {
                            n()
                        } catch (c) {
                        }
                    }
                }, nb.connectTimeout)), pb.onopen = function() {
                    D(nb), d = !1, j("debug") && c.util.debug("Websocket successfully opened");
                    var b = a;
                    null != pb && (pb.canSendMessage = !0), nb.enableProtocol || (a = !0, b ? v("re-opening", "websocket", nb) : v("opening", "websocket", nb)), null != pb && "POST" === nb.method && (ob.state = "messageReceived", pb.send(nb.data))
                }, pb.onmessage = function(b) {
                    D(nb), nb.enableProtocol && (a = !0), ob.state = "messageReceived", ob.status = 200, b = b.data;
                    var c = "string" == typeof b;
                    if (c) {
                        var d = G(b, nb, ob);
                        d || (jb(), ob.responseBody = "", ob.messages = [])
                    } else {
                        if (b = C(nb, b), "" === b)
                            return;
                        ob.responseBody = b, jb(), ob.responseBody = null
                    }
                }, pb.onerror = function() {
                    clearTimeout(nb.id), nb.heartbeatTimer && clearTimeout(nb.heartbeatTimer)
                }, pb.onclose = function(b) {
                    if (clearTimeout(nb.id), "closed" !== ob.state) {
                        var e = b.reason;
                        if ("" === e)
                            switch (b.code) {
                            case 1e3:
                                e = "Normal closure; the connection successfully completed whatever purpose for which it was created.";
                                break;
                            case 1001:
                                e = "The endpoint is going away, either because of a server failure or because the browser is navigating away from the page that opened the connection.";
                                break;
                            case 1002:
                                e = "The endpoint is terminating the connection due to a protocol error.";
                                break;
                            case 1003:
                                e = "The connection is being terminated because the endpoint received data of a type it cannot accept (for example, a text-only endpoint received binary data).";
                                break;
                            case 1004:
                                e = "The endpoint is terminating the connection because a data frame was received that is too large.";
                                break;
                            case 1005:
                                e = "Unknown: no status code was provided even though one was expected.";
                                break;
                            case 1006:
                                e = "Connection was closed abnormally (that is, with no close frame being sent)."
                            }
                        if (j("warn") && (c.util.warn("Websocket closed, reason: " + e), c.util.warn("Websocket closed, wasClean: " + b.wasClean)), ob.closedByClientTimeout || d)
                            return void (nb.reconnectId && (clearTimeout(nb.reconnectId), delete nb.reconnectId));
                        ib(a), ob.state = "closed", yb ? c.util.log(nb.logLevel, ["Websocket closed normally"]) : a ? nb.reconnect && "websocket" === ob.transport && 1001 !== b.code && (n(), vb++ < nb.maxReconnectOnClose ? (v("re-connecting", nb.transport, nb), nb.reconnectInterval > 0 ? nb.reconnectId = setTimeout(function() {
                            ob.responseBody = "", ob.messages = [], B(!0)
                        }, nb.reconnectInterval) : (ob.responseBody = "", ob.messages = [], B(!0))) : (c.util.log(nb.logLevel, ["Websocket reconnect maximum try reached " + nb.requestCount]), j("warn") && c.util.warn("Websocket error, reason: " + b.reason), F(0, "maxReconnectOnClose reached"))) : H("Websocket failed. Downgrading to Comet and resending")
                    }
                };
                var e = navigator.userAgent.toLowerCase(), f = e.indexOf("android") > -1;
                f && void 0 === pb.url && pb.onclose({reason: "Android 4.1 does not support websockets.",wasClean: !1})
            }
            function C(a, b) {
                var d = b;
                if ("polling" === a.transport)
                    return d;
                if (0 !== c.util.trim(b).length && a.enableProtocol && a.firstMessage) {
                    var e = a.trackMessageLength ? 1 : 0, f = b.split(a.messageDelimiter);
                    if (f.length <= e + 1)
                        return d;
                    if (a.firstMessage = !1, a.uuid = c.util.trim(f[e]), f.length <= e + 2 && c.util.log("error", ["Protocol data not sent by the server. If you enable protocol on client side, be sure to install JavascriptProtocol interceptor on server side.Also note that atmosphere-runtime 2.2+ should be used."]), wb = parseInt(c.util.trim(f[e + 1]), 10), xb = f[e + 2], "long-polling" !== a.transport && J(a), g = a.uuid, d = "", e = a.trackMessageLength ? 4 : 3, f.length > e + 1)
                        for (var h = e; h < f.length; h++)
                            d += f[h], h + 1 !== f.length && (d += a.messageDelimiter);
                    0 !== a.ackInterval && setTimeout(function() {
                        V("...ACK...")
                    }, a.ackInterval)
                } else
                    a.enableProtocol && a.firstMessage && c.util.browser.msie && +c.util.browser.version.split(".")[0] < 10 ? c.util.log(nb.logLevel, ["Receiving unexpected data from IE"]) : J(a);
                return d
            }
            function D(a) {
                clearTimeout(a.id), a.timeout > 0 && "polling" !== a.transport && (a.id = setTimeout(function() {
                    E(a), l(), n()
                }, a.timeout))
            }
            function E() {
                ob.closedByClientTimeout = !0, ob.state = "closedByClient", ob.responseBody = "", ob.status = 408, ob.messages = [], jb()
            }
            function F(a, b) {
                n(), clearTimeout(nb.id), ob.state = "error", ob.reasonPhrase = b, ob.responseBody = "", ob.status = a, ob.messages = [], jb()
            }
            function G(a, b, c) {
                if (a = C(b, a), 0 === a.length)
                    return !0;
                if (c.responseBody = a, b.trackMessageLength) {
                    a = c.partialMessage + a;
                    var d = [], e = a.indexOf(b.messageDelimiter);
                    if (-1 != e) {
                        for (; -1 !== e; ) {
                            var f = a.substring(0, e), g = +f;
                            if (isNaN(g))
                                throw new Error('message length "' + f + '" is not a number');
                            e += b.messageDelimiter.length, e + g > a.length ? e = -1 : (d.push(a.substring(e, e + g)), a = a.substring(e + g, a.length), e = a.indexOf(b.messageDelimiter))
                        }
                        return c.partialMessage = a, 0 !== d.length ? (c.responseBody = d.join(b.messageDelimiter), c.messages = d, !1) : (c.responseBody = "", c.messages = [], !0)
                    }
                }
                return c.responseBody = a, c.messages = [a], !1
            }
            function H(a) {
                c.util.log(nb.logLevel, [a]), "undefined" != typeof nb.onTransportFailure ? nb.onTransportFailure(a, nb) : "undefined" != typeof c.util.onTransportFailure && c.util.onTransportFailure(a, nb), nb.transport = nb.fallbackTransport;
                var b = -1 === nb.connectTimeout ? 0 : nb.connectTimeout;
                nb.reconnect && "none" !== nb.transport || null == nb.transport ? (nb.method = nb.fallbackMethod, ob.transport = nb.fallbackTransport, nb.fallbackTransport = "none", b > 0 ? nb.reconnectId = setTimeout(function() {
                    s()
                }, b) : s()) : F(500, "Unable to reconnect with fallback transport")
            }
            function I(a, d) {
                var e = nb;
                return null != a && "undefined" != typeof a && (e = a), null == d && (d = e.url), e.attachHeadersAsQueryString ? -1 !== d.indexOf("X-Atmosphere-Framework") ? d : (d += -1 !== d.indexOf("?") ? "&" : "?", d += "X-Atmosphere-tracking-id=" + e.uuid, d += "&X-Atmosphere-Framework=" + b, d += "&X-Atmosphere-Transport=" + e.transport, e.trackMessageLength && (d += "&X-Atmosphere-TrackMessageSize=true"), null !== e.heartbeat && null !== e.heartbeat.server && (d += "&X-Heartbeat-Server=" + e.heartbeat.server), "" !== e.contentType && (d += "&Content-Type=" + ("websocket" === e.transport ? e.contentType : encodeURIComponent(e.contentType))), e.enableProtocol && (d += "&X-atmo-protocol=true"), c.util.each(e.headers, function(b, f) {
                    var g = c.util.isFunction(f) ? f.call(this, e, a, ob) : f;
                    null != g && (d += "&" + encodeURIComponent(b) + "=" + encodeURIComponent(g))
                }), d) : d
            }
            function J(a) {
                if (a.isOpen)
                    if (a.isReopen)
                        a.isReopen = !1, v("re-opening", a.transport, a);
                else {
                    if ("messageReceived" !== ob.state || "jsonp" !== a.transport && "long-polling" !== a.transport)
                        return;
                    Q(ob)
                }
                else
                    a.isOpen = !0, v("opening", a.transport, a);
                K(a)
            }
            function K(a) {
                if (null != a.heartbeatTimer && clearTimeout(a.heartbeatTimer), !isNaN(wb) && wb > 0) {
                    var b = function() {
                        j("debug") && c.util.debug("Sending heartbeat"), V(xb), a.heartbeatTimer = setTimeout(b, wb)
                    };
                    a.heartbeatTimer = setTimeout(b, wb)
                }
            }
            function L(a) {
                var b = nb;
                if ((null != a || "undefined" != typeof a) && (b = a), b.lastIndex = 0, b.readyState = 0, "jsonp" === b.transport || b.enableXDR && c.util.checkCORSSupport())
                    return void w(b);
                if (c.util.browser.msie && +c.util.browser.version.split(".")[0] < 10) {
                    if ("streaming" === b.transport)
                        return void (b.enableXDR && window.XDomainRequest ? R(b) : T(b));
                    if (b.enableXDR && window.XDomainRequest)
                        return void R(b)
                }
                var d = function() {
                    b.lastIndex = 0, b.reconnect && vb++ < b.maxReconnectOnClose ? (ob.ffTryingReconnect = !0, v("re-connecting", a.transport, a), O(f, b, a.reconnectInterval)) : F(0, "maxReconnectOnClose reached")
                }, e = function() {
                    ob.errorHandled = !0, n(), d()
                };
                if (b.force || b.reconnect && (-1 === b.maxRequest || b.requestCount++ < b.maxRequest)) {
                    b.force = !1;
                    var f = c.util.xhr();
                    f.hasData = !1, N(f, b, !0), b.suspend && (rb = f), "polling" !== b.transport && (ob.transport = b.transport, f.onabort = function() {
                        ib(!0)
                    }, f.onerror = function() {
                        ob.error = !0, ob.ffTryingReconnect = !0;
                        try {
                            ob.status = XMLHttpRequest.status
                        } catch (a) {
                            ob.status = 500
                        }
                        ob.status || (ob.status = 500), ob.errorHandled || (n(), d())
                    }), f.onreadystatechange = function() {
                        if (!yb) {
                            ob.error = null;
                            var g = !1, h = !1;
                            if ("streaming" === b.transport && b.readyState > 2 && 4 === f.readyState)
                                return n(), void d();
                            if (b.readyState = f.readyState, "streaming" === b.transport && f.readyState >= 3 ? h = !0 : "long-polling" === b.transport && 4 === f.readyState && (h = !0), D(nb), "polling" !== b.transport) {
                                var i = 200;
                                if (4 === f.readyState && (i = f.status > 1e3 ? 0 : f.status), !b.reconnectOnServerError && i >= 300 && 600 > i)
                                    return void F(i, f.statusText);
                                if (i >= 300 || 0 === i)
                                    return void e();
                                b.enableProtocol && a.firstMessage || 2 !== f.readyState || (c.util.browser.mozilla && ob.ffTryingReconnect ? (ob.ffTryingReconnect = !1, setTimeout(function() {
                                    ob.ffTryingReconnect || J(b)
                                }, 500)) : J(b))
                            } else
                                4 === f.readyState && (h = !0);
                            if (h) {
                                var j = f.responseText;
                                if (ob.errorHandled = !1, 0 === c.util.trim(j).length && "long-polling" === b.transport)
                                    return void (f.hasData ? f.hasData = !1 : O(f, b, b.pollingInterval));
                                if (f.hasData = !0, fb(f, nb), "streaming" === b.transport)
                                    if (c.util.browser.opera)
                                        c.util.iterate(function() {
                                            if (500 !== ob.status && f.responseText.length > b.lastIndex) {
                                                try {
                                                    ob.status = f.status, ob.headers = c.util.parseHeaders(f.getAllResponseHeaders()), fb(f, nb)
                                                } catch (a) {
                                                    ob.status = 404
                                                }
                                                D(nb), ob.state = "messageReceived";
                                                var d = f.responseText.substring(b.lastIndex);
                                                if (b.lastIndex = f.responseText.length, g = G(d, b, ob), g || jb(), k(f, b))
                                                    return void M(f, b)
                                            } else if (ob.status > 400)
                                                return b.lastIndex = f.responseText.length, !1
                                        }, 0);
                                else {
                                    var l = j.substring(b.lastIndex, j.length);
                                    if (g = G(l, b, ob), b.lastIndex = j.length, g)
                                        return
                                }
                                else
                                    g = G(j, b, ob);
                                var m = k(f, b);
                                try {
                                    ob.status = f.status, ob.headers = c.util.parseHeaders(f.getAllResponseHeaders()), fb(f, b)
                                } catch (o) {
                                    ob.status = 404
                                }
                                ob.state = b.suspend ? 0 === ob.status ? "closed" : "messageReceived" : "messagePublished";
                                var p = !m && "streaming" !== a.transport && "polling" !== a.transport;
                                p && !b.executeCallbackBeforeReconnect && O(f, b, b.pollingInterval), 0 === ob.responseBody.length || g || jb(), p && b.executeCallbackBeforeReconnect && O(f, b, b.pollingInterval), m && M(f, b)
                            }
                        }
                    };
                    try {
                        f.send(b.data), ub = !0
                    } catch (g) {
                        c.util.log(b.logLevel, ["Unable to connect to " + b.url]), F(0, g)
                    }
                } else
                    "debug" === b.logLevel && c.util.log(b.logLevel, ["Max re-connection reached."]), F(0, "maxRequest reached")
            }
            function M(a, b) {
                ob.messages = [], b.isReopen = !0, m(), yb = !1, O(a, b, 500)
            }
            function N(a, b, d) {
                var e = b.url;
                null != b.dispatchUrl && "POST" === b.method && (e += b.dispatchUrl), e = I(b, e), e = c.util.prepareURL(e), d && (a.open(b.method, e, b.async), b.connectTimeout > 0 && (b.id = setTimeout(function() {
                    0 === b.requestCount && (n(), eb("Connect timeout", "closed", 200, b.transport))
                }, b.connectTimeout))), nb.withCredentials && "websocket" !== nb.transport && "withCredentials" in a && (a.withCredentials = !0), nb.dropHeaders || (a.setRequestHeader("X-Atmosphere-Framework", c.util.version), a.setRequestHeader("X-Atmosphere-Transport", b.transport), null !== b.heartbeat && null !== b.heartbeat.server && a.setRequestHeader("X-Heartbeat-Server", a.heartbeat.server), b.trackMessageLength && a.setRequestHeader("X-Atmosphere-TrackMessageSize", "true"), a.setRequestHeader("X-Atmosphere-tracking-id", b.uuid), c.util.each(b.headers, function(e, f) {
                    var g = c.util.isFunction(f) ? f.call(this, a, b, d, ob) : f;
                    null != g && a.setRequestHeader(e, g)
                })), "" !== b.contentType && a.setRequestHeader("Content-Type", b.contentType)
            }
            function O(a, b, c) {
                if (!ob.closedByClientTimeout && (b.reconnect || b.suspend && ub)) {
                    var d = 0;
                    a && a.readyState > 1 && (d = a.status > 1e3 ? 0 : a.status), ob.status = 0 === d ? 204 : d, ob.reason = 0 === d ? "Server resumed the connection or down." : "OK", clearTimeout(b.id), b.reconnectId && (clearTimeout(b.reconnectId), delete b.reconnectId), c > 0 ? nb.reconnectId = setTimeout(function() {
                        L(b)
                    }, c) : L(b)
                }
            }
            function P(a) {
                a.state = "re-connecting", gb(a)
            }
            function Q(a) {
                a.state = "openAfterResume", gb(a), a.state = "messageReceived"
            }
            function R(a) {
                "polling" !== a.transport ? (sb = S(a), sb.open()) : S(a).open()
            }
            function S(a) {
                var b = nb;
                null != a && "undefined" != typeof a && (b = a);
                var d = b.transport, e = 0, f = new window.XDomainRequest, g = function() {
                    "long-polling" === b.transport && b.reconnect && (-1 === b.maxRequest || b.requestCount++ < b.maxRequest) && (f.status = 200, R(b))
                }, h = b.rewriteURL || function(a) {
                    var b = /(?:^|;\s*)(JSESSIONID|PHPSESSID)=([^;]*)/.exec(document.cookie);
                    switch (b && b[1]) {
                    case "JSESSIONID":
                        return a.replace(/;jsessionid=[^\?]*|(\?)|$/, ";jsessionid=" + b[2] + "$1");
                    case "PHPSESSID":
                        return a.replace(/\?PHPSESSID=[^&]*&?|\?|$/, "?PHPSESSID=" + b[2] + "&").replace(/&$/, "")
                    }
                    return a
                };
                f.onprogress = function() {
                    i(f)
                }, f.onerror = function() {
                    "polling" !== b.transport && (n(), vb++ < b.maxReconnectOnClose ? b.reconnectInterval > 0 ? b.reconnectId = setTimeout(function() {
                        v("re-connecting", a.transport, a), R(b)
                    }, b.reconnectInterval) : (v("re-connecting", a.transport, a), R(b)) : F(0, "maxReconnectOnClose reached"))
                }, f.onload = function() {
                };
                var i = function(a) {
                    clearTimeout(b.id);
                    var f = a.responseText;
                    if (f = f.substring(e), e += f.length, "polling" !== d) {
                        D(b);
                        var h = G(f, b, ob);
                        if ("long-polling" === d && 0 === c.util.trim(f).length)
                            return;
                        b.executeCallbackBeforeReconnect && g(), h || eb(ob.responseBody, "messageReceived", 200, d), b.executeCallbackBeforeReconnect || g()
                    }
                };
                return {open: function() {
                    var a = b.url;
                    null != b.dispatchUrl && (a += b.dispatchUrl), a = I(b, a), f.open(b.method, h(a)), "GET" === b.method ? f.send() : f.send(b.data), b.connectTimeout > 0 && (b.id = setTimeout(function() {
                        0 === b.requestCount && (n(), eb("Connect timeout", "closed", 200, b.transport))
                    }, b.connectTimeout))
                },close: function() {
                    f.abort()
                }}
            }
            function T(a) {
                sb = U(a), sb.open()
            }
            function U(a) {
                var b = nb;
                null != a && "undefined" != typeof a && (b = a);
                var d, e = new window.ActiveXObject("htmlfile");
                e.open(), e.close();
                var f = b.url;
                return null != b.dispatchUrl && (f += b.dispatchUrl), "polling" !== b.transport && (ob.transport = b.transport), {open: function() {
                    var a = e.createElement("iframe");
                    f = I(b), "" !== b.data && (f += "&X-Atmosphere-Post-Body=" + encodeURIComponent(b.data)), f = c.util.prepareURL(f), a.src = f, e.body.appendChild(a);
                    var g = a.contentDocument || a.contentWindow.document;
                    d = c.util.iterate(function() {
                        try {
                            if (!g.firstChild)
                                return;
                            var a = g.body ? g.body.lastChild : g, f = function() {
                                var b = a.cloneNode(!0);
                                b.appendChild(g.createTextNode("."));
                                var c = b.innerText;
                                return c = c.substring(0, c.length - 1)
                            };
                            if (!g.body || !g.body.firstChild || "pre" !== g.body.firstChild.nodeName.toLowerCase()) {
                                var h = g.head || g.getElementsByTagName("head")[0] || g.documentElement || g, i = g.createElement("script");
                                i.text = "document.write('<plaintext>')", h.insertBefore(i, h.firstChild), h.removeChild(i), a = g.body.lastChild
                            }
                            return b.closed && (b.isReopen = !0), d = c.util.iterate(function() {
                                var c = f();
                                if (c.length > b.lastIndex) {
                                    D(nb), ob.status = 200, ob.error = null, a.innerText = "";
                                    var d = G(c, b, ob);
                                    if (d)
                                        return "";
                                    eb(ob.responseBody, "messageReceived", 200, b.transport)
                                }
                                return b.lastIndex = 0, "complete" === g.readyState ? (ib(!0), v("re-connecting", b.transport, b), b.reconnectInterval > 0 ? b.reconnectId = setTimeout(function() {
                                    T(b)
                                }, b.reconnectInterval) : T(b), !1) : void 0
                            }, null), !1
                        } catch (j) {
                            return ob.error = !0, v("re-connecting", b.transport, b), vb++ < b.maxReconnectOnClose ? b.reconnectInterval > 0 ? b.reconnectId = setTimeout(function() {
                                T(b)
                            }, b.reconnectInterval) : T(b) : F(0, "maxReconnectOnClose reached"), e.execCommand("Stop"), e.close(), !1
                        }
                    })
                },close: function() {
                    d && d(), e.execCommand("Stop"), ib(!0)
                }}
            }
            function V(a) {
                null != Ab ? X(a) : null != rb || null != qb ? Z(a) : null != sb ? $(a) : null != tb ? _(a) : null != pb ? cb(a) : (F(0, "No suspended connection available"), c.util.error("No suspended connection available. Make sure atmosphere.subscribe has been called and request.onOpen invoked before invoking this method"))
            }
            function W(a, b) {
                b || (b = bb(a)), b.transport = "polling", b.method = "GET", b.withCredentials = !1, b.reconnect = !1, b.force = !0, b.suspend = !1, b.timeout = 1e3, L(b)
            }
            function X(a) {
                Ab.send(a)
            }
            function Y(a) {
                if (0 !== a.length)
                    try {
                        Ab ? Ab.localSend(a) : kb && kb.signal("localMessage", c.util.stringifyJSON({id: Bb,event: a}))
                    } catch (b) {
                        c.util.error(b)
                    }
            }
            function Z(a) {
                var b = bb(a);
                L(b)
            }
            function $(a) {
                if (nb.enableXDR && c.util.checkCORSSupport()) {
                    var b = bb(a);
                    b.reconnect = !1, w(b)
                } else
                    Z(a)
            }
            function _(a) {
                var b = bb(a);
                b.reconnect = !1, w(b)
            }
            function ab(a) {
                var b = a;
                return "object" == typeof b && (b = a.data), b
            }
            function bb(a) {
                var b = ab(a), d = {connected: !1,timeout: 6e4,method: "POST",url: nb.url,contentType: nb.contentType,headers: nb.headers,reconnect: !0,callback: null,data: b,suspend: !1,maxRequest: -1,logLevel: "info",requestCount: 0,withCredentials: nb.withCredentials,async: nb.async,transport: "polling",isOpen: !0,attachHeadersAsQueryString: !0,enableXDR: nb.enableXDR,uuid: nb.uuid,dispatchUrl: nb.dispatchUrl,enableProtocol: !1,messageDelimiter: "|",trackMessageLength: nb.trackMessageLength,maxReconnectOnClose: nb.maxReconnectOnClose,heartbeatTimer: nb.heartbeatTimer,heartbeat: nb.heartbeat};
                return "object" == typeof a && (d = c.util.extend(d, a)), d
            }
            function cb(a) {
                var b, d = c.util.isBinary(a) ? a : ab(a);
                try {
                    if (b = null != nb.dispatchUrl ? nb.webSocketPathDelimiter + nb.dispatchUrl + nb.webSocketPathDelimiter + d : d, !pb.canSendMessage)
                        return void c.util.error("WebSocket not connected.");
                    pb.send(b)
                } catch (e) {
                    pb.onclose = function() {
                    }, n(), H("Websocket failed. Downgrading to Comet and resending " + a), Z(a)
                }
            }
            function db(a) {
                var b = c.util.parseJSON(a);
                b.id !== Bb && ("undefined" != typeof nb.onLocalMessage ? nb.onLocalMessage(b.event) : "undefined" != typeof c.util.onLocalMessage && c.util.onLocalMessage(b.event))
            }
            function eb(a, b, c, d) {
                ob.responseBody = a, ob.transport = d, ob.status = c, ob.state = b, jb()
            }
            function fb(a, b) {
                if (b.readResponsesHeaders)
                    try {
                        var c = a.getResponseHeader("X-Atmosphere-tracking-id");
                        c && null != c && (b.uuid = c.split(" ").pop())
                    } catch (d) {
                    }
                else
                    b.enableProtocol || (b.uuid = Bb)
            }
            function gb(a) {
                hb(a, nb), hb(a, c.util)
            }
            function hb(a, b) {
                switch (a.state) {
                case "messageReceived":
                    vb = 0, "undefined" != typeof b.onMessage && b.onMessage(a), "undefined" != typeof b.onmessage && b.onmessage(a);
                    break;
                case "error":
                    "undefined" != typeof b.onError && b.onError(a), "undefined" != typeof b.onerror && b.onerror(a);
                    break;
                case "opening":
                    delete nb.closed, "undefined" != typeof b.onOpen && b.onOpen(a), "undefined" != typeof b.onopen && b.onopen(a);
                    break;
                case "messagePublished":
                    "undefined" != typeof b.onMessagePublished && b.onMessagePublished(a);
                    break;
                case "re-connecting":
                    "undefined" != typeof b.onReconnect && b.onReconnect(nb, a);
                    break;
                case "closedByClient":
                    "undefined" != typeof b.onClientTimeout && b.onClientTimeout(nb);
                    break;
                case "re-opening":
                    delete nb.closed, "undefined" != typeof b.onReopen && b.onReopen(nb, a);
                    break;
                case "fail-to-reconnect":
                    "undefined" != typeof b.onFailureToReconnect && b.onFailureToReconnect(nb, a);
                    break;
                case "unsubscribe":
                case "closed":
                    var c = "undefined" != typeof nb.closed ? nb.closed : !1;
                    c || ("undefined" != typeof b.onClose && b.onClose(a), "undefined" != typeof b.onclose && b.onclose(a)), nb.closed = !0;
                    break;
                case "openAfterResume":
                    "undefined" != typeof b.onOpenAfterResume && b.onOpenAfterResume(nb)
                }
            }
            function ib(a) {
                "closed" !== ob.state && (ob.state = "closed", ob.responseBody = "", ob.messages = [], ob.status = a ? 200 : 501, jb())
            }
            function jb() {
                var a = function(a, b) {
                    b(ob)
                };
                null == Ab && null != zb && zb(ob.responseBody), nb.reconnect = nb.mrequest;
                for (var b = "string" == typeof ob.responseBody, d = b && nb.trackMessageLength ? ob.messages.length > 0 ? ob.messages : [""] : new Array(ob.responseBody), e = 0; e < d.length; e++)
                    if (!(d.length > 1 && 0 === d[e].length || (ob.responseBody = b ? c.util.trim(d[e]) : d[e], null == Ab && null != zb && zb(ob.responseBody), (0 === ob.responseBody.length || b && xb === ob.responseBody) && "messageReceived" === ob.state))) {
                        if (gb(ob), f.length > 0) {
                            j("debug") && c.util.debug("Invoking " + f.length + " global callbacks: " + ob.state);
                            try {
                                c.util.each(f, a)
                                    } catch (g) {
                                        c.util.log(nb.logLevel, ["Callback exception" + g])
                                    }
                        }
                        if ("function" == typeof nb.callback) {
                            j("debug") && c.util.debug("Invoking request callbacks");
                            try {
                                nb.callback(ob)
                            } catch (g) {
                                c.util.log(nb.logLevel, ["Callback exception" + g])
                            }
                        }
                    }
            }
            var kb, lb, mb, nb = {timeout: 3e5,method: "GET",headers: {},contentType: "",callback: null,url: "",data: "",suspend: !0,maxRequest: -1,reconnect: !0,maxStreamingLength: 1e7,lastIndex: 0,logLevel: "info",requestCount: 0,fallbackMethod: "GET",fallbackTransport: "streaming",transport: "long-polling",webSocketImpl: null,webSocketBinaryType: null,dispatchUrl: null,webSocketPathDelimiter: "@@",enableXDR: !1,rewriteURL: !1,attachHeadersAsQueryString: !0,executeCallbackBeforeReconnect: !1,readyState: 0,withCredentials: !1,trackMessageLength: !1,messageDelimiter: "|",connectTimeout: -1,reconnectInterval: 0,dropHeaders: !0,uuid: 0,async: !0,shared: !1,readResponsesHeaders: !1,maxReconnectOnClose: 5,enableProtocol: !0,pollingInterval: 0,heartbeat: {client: null,server: null},ackInterval: 0,closeAsync: !1,reconnectOnServerError: !0,environment: "production",onError: function() {
            },onClose: function() {
            },onOpen: function() {
            },onMessage: function() {
            },onReopen: function() {
            },onReconnect: function() {
            },onMessagePublished: function() {
            },onTransportFailure: function() {
            },onLocalMessage: function() {
            },onFailureToReconnect: function() {
            },onClientTimeout: function() {
            },onOpenAfterResume: function() {
            }}, ob = {status: 200,reasonPhrase: "OK",responseBody: "",messages: [],headers: [],state: "messageReceived",transport: "polling",error: null,request: null,partialMessage: "",errorHandled: !1,closedByClientTimeout: !1,ffTryingReconnect: !1}, pb = null, qb = null, rb = null, sb = null, tb = null, ub = !0, vb = 0, wb = 0, xb = " ", yb = !1, zb = null, Ab = null, Bb = c.util.random();
            p(a), this.subscribe = function(a) {
                p(a), s()
            }, this.execute = function() {
                s()
            }, this.close = function() {
                m()
            }, this.disconnect = function() {
                l()
            }, this.getUrl = function() {
                return nb.url
            }, this.push = function(a, b) {
                if (null != b) {
                    var c = nb.dispatchUrl;
                    nb.dispatchUrl = b, V(a), nb.dispatchUrl = c
                } else
                    V(a)
            }, this.getUUID = function() {
                return nb.uuid
            }, this.pushLocal = function(a) {
                Y(a)
            }, this.enableProtocol = function() {
                return nb.enableProtocol
            }, this.init = function() {
                e()
            }, this.request = nb, this.response = ob
        }}, c.subscribe = function(a, b, d) {
            "function" == typeof b && c.addCallback(b), "string" != typeof a ? d = a : d.url = a, g = "undefined" != typeof d && "undefined" != typeof d.uuid ? d.uuid : 0;
            var f = new c.AtmosphereRequest(d);
            return f.execute(), e[e.length] = f, f
        }, c.unsubscribe = function() {
            if (e.length > 0)
                for (var a = [].concat(e), b = 0; b < a.length; b++) {
                    var c = a[b];
                    c.request.isOpen && c.close(), c.response && c.response.request && clearTimeout(c.response.request.id), c.heartbeatTimer && clearTimeout(c.heartbeatTimer)
                }
            e = [], f = []
        }, c.unsubscribeUrl = function(a) {
            var b = -1;
            if (e.length > 0)
                for (var c = 0; c < e.length; c++) {
                    var d = e[c];
                    if (d.getUrl() === a) {
                        d.close(), clearTimeout(d.response.request.id), d.heartbeatTimer && clearTimeout(d.heartbeatTimer), b = c;
                        break
                    }
                }
            b >= 0 && e.splice(b, 1)
        }, c.addCallback = function(a) {
                -1 === c.util.inArray(a, f) && f.push(a)
        }, c.removeCallback = function(a) {
            var b = c.util.inArray(a, f);
                -1 !== b && f.splice(b, 1)
        }, c.util = {browser: {},parseHeaders: function(a) {
            for (var b, c = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, d = {}; b = c.exec(a); )
                d[b[1]] = b[2];
            return d
        },now: function() {
            return (new Date).getTime()
        },random: function() {
            return Math.floor(1e8 + 9e8 * Math.random())
        },isArray: function(a) {
            return "[object Array]" === Object.prototype.toString.call(a)
        },inArray: function(a, b) {
            if (!Array.prototype.indexOf) {
                for (var c = b.length, d = 0; c > d; ++d)
                    if (b[d] === a)
                        return d;
                return -1
            }
            return b.indexOf(a)
        },isBinary: function(a) {
            return /^\[object\s(?:Blob|ArrayBuffer|.+Array)\]$/.test(Object.prototype.toString.call(a))
        },isFunction: function(a) {
            return "[object Function]" === Object.prototype.toString.call(a)
        },getAbsoluteURL: function(a) {
            var b = document.createElement("div");
            return b.innerHTML = '<a href="' + a + '"/>', encodeURI(decodeURI(b.firstChild.href))
        },prepareURL: function(a) {
            var b = c.util.now(), d = a.replace(/([?&])_=[^&]*/, "$1_=" + b);
            return d + (d === a ? (/\?/.test(a) ? "&" : "?") + "_=" + b : "")
        },trim: function(a) {
            return String.prototype.trim ? a.toString().trim() : a.toString().replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, "").replace(/\s+/g, " ")
        },param: function(a) {
            function b(a, b) {
                b = c.util.isFunction(b) ? b() : null == b ? "" : b, f.push(encodeURIComponent(a) + "=" + encodeURIComponent(b))
            }
            function d(a, e) {
                var f;
                if (c.util.isArray(e))
                    c.util.each(e, function(c, e) {
                            /\[\]$/.test(a) ? b(a, e) : d(a + "[" + ("object" == typeof e ? c : "") + "]", e)
                    });
                else if ("[object Object]" === Object.prototype.toString.call(e))
                    for (f in e)
                        d(a + "[" + f + "]", e[f]);
                else
                    b(a, e)
            }
            var e, f = [];
            for (e in a)
                d(e, a[e]);
            return f.join("&").replace(/%20/g, "+")
        },storage: function() {
            try {
                return !(!window.localStorage || !window.StorageEvent)
            } catch (a) {
                return !1
            }
        },iterate: function(a, b) {
            var c;
            return b = b || 0, function d() {
                c = setTimeout(function() {
                    a() !== !1 && d()
                }, b)
            }(), function() {
                clearTimeout(c)
            }
        },each: function(a, b, d) {
            if (a) {
                var e, f = 0, g = a.length, h = c.util.isArray(a);
                if (d) {
                    if (h)
                        for (; g > f && (e = b.apply(a[f], d), e !== !1); f++)
                            ;
                    else
                        for (f in a)
                            if (e = b.apply(a[f], d), e === !1)
                                break
                } else if (h)
                    for (; g > f && (e = b.call(a[f], f, a[f]), e !== !1); f++)
                        ;
                else
                    for (f in a)
                        if (e = b.call(a[f], f, a[f]), e === !1)
                            break;
                return a
            }
        },extend: function(a) {
            var b, c, d;
            for (b = 1; b < arguments.length; b++)
                if (null != (c = arguments[b]))
                    for (d in c)
                        a[d] = c[d];
            return a
        },on: function(a, b, c) {
            a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent && a.attachEvent("on" + b, c)
        },off: function(a, b, c) {
            a.removeEventListener ? a.removeEventListener(b, c, !1) : a.detachEvent && a.detachEvent("on" + b, c)
        },log: function(a, b) {
            if (window.console) {
                var c = window.console[a];
                "function" == typeof c && "production" !== h && c.apply(window.console, b)
            }
        },warn: function() {
            c.util.log("warn", arguments)
        },info: function() {
            c.util.log("info", arguments)
        },debug: function() {
            c.util.log("debug", arguments)
        },error: function() {
            c.util.log("error", arguments)
        },xhr: function() {
            try {
                return new window.XMLHttpRequest
            } catch (a) {
                try {
                    return new window.ActiveXObject("Microsoft.XMLHTTP")
                } catch (b) {
                }
            }
        },parseJSON: function(a) {
            return a ? window.JSON && window.JSON.parse ? window.JSON.parse(a) : new Function("return " + a)() : null
        },stringifyJSON: function(a) {
            function b(a) {
                return '"' + a.replace(d, function(a) {
                    var b = e[a];
                    return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                }) + '"'
            }
            function c(a) {
                return 10 > a ? "0" + a : a
            }
            var d = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, e = {"\b": "\\b","	": "\\t","\n": "\\n","\f": "\\f","\r": "\\r",'"': '\\"',"\\": "\\\\"};
            return window.JSON && window.JSON.stringify ? window.JSON.stringify(a) : function f(a, d) {
                var e, g, h, j, k = d[a], l = typeof k;
                switch (k && "object" == typeof k && "function" == typeof k.toJSON && (k = k.toJSON(a), l = typeof k), l) {
                case "string":
                    return b(k);
                case "number":
                    return isFinite(k) ? String(k) : "null";
                case "boolean":
                    return String(k);
                case "object":
                    if (!k)
                        return "null";
                    switch (Object.prototype.toString.call(k)) {
                    case "[object Date]":
                        return isFinite(k.valueOf()) ? '"' + k.getUTCFullYear() + "-" + c(k.getUTCMonth() + 1) + "-" + c(k.getUTCDate()) + "T" + c(k.getUTCHours()) + ":" + c(k.getUTCMinutes()) + ":" + c(k.getUTCSeconds()) + 'Z"' : "null";
                    case "[object Array]":
                        for (h = k.length, j = [], e = 0; h > e; e++)
                            j.push(f(e, k) || "null");
                        return "[" + j.join(",") + "]";
                    default:
                        j = [];
                        for (e in k)
                            i.call(k, e) && (g = f(e, k), g && j.push(b(e) + ":" + g));
                        return "{" + j.join(",") + "}"
                    }
                }
            }("", {"": a})
        },checkCORSSupport: function() {
            if (c.util.browser.msie && !window.XDomainRequest && +c.util.browser.version.split(".")[0] < 11)
                return !0;
            if (c.util.browser.opera && +c.util.browser.version.split(".") < 12)
                return !0;
            if ("KreaTVWebKit/531" === c.util.trim(navigator.userAgent).slice(0, 16))
                return !0;
            if ("kreatel" === c.util.trim(navigator.userAgent).slice(-7).toLowerCase())
                return !0;
            var a = navigator.userAgent.toLowerCase(), b = a.indexOf("android") > -1;
            return b ? !0 : !1
        }}, a = c.util.random(), function() {
            var a = navigator.userAgent.toLowerCase(), b = /(chrome)[ \/]([\w.]+)/.exec(a) || /(webkit)[ \/]([\w.]+)/.exec(a) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a) || /(msie) ([\w.]+)/.exec(a) || /(trident)(?:.*? rv:([\w.]+)|)/.exec(a) || a.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a) || [];
            c.util.browser[b[1] || ""] = !0, c.util.browser.version = b[2] || "0", c.util.browser.trident && (c.util.browser.msie = !0), (c.util.browser.msie || c.util.browser.mozilla && 1 === +c.util.browser.version.split(".")[0]) && (c.util.storage = !1)
        }(), c.util.on(window, "unload", function() {
            c.unsubscribe()
        }), c
    }), function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("interblocks", ["underscore"], b) : a.Interblocks = b(a._)
    }(this, function(a) {
        "use strict";
        var b = {blockRenderers: {videoReply: function(a) {
            var b = '<video controls class="intercom-interblocks-video-reply"><source src="' + a.url + '"><p><a href="' + a.url + '">' + a.text + "</a></p></video>";
            return b
        },paragraph: function(a) {
            a.cssClass = b.getBlockClass(a);
            var c = "<p";
            return a.cssClass.length && (c += ' class="' + a.cssClass + '"'), c += ">" + a.text + "</p>"
        },code: function(a) {
            var b = "<pre><code>" + a.text + "</code></pre>";
            return b
        },orderedList: function(b) {
            var c = "<ol>";
            return a.each(b.items, function(a) {
                c += "<li>" + a + "</li>"
            }), c += "</ol>"
        },unorderedList: function(b) {
            var c = "<ul>";
            return a.each(b.items, function(a) {
                c += "<li>" + a + "</li>"
            }), c += "</ul>"
        },heading: function(a) {
            a.cssClass = b.getBlockClass(a);
            var c = "<h1";
            return a.cssClass.length && (c += ' class="' + a.cssClass + '"'), c += ">" + a.text + "</h1>"
        },subheading: function(a) {
            a.cssClass = b.getBlockClass(a);
            var c = "<h2";
            return a.cssClass.length && (c += ' class="' + a.cssClass + '"'), c += ">" + a.text + "</h2>"
        },image: function(c) {
            c.cssClass = b.getBlockClass(c);
            var d = "<div";
            return c.cssClass.length && (d += ' class="intercom-container ' + c.cssClass + '"'), a.isUndefined(c.linkUrl) || (d += '><a target="_blank" href="' + c.linkUrl + '" rel="nofollow"'), d += '><img src="' + c.url + '">', a.isUndefined(c.linkUrl) || (d += "</a>"), d += "</div>"
        },button: function(a) {
            a.cssClass = b.getBlockClass(a);
            var c = '<div class="intercom-container ';
            return a.cssClass.length && (c += a.cssClass), c += '"><a target="_blank" href="' + a.linkUrl + '" class="intercom-h2b-button" rel="nofollow">' + a.text + "</a></div>"
        },facebookLikeButton: function(a) {
            var b = '<iframe src="//www.facebook.com/plugins/like.php?href=' + a.url + '&amp;width&amp;layout=standard&amp;action=like&amp;share=true&amp;height=28&amp;%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20+++appId=487224624685065"scrolling="no" frameborder="0" style="border:none; overflow:hidden; height:28px;" allowtransparency="true"></iframe>';
            return b
        },twitterFollowButton: function(a) {
            var b = '<iframe class="allowed_iframe_embed" allowtransparency="true" frameborder="0" scrolling="no" src="https://platform.twitter.com/widgets/follow_button.html?show_count=false&amp;screen_name=' + a.username + '" style="width:300px; height:20px;"></iframe>';
            return b
        },video: function(a) {
            switch (a.provider) {
            case "wistia":
                a.src = "https://fast.wistia.net/embed/iframe/" + a.id;
                break;
            case "youtube":
                a.src = "https://www.youtube.com/embed/" + a.id;
                break;
            case "vimeo":
                a.src = "https://player.vimeo.com/video/" + a.id;
                break;
            default:
                a.src = ""
            }
            var b = '<div class="intercom-h2b-video"><iframe src="' + a.src + '" frameborder="0" style="" class="allowed_iframe_embed" allowtransparency="true"></iframe></div>';
            return b
        },attachmentList: function() {
            return ""
        },html: function(a) {
            return a.content
        }},getBlockClass: function(b) {
            var c = "";
            return a.isUndefined(b.align) || (c += "intercom-align-" + b.align + " "), a.isUndefined(b["class"]) || (c += b["class"]), c
        },supportsBlockRendering: function(b) {
            var c = a.keys(this.blockRenderers), d = a.chain(b).pluck("type").uniq().value();
            return a.all(d, function(b) {
                return a.contains(c, b)
            })
        },renderBlocks: function(c) {
            if (!b.supportsBlockRendering(c))
                throw new Error("Intercom.Interblocks: Unsupported blockList: " + JSON.stringify(c));
            var d = a.map(c, function(a) {
                return b.blockRenderers[a.type](a)
            });
            return a.reduce(d, function(a, b) {
                return a + b
            }, "")
        }};
        return b
    }), function(a, b) {
        "use strict";
        "function" == typeof define && define.amd ? define("intermoji", ["underscore"], function(c) {
            return b(a, c)
        }) : a.INTERMOJI = b(a, a._)
    }(this, function(a, b) {
        "use strict";
        var c = function(a) {
            for (var b, c, d, e, f = [], g = 0, h = a.length; h > g; )
                d = a.charAt(g), b = a.charCodeAt(g++), b >= 55296 && 56319 >= b && h > g ? (e = a.charAt(g), c = a.charCodeAt(g++), 56320 == (64512 & c) ? f.push([d + e, ((1023 & b) << 10) + (1023 & c) + 65536]) : (f.push([d, b]), g--)) : f.push([d, b]);
            return f
        }, d = "__ic_", e = [[["😄", "smile", 23, 23], ["😃", "smiley", 22, 23], ["😀", "grinning", 19, 23], ["😊", "blush", 24, 5], ["☺", "relaxed", 27, 24], ["😉", "wink", 24, 4], ["😍", "heart_eyes", 24, 8], ["😘", "kissing_heart", 24, 19], ["😚", "kissing_closed_eyes", 24, 21], ["😜", "stuck_out_tongue_winking_eye", 24, 23], ["😝", "stuck_out_tongue_closed_eyes", 0, 24], ["😛", "stuck_out_tongue", 24, 22], ["😳", "flushed", 22, 24], ["😁", "grin", 20, 23], ["😔", "pensive", 24, 15], ["😌", "relieved", 24, 7], ["😒", "unamused", 24, 13], ["😞", "disappointed", 1, 24], ["😣", "persevere", 6, 24], ["😢", "cry", 5, 24], ["😂", "joy", 21, 23], ["😭", "sob", 16, 24], ["😪", "sleepy", 13, 24], ["😥", "disappointed_relieved", 8, 24], ["😰", "cold_sweat", 19, 24], ["😅", "sweat_smile", 24, 0], ["😓", "sweat", 24, 14], ["😩", "weary", 12, 24], ["😫", "tired_face", 14, 24], ["😨", "fearful", 11, 24], ["😱", "scream", 20, 24], ["😠", "angry", 3, 24], ["😡", "rage", 4, 24], ["😤", "triumph", 7, 24], ["😖", "confounded", 24, 17], ["😆", "laughing", 24, 1], ["😋", "yum", 24, 6], ["😷", "mask", 25, 1], ["😎", "sunglasses", 24, 9], ["😵", "dizzy_face", 24, 24], ["😲", "astonished", 21, 24], ["👿", "imp", 13, 18], ["😮", "open_mouth", 17, 24], ["😐", "neutral_face", 24, 11], ["😕", "confused", 24, 16], ["😏", "smirk", 24, 10], ["👲", "man_with_gua_pi_mao", 0, 18], ["👳", "man_with_turban", 1, 18], ["👮", "cop", 18, 14], ["👷", "construction_worker", 5, 18], ["💂", "guardsman", 16, 18], ["👶", "baby", 4, 18], ["👦", "boy", 18, 6], ["👧", "girl", 18, 7], ["👨", "man", 18, 8], ["👩", "woman", 18, 9], ["👴", "older_man", 2, 18], ["👵", "older_woman", 3, 18], ["👱", "person_with_blond_hair", 18, 17], ["👼", "angel", 10, 18], ["👸", "princess", 6, 18], ["😺", "smiley_cat", 25, 4], ["😸", "smile_cat", 25, 2], ["😻", "heart_eyes_cat", 25, 5], ["😽", "kissing_cat", 25, 7], ["😼", "smirk_cat", 25, 6], ["🙀", "scream_cat", 25, 10], ["😿", "crying_cat_face", 25, 9], ["😹", "joy_cat", 25, 3], ["😾", "pouting_cat", 25, 8], ["👹", "japanese_ogre", 7, 18], ["👺", "japanese_goblin", 8, 18], ["🙈", "see_no_evil", 25, 14], ["🙉", "hear_no_evil", 25, 15], ["🙊", "speak_no_evil", 25, 16], ["💀", "skull", 14, 18], ["👽", "alien", 11, 18], ["💩", "hankey", 17, 19], ["🔥", "fire", 11, 22], ["✨", "sparkles", 28, 17], ["🌟", "star2", 1, 8], ["💫", "dizzy", 19, 19], ["💥", "boom", 13, 19], ["💢", "anger", 10, 19], ["💦", "sweat_drops", 14, 19], ["💧", "droplet", 15, 19], ["💤", "zzz", 12, 19], ["💨", "dash", 16, 19], ["👂", "ear", 17, 5], ["👀", "eyes", 17, 4], ["👃", "nose", 17, 6], ["👅", "tongue", 17, 8], ["👄", "lips", 17, 7], ["👍", "thumbs_up", 17, 16], ["👎", "-1", 0, 17], ["👌", "ok_hand", 17, 15], ["👊", "facepunch", 17, 13], ["✊", "fist", 28, 10], ["✌", "v", 28, 12], ["👋", "wave", 17, 14], ["✋", "hand", 28, 11], ["👐", "open_hands", 2, 17], ["👆", "point_up_2", 17, 9], ["👇", "point_down", 17, 10], ["👉", "point_right", 17, 12], ["👈", "point_left", 17, 11], ["🙌", "raised_hands", 25, 18], ["🙏", "pray", 25, 21], ["☝", "point_up", 27, 23], ["👏", "clap", 1, 17], ["💪", "muscle", 18, 19], ["🚶", "walking", 26, 25], ["🏃", "runner", 14, 10], ["💃", "dancer", 17, 18], ["👫", "couple", 18, 11], ["👪", "family", 18, 10], ["💏", "couplekiss", 19, 10], ["💑", "couple_with_heart", 19, 12], ["👯", "dancers", 18, 15], ["🙆", "ok_woman", 25, 12], ["🙅", "no_good", 25, 11], ["💁", "information_desk_person", 15, 18], ["🙋", "raising_hand", 25, 17], ["💆", "massage", 19, 1], ["💇", "haircut", 19, 2], ["💅", "nail_care", 19, 0], ["👰", "bride_with_veil", 18, 16], ["🙎", "person_with_pouting_face", 25, 20], ["🙍", "person_frowning", 25, 19], ["🙇", "bow", 25, 13], ["🎩", "tophat", 13, 11], ["👑", "crown", 3, 17], ["👒", "womans_hat", 4, 17], ["👟", "athletic_shoe", 17, 17], ["👞", "mans_shoe", 16, 17], ["👡", "sandal", 18, 1], ["👠", "high_heel", 18, 0], ["👢", "boot", 18, 2], ["👕", "shirt", 7, 17], ["👔", "necktie", 6, 17], ["👚", "womans_clothes", 12, 17], ["👗", "dress", 9, 17], ["🎽", "running_shirt_with_sash", 14, 4], ["👖", "jeans", 8, 17], ["👘", "kimono", 10, 17], ["👙", "bikini", 11, 17], ["💼", "briefcase", 20, 16], ["👜", "handbag", 14, 17], ["👝", "pouch", 15, 17], ["👛", "purse", 13, 17], ["👓", "eyeglasses", 5, 17], ["🎀", "ribbon", 12, 7], ["🌂", "closed_umbrella", 2, 6], ["💄", "lipstick", 18, 18], ["💛", "yellow_heart", 3, 19], ["💙", "blue_heart", 1, 19], ["💜", "purple_heart", 4, 19], ["💚", "green_heart", 2, 19], ["❤", "heart", 0, 28], ["💔", "broken_heart", 19, 15], ["💗", "heartpulse", 19, 18], ["💓", "heartbeat", 19, 14], ["💕", "two_hearts", 19, 16], ["💖", "sparkling_heart", 19, 17], ["💞", "revolving_hearts", 6, 19], ["💘", "cupid", 0, 19], ["💌", "love_letter", 19, 7], ["💋", "kiss", 19, 6], ["💍", "ring", 19, 8], ["💎", "gem", 19, 9], ["👤", "bust_in_silhouette", 18, 4], ["💬", "speech_balloon", 20, 0], ["👣", "footprints", 18, 3]], [["🐶", "dog", 12, 16], ["🐺", "wolf", 16, 16], ["🐱", "cat", 7, 16], ["🐭", "mouse", 3, 16], ["🐹", "hamster", 15, 16], ["🐰", "rabbit", 6, 16], ["🐸", "frog", 14, 16], ["🐯", "tiger", 5, 16], ["🐨", "koala", 16, 14], ["🐻", "bear", 17, 0], ["🐷", "pig", 13, 16], ["🐽", "pig_nose", 17, 2], ["🐮", "cow", 4, 16], ["🐗", "boar", 13, 15], ["🐵", "monkey_face", 11, 16], ["🐒", "monkey", 8, 15], ["🐴", "horse", 10, 16], ["🐑", "sheep", 7, 15], ["🐘", "elephant", 14, 15], ["🐼", "panda_face", 17, 1], ["🐧", "penguin", 16, 13], ["🐦", "bird", 16, 12], ["🐤", "baby_chick", 16, 10], ["🐥", "hatched_chick", 16, 11], ["🐣", "hatching_chick", 16, 9], ["🐔", "chicken", 10, 15], ["🐍", "snake", 3, 15], ["🐢", "turtle", 16, 8], ["🐛", "bug", 16, 1], ["🐝", "bee", 16, 3], ["🐜", "ant", 16, 2], ["🐞", "beetle", 16, 4], ["🐌", "snail", 2, 15], ["🐙", "octopus", 15, 15], ["🐚", "shell", 16, 0], ["🐠", "tropical_fish", 16, 6], ["🐟", "fish", 16, 5], ["🐬", "dolphin", 2, 16], ["🐳", "whale", 9, 16], ["🐎", "racehorse", 4, 15], ["🐲", "dragon_face", 8, 16], ["🐡", "blowfish", 16, 7], ["🐫", "camel", 1, 16], ["🐩", "poodle", 16, 15], ["🐾", "feet", 17, 3], ["💐", "bouquet", 19, 11], ["🌸", "cherry_blossom", 9, 1], ["🌷", "tulip", 9, 0], ["🍀", "four_leaf_clover", 0, 9], ["🌹", "rose", 9, 2], ["🌻", "sunflower", 9, 4], ["🌺", "hibiscus", 9, 3], ["🍁", "maple_leaf", 1, 9], ["🍃", "leaves", 3, 9], ["🍂", "fallen_leaf", 2, 9], ["🌿", "herb", 9, 8], ["🌾", "ear_of_rice", 9, 7], ["🍄", "mushroom", 4, 9], ["🌵", "cactus", 8, 8], ["🌴", "palm_tree", 7, 8], ["🌰", "chestnut", 3, 8], ["🌱", "seedling", 4, 8], ["🌼", "blossom", 9, 5], ["🌑", "new_moon", 3, 7], ["🌓", "first_quarter_moon", 5, 7], ["🌔", "moon", 6, 7], ["🌕", "full_moon", 7, 7], ["🌛", "first_quarter_moon_with_face", 8, 5], ["🌙", "crescent_moon", 8, 3], ["🌏", "earth_asia", 1, 7], ["🌋", "volcano", 7, 4], ["🌌", "milky_way", 7, 5], ["🌠", "stars", 2, 8], ["⭐", "star", 14, 28], ["☀", "sunny", 27, 17], ["⛅", "partly_sunny", 25, 27], ["☁", "cloud", 27, 18], ["⚡", "zap", 19, 27], ["☔", "umbrella", 27, 21], ["❄", "snowflake", 28, 20], ["⛄", "snowman", 24, 27], ["🌀", "cyclone", 0, 6], ["🌁", "foggy", 1, 6], ["🌈", "rainbow", 7, 1], ["🌊", "ocean", 7, 3]], [["🎍", "bamboo", 8, 12], ["💝", "gift_heart", 5, 19], ["🎎", "dolls", 9, 12], ["🎒", "school_satchel", 13, 0], ["🎓", "mortar_board", 13, 1], ["🎏", "flags", 10, 12], ["🎆", "fireworks", 1, 12], ["🎇", "sparkler", 2, 12], ["🎐", "wind_chime", 11, 12], ["🎑", "rice_scene", 12, 12], ["🎃", "jack_o_lantern", 12, 10], ["👻", "ghost", 9, 18], ["🎅", "santa", 0, 12], ["🎄", "christmas_tree", 12, 11], ["🎁", "gift", 12, 8], ["🎋", "tanabata_tree", 6, 12], ["🎉", "tada", 4, 12], ["🎊", "confetti_ball", 5, 12], ["🎈", "balloon", 3, 12], ["🎌", "crossed_flags", 7, 12], ["🔮", "crystal_ball", 20, 22], ["🎥", "movie_camera", 13, 7], ["📷", "camera", 13, 21], ["📹", "video_camera", 14, 21], ["📼", "vhs", 17, 21], ["💿", "cd", 20, 19], ["📀", "dvd", 0, 20], ["💽", "minidisc", 0, 0], ["💾", "floppy_disk", 20, 18], ["💻", "computer", 20, 15], ["📱", "iphone", 7, 21], ["☎", "phone", 27, 19], ["📞", "telephone_receiver", 21, 9], ["📟", "pager", 21, 10], ["📠", "fax", 21, 11], ["📡", "satellite", 21, 12], ["📺", "tv", 15, 21], ["📻", "radio", 16, 21], ["🔊", "loud_sound", 22, 6], ["🔔", "bell", 22, 16], ["📢", "loudspeaker", 21, 13], ["📣", "mega", 21, 14], ["⏳", "hourglass_flowing_sand", 27, 7], ["⌛", "hourglass", 27, 1], ["⏰", "alarm_clock", 27, 6], ["⌚", "watch", 27, 0], ["🔓", "unlock", 22, 15], ["🔒", "lock", 22, 14], ["🔏", "lock_with_ink_pen", 22, 11], ["🔐", "closed_lock_with_key", 22, 12], ["🔑", "key", 22, 13], ["🔎", "mag_right", 22, 10], ["💡", "bulb", 9, 19], ["🔦", "flashlight", 12, 22], ["🔌", "electric_plug", 22, 8], ["🔋", "battery", 22, 7], ["🔍", "mag", 22, 9], ["🛀", "bath", 9, 26], ["🚽", "toilet", 6, 26], ["🔧", "wrench", 13, 22], ["🔩", "nut_and_bolt", 15, 22], ["🔨", "hammer", 14, 22], ["🚪", "door", 26, 13], ["🚬", "smoking", 26, 15], ["💣", "bomb", 11, 19], ["🔫", "gun", 17, 22], ["🔪", "hocho", 16, 22], ["💊", "pill", 19, 5], ["💉", "syringe", 19, 4], ["💰", "moneybag", 20, 4], ["💴", "yen", 20, 8], ["💵", "dollar", 20, 9], ["💳", "credit_card", 20, 7], ["💸", "money_with_wings", 20, 12], ["📲", "calling", 8, 21], ["📧", "e-mail", 21, 18], ["📥", "inbox_tray", 21, 16], ["📤", "outbox_tray", 21, 15], ["✉", "email", 28, 9], ["📩", "envelope_with_arrow", 21, 20], ["📨", "incoming_envelope", 21, 19], ["📫", "mailbox", 1, 21], ["📪", "mailbox_closed", 0, 21], ["📮", "postbox", 4, 21], ["📦", "package", 21, 17], ["📝", "memo", 21, 8], ["📄", "page_facing_up", 4, 20], ["📃", "page_with_curl", 3, 20], ["📑", "bookmark_tabs", 17, 20], ["📊", "bar_chart", 10, 20], ["📈", "chart_with_upwards_trend", 8, 20], ["📉", "chart_with_downwards_trend", 9, 20], ["📜", "scroll", 21, 7], ["📋", "clipboard", 11, 20], ["📅", "date", 5, 20], ["📆", "calendar", 6, 20], ["📇", "card_index", 7, 20], ["📁", "file_folder", 1, 20], ["📂", "open_file_folder", 2, 20], ["✂", "scissors", 28, 6], ["📌", "pushpin", 12, 20], ["📎", "paperclip", 14, 20], ["✒", "black_nib", 28, 14], ["✏", "pencil2", 28, 13], ["📏", "straight_ruler", 15, 20], ["📐", "triangular_ruler", 16, 20], ["📕", "closed_book", 21, 0], ["📗", "green_book", 21, 2], ["📘", "blue_book", 21, 3], ["📙", "orange_book", 21, 4], ["📓", "notebook", 19, 20], ["📔", "notebook_with_decorative_cover", 20, 20], ["📒", "ledger", 18, 20], ["📚", "books", 21, 5], ["📖", "book", 21, 1], ["🔖", "bookmark", 22, 18], ["📛", "name_badge", 21, 6], ["📰", "newspaper", 6, 21], ["🎨", "art", 13, 10], ["🎬", "clapper", 1, 13], ["🎤", "microphone", 13, 6], ["🎧", "headphones", 13, 9], ["🎼", "musical_score", 14, 3], ["🎵", "musical_note", 10, 13], ["🎶", "notes", 11, 13], ["🎹", "musical_keyboard", 14, 0], ["🎻", "violin", 14, 2], ["🎺", "trumpet", 14, 1], ["🎷", "saxophone", 12, 13], ["🎸", "guitar", 13, 13], ["👾", "space_invader", 12, 18], ["🎮", "video_game", 3, 13], ["🃏", "black_joker", 20, 17], ["🎴", "flower_playing_cards", 9, 13], ["🀄", "mahjong", 1, 0], ["🎲", "game_die", 7, 13], ["🎯", "dart", 4, 13], ["🏈", "football", 0, 14], ["🏀", "basketball", 14, 7], ["⚽", "soccer", 22, 27], ["⚾", "baseball", 23, 27], ["🎾", "tennis", 14, 5], ["🎱", "8ball", 6, 13], ["🎳", "bowling", 8, 13], ["⛳", "golf", 28, 2], ["🏁", "checkered_flag", 14, 8], ["🏆", "trophy", 14, 12], ["🎿", "ski", 14, 6], ["🏂", "snowboarder", 14, 9], ["🏊", "swimmer", 2, 14], ["🏄", "surfer", 14, 11], ["🎣", "fishing_pole_and_fish", 13, 5], ["☕", "coffee", 27, 22], ["🍵", "tea", 11, 11], ["🍶", "sake", 12, 0], ["🍺", "beer", 12, 4], ["🍻", "beers", 12, 5], ["🍸", "cocktail", 12, 2], ["🍹", "tropical_drink", 12, 3], ["🍷", "wine_glass", 12, 1], ["🍴", "fork_and_knife", 10, 11], ["🍕", "pizza", 1, 10], ["🍔", "hamburger", 0, 10], ["🍟", "fries", 11, 0], ["🍗", "poultry_leg", 3, 10], ["🍖", "meat_on_bone", 2, 10], ["🍝", "spaghetti", 9, 10], ["🍛", "curry", 7, 10], ["🍤", "fried_shrimp", 11, 5], ["🍱", "bento", 7, 11], ["🍣", "sushi", 11, 4], ["🍥", "fish_cake", 11, 6], ["🍙", "rice_ball", 5, 10], ["🍘", "rice_cracker", 4, 10], ["🍚", "rice", 6, 10], ["🍜", "ramen", 8, 10], ["🍲", "stew", 8, 11], ["🍢", "oden", 11, 3], ["🍡", "dango", 11, 2], ["🍳", "egg", 9, 11], ["🍞", "bread", 10, 10], ["🍩", "doughnut", 11, 10], ["🍮", "custard", 4, 11], ["🍦", "icecream", 11, 7], ["🍨", "ice_cream", 11, 9], ["🍧", "shaved_ice", 11, 8], ["🎂", "birthday", 12, 9], ["🍰", "cake", 6, 11], ["🍪", "cookie", 0, 11], ["🍫", "chocolate_bar", 1, 11], ["🍬", "candy", 2, 11], ["🍭", "lollipop", 3, 11], ["🍯", "honey_pot", 5, 11], ["🍎", "apple", 10, 4], ["🍏", "green_apple", 10, 5], ["🍊", "tangerine", 10, 0], ["🍒", "cherries", 10, 8], ["🍇", "grapes", 7, 9], ["🍉", "watermelon", 9, 9], ["🍓", "strawberry", 10, 9], ["🍑", "peach", 10, 7], ["🍈", "melon", 8, 9], ["🍌", "banana", 10, 2], ["🍍", "pineapple", 10, 3], ["🍠", "sweet_potato", 11, 1], ["🍆", "eggplant", 6, 9], ["🍅", "tomato", 5, 9], ["🌽", "corn", 9, 6]], [["🏠", "house", 3, 14], ["🏡", "house_with_garden", 4, 14], ["🏫", "school", 14, 14], ["🏢", "office", 5, 14], ["🏣", "post_office", 6, 14], ["🏥", "hospital", 8, 14], ["🏦", "bank", 9, 14], ["🏪", "convenience_store", 13, 14], ["🏩", "love_hotel", 12, 14], ["🏨", "hotel", 11, 14], ["💒", "wedding", 19, 13], ["⛪", "church", 28, 0], ["🏬", "department_store", 15, 0], ["🌇", "city_sunrise", 7, 0], ["🌆", "city_sunset", 6, 6], ["🏯", "japanese_castle", 15, 3], ["🏰", "european_castle", 15, 4], ["⛺", "tent", 28, 4], ["🏭", "factory", 15, 1], ["🗼", "tokyo_tower", 15, 23], ["🗾", "japan", 17, 23], ["🗻", "mount_fuji", 14, 23], ["🌄", "sunrise_over_mountains", 4, 6], ["🌅", "sunrise", 5, 6], ["🌃", "night_with_stars", 3, 6], ["🗽", "statue_of_liberty", 16, 23], ["🌉", "bridge_at_night", 7, 2], ["🎠", "carousel_horse", 13, 2], ["🎡", "ferris_wheel", 13, 3], ["⛲", "fountain", 28, 1], ["🎢", "roller_coaster", 13, 4], ["🚢", "ship", 26, 5], ["⛵", "boat", 28, 3], ["🚤", "speedboat", 26, 7], ["⚓", "anchor", 17, 27], ["🚀", "rocket", 25, 22], ["✈", "airplane", 28, 8], ["💺", "seat", 20, 14], ["🚉", "station", 6, 25], ["🚄", "bullettrain_side", 1, 25], ["🚅", "bullettrain_front", 2, 25], ["🚇", "metro", 4, 25], ["🚃", "railway_car", 0, 25], ["🚌", "bus", 9, 25], ["🚙", "blue_car", 22, 25], ["🚗", "car", 20, 25], ["🚕", "taxi", 18, 25], ["🚚", "truck", 23, 25], ["🚨", "rotating_light", 26, 11], ["🚓", "police_car", 16, 25], ["🚒", "fire_engine", 15, 25], ["🚑", "ambulance", 14, 25], ["🚲", "bike", 26, 21], ["💈", "barber", 19, 3], ["🚏", "busstop", 12, 25], ["🎫", "ticket", 0, 13], ["🚥", "traffic_light", 26, 8], ["⚠", "warning", 18, 27], ["🚧", "construction", 26, 10], ["🔰", "beginner", 22, 22], ["⛽", "fuelpump", 28, 5], ["🏮", "izakaya_lantern", 15, 2], ["🎰", "slot_machine", 5, 13], ["♨", "hotsprings", 14, 27], ["🗿", "moyai", 18, 23], ["🎪", "circus_tent", 13, 12], ["🎭", "performing_arts", 2, 13], ["📍", "round_pushpin", 13, 20], ["🚩", "triangular_flag_on_post", 26, 12]], [["🔟", "keycap_ten", 5, 22], ["🔢", "1234", 8, 22], ["🔣", "symbols", 9, 22], ["⬆", "arrow_up", 10, 28], ["⬇", "arrow_down", 11, 28], ["⬅", "arrow_left", 9, 28], ["➡", "arrow_right", 4, 28], ["🔠", "capital_abcd", 6, 22], ["🔡", "abcd", 7, 22], ["🔤", "abc", 10, 22], ["↗", "arrow_upper_right", 22, 26], ["↖", "arrow_upper_left", 21, 26], ["↘", "arrow_lower_right", 23, 26], ["↙", "arrow_lower_left", 24, 26], ["↔", "left_right_arrow", 19, 26], ["↕", "arrow_up_down", 20, 26], ["◀", "arrow_backward", 27, 12], ["▶", "arrow_forward", 27, 11], ["🔼", "arrow_up_small", 23, 11], ["🔽", "arrow_down_small", 23, 12], ["↩", "leftwards_arrow_with_hook", 25, 26], ["↪", "arrow_right_hook", 26, 26], ["ℹ", "information_source", 18, 26], ["⏪", "rewind", 27, 3], ["⏩", "fast_forward", 27, 2], ["⏫", "arrow_double_up", 27, 4], ["⏬", "arrow_double_down", 27, 5], ["⤵", "arrow_heading_down", 8, 28], ["⤴", "arrow_heading_up", 7, 28], ["🆗", "ok", 1, 3], ["🆕", "new", 3, 2], ["🆙", "up", 3, 3], ["🆒", "cool", 2, 2], ["🆓", "free", 3, 0], ["🆖", "ng", 0, 3], ["📶", "signal_strength", 12, 21], ["🎦", "cinema", 13, 8], ["🈁", "koko", 5, 2], ["🈯", "u6307", 0, 5], ["🈳", "u7a7a", 2, 5], ["🈵", "u6e80", 4, 5], ["🈴", "u5408", 3, 5], ["🈲", "u7981", 1, 5], ["🉐", "ideograph_advantage", 6, 4], ["🈹", "u5272", 6, 2], ["🈺", "u55b6", 6, 3], ["🈶", "u6709", 5, 5], ["🈚", "u7121", 5, 4], ["🚻", "restroom", 4, 26], ["🚹", "mens", 2, 26], ["🚺", "womens", 3, 26], ["🚼", "baby_symbol", 5, 26], ["🚾", "wc", 7, 26], ["🅿", "parking", 2, 1], ["♿", "wheelchair", 16, 27], ["🚭", "no_smoking", 26, 16], ["🈷", "u6708", 6, 0], ["🈸", "u7533", 6, 1], ["🈂", "sa", 5, 3], ["Ⓜ", "m", 27, 8], ["🉑", "accept", 6, 5], ["㊙", "secret", 19, 28], ["㊗", "congratulations", 18, 28], ["🆑", "cl", 1, 2], ["🆘", "sos", 2, 3], ["🆔", "id", 3, 1], ["🚫", "no_entry_sign", 26, 14], ["🔞", "underage", 4, 22], ["⛔", "no_entry", 27, 27], ["✳", "eight_spoked_asterisk", 28, 18], ["❇", "sparkle", 28, 21], ["❎", "negative_squared_cross_mark", 28, 23], ["✅", "white_check_mark", 28, 7], ["✴", "eight_pointed_black_star", 28, 19], ["💟", "heart_decoration", 7, 19], ["🆚", "vs", 4, 0], ["📳", "vibration_mode", 9, 21], ["📴", "mobile_phone_off", 10, 21], ["🅰", "a", 0, 1], ["🅱", "b", 1, 1], ["🆎", "ab", 0, 2], ["🅾", "o2", 2, 0], ["💠", "diamond_shape_with_a_dot_inside", 8, 19], ["♻", "recycle", 15, 27], ["♈", "aries", 27, 25], ["♉", "taurus", 27, 26], ["♊", "gemini", 0, 27], ["♋", "cancer", 1, 27], ["♌", "leo", 2, 27], ["♍", "virgo", 3, 27], ["♎", "libra", 4, 27], ["♏", "scorpius", 5, 27], ["♐", "sagittarius", 6, 27], ["♑", "capricorn", 7, 27], ["♒", "aquarius", 8, 27], ["♓", "pisces", 9, 27], ["⛎", "ophiuchus", 26, 27], ["🔯", "six_pointed_star", 21, 22], ["🏧", "atm", 10, 14], ["💹", "chart", 20, 13], ["💲", "heavy_dollar_sign", 20, 6], ["💱", "currency_exchange", 20, 5], ["❌", "x", 28, 22], ["‼", "bangbang", 15, 26], ["⁉", "interrobang", 16, 26], ["❗", "exclamation", 28, 27], ["❓", "question", 28, 24], ["❕", "grey_exclamation", 28, 26], ["❔", "grey_question", 28, 25], ["⭕", "o", 15, 28], ["🔝", "top", 3, 22], ["🔚", "end", 0, 22], ["🔙", "back", 22, 21], ["🔛", "on", 1, 22], ["🔜", "soon", 2, 22], ["🔃", "arrows_clockwise", 21, 21], ["🕛", "clock12", 1, 23], ["🕐", "clock1", 23, 13], ["🕑", "clock2", 23, 14], ["🕒", "clock3", 23, 15], ["🕓", "clock4", 23, 16], ["🕔", "clock5", 23, 17], ["🕕", "clock6", 23, 18], ["🕖", "clock7", 23, 19], ["🕗", "clock8", 23, 20], ["🕘", "clock9", 23, 21], ["🕙", "clock10", 23, 22], ["🕚", "clock11", 0, 23], ["✖", "heavy_multiplication_x", 28, 16], ["➕", "heavy_plus_sign", 1, 28], ["➖", "heavy_minus_sign", 2, 28], ["➗", "heavy_division_sign", 3, 28], ["♠", "spades", 10, 27], ["♥", "hearts", 12, 27], ["♣", "clubs", 11, 27], ["♦", "diamonds", 13, 27], ["💮", "white_flower", 20, 2], ["💯", "100", 20, 3], ["✔", "heavy_check_mark", 28, 15], ["☑", "ballot_box_with_check", 27, 20], ["🔘", "radio_button", 22, 20], ["🔗", "link", 22, 19], ["➰", "curly_loop", 5, 28], ["〰", "wavy_dash", 16, 28], ["〽", "part_alternation_mark", 17, 28], ["🔱", "trident", 23, 0], ["◼", "black_medium_square", 27, 14], ["◻", "white_medium_square", 27, 13], ["◾", "black_medium_small_square", 27, 16], ["◽", "white_medium_small_square", 27, 15], ["▪", "black_small_square", 27, 9], ["▫", "white_small_square", 27, 10], ["🔺", "small_red_triangle", 23, 9], ["🔲", "black_square_button", 23, 1], ["🔳", "white_square_button", 23, 2], ["⚫", "black_circle", 21, 27], ["⚪", "white_circle", 20, 27], ["🔴", "red_circle", 23, 3], ["🔵", "large_blue_circle", 23, 4], ["🔻", "small_red_triangle_down", 23, 10], ["⬜", "white_large_square", 13, 28], ["⬛", "black_large_square", 12, 28], ["🔶", "large_orange_diamond", 23, 5], ["🔷", "large_blue_diamond", 23, 6], ["🔸", "small_orange_diamond", 23, 7], ["🔹", "small_blue_diamond", 23, 8]]], f = {};
        b.each(e, function(a, c) {
            b.each(a, function(a) {
                f[a[0]] = [a[1], a[2], a[3], c]
            })
                });
        var g = {":-)": "😀",":-D": "😃",";-)": "😉","}-)": "👿",":-o": "😮",":-O": "😮",":-/": "😕",":-\\": "😕","x-(": "😩","X-(": "😩",":-(": "😞","B-)": "😎",":-p": "😛",":-P": "😛",":-@": "😠",":-|": "😐",":-$": "😳"};
        b.each(g, function(a, b) {
            f[a][d + "ascii"] = b
        });
        var h = ["⁉", "✂", "✈", "✉", "❤", "✌", "✏", "⚠", "🈷", "🈂", "Ⓜ", "✒", "✔", "✖", "◼", "◻", "™", "☀", "☁", "♠", "♣", "♥", "♦", "♨", "▪", "▫", "ℹ", "↔", "↕", "↖", "↗", "↘", "↙", "☑", "〰", "♻", "〽", "▶", "☝", "✳", "✴", "❄", "❇", "⬆", "⬇", "⬅", "➡", "◀", "↩", "↪", "⤴", "⤵", "㊗", "㊙", "☺", "‼", "🅰", "🅱", "🅿", "🅾", "🇯", "🇰", "🇩", "🇨", "🇺", "🇫", "🇪", "🇮", "🇷", "🇬", "☔", "⭐", "⚡", "☕", "☎", "⚓", "♈", "♉", "♐", "♑", "♒", "♓", "♿", "♊", "♋", "♌", "♍", "♎", "♏", "◾", "◽", "⚫", "⚪"], i = {};
        b.each(f, function(a, b) {
            i[d + a[0]] = b
        });
        var j = 5, k = b.map(e, function(a) {
            return b.map(a, function(a) {
                return a[0]
            })
        }), l = function(a, b, c) {
            for (var d = [], e = 0, f = 0; e + c <= b.length; ) {
                var g = b.slice(e, e + c);
                a.isSupportedAscii(g) ? (e > f && d.push(b.slice(f, e)), d.push(g), e += c, f = e) : ++e
            }
            return f < b.length && d.push(b.slice(f, b.length)), d
        };
        return {getGroupRepresentatives: function() {
            return [["😄", "People"], ["🌸", "Nature"], ["🔔", "Objects"], ["🚙", "Places"], ["🔠", "Symbols"]]
        },getUglyNativeEmoji: function() {
            return h.slice()
        },isUglyNativeEmoji: function(a) {
            return b.contains(h, a)
        },hasNativeSupport: function(a) {
            var b, c = "😀";
            return a.createElement("canvas").getContext ? (b = a.createElement("canvas").getContext("2d"), "function" != typeof b.fillText ? !1 : (b.textBaseline = "top", b.font = "32px Arial", b.fillText(c, 0, 0), 0 !== b.getImageData(16, 16, 1, 1).data[0])) : !1
        },isSupportedUnicode: function(a) {
            return b.has(f, a)
        },identifierFromUnicode: function(a) {
            return f[a][0]
        },asciiFromUnicode: function(a) {
            return f[a][d + "ascii"]
        },spritemapIndexFromUnicode: function(a) {
            return {x: f[a][1],y: f[a][2]}
        },groupFromUnicode: function(a) {
            return f[a][3]
        },isSupportedAscii: function(a) {
            return b.has(g, a)
        },unicodeFromAscii: function(a) {
            return g[a]
        },isSupportedIdentifier: function(a) {
            return b.has(i, d + a)
        },unicodeFromIdentifier: function(a) {
            return i[d + a]
        },N_GROUPS: j,prettyEmoticonsUnicodeGroups: function() {
            return b.map(k, function(a) {
                var c = [];
                return b.each(a, function(a) {
                    b.contains(h, a) || c.push(a)
                }), c
            })
        },allEmoticonsUnicodeGroups: k,allEmoticonsUnicodeList: b.keys(f),allEmoticonsIdentifierList: b.map(f, function(a) {
            return a[0]
        }),prettyEmoticonsIdentifierList: function() {
            return b.map(b.filter(f, function(a, c) {
                return !b.contains(h, c)
            }), function(a) {
                return a[0]
            })
        },asciiEmoticonsUnicodeList: b.uniq(b.values(g)),asciiEmoticonsIdentifierList: b.map(b.uniq(b.values(g)), function(a) {
            return f[a][0]
        }),MIN_ASCII_LENGTH: 3,MAX_ASCII_LENGTH: 3,asciiEmoticonsAsciiList: b.keys(g),spritemapStyleString: function(a, b) {
            var c = this.spritemapIndexFromUnicode(b);
            return "display:inline-block;height:" + a + "px;width:" + a + "px;background-position:-" + a * c.x + "px -" + a * c.y + "px;"
        },spritemapSpanTag: function(a, c, d) {
            return b.isUndefined(d) && (d = "intermoji-default-class"), '<span style="' + this.spritemapStyleString(a, c) + '" title="' + this.identifierFromUnicode(c) + '" class="' + d + '"></span>'
        },splitOnUnicodeEmojis: function(a) {
            if (b.isUndefined(a))
                return [];
            var d = [], e = "";
            return b.each(c(a), function(a) {
                var b = a[0];
                this.isSupportedUnicode(b) ? (e.length > 0 && (d.push(e), e = ""), d.push(b)) : e += b
            }, this), e.length > 0 && d.push(e), d
        },splitOnAsciiEmojis: function(a) {
            if (b.isUndefined(a))
                return [];
            for (var c = [a], d = this.MAX_ASCII_LENGTH; d >= this.MIN_ASCII_LENGTH; --d) {
                for (var e = [], f = 0; f < c.length; ++f)
                    e = e.concat(l(this, c[f], d));
                c = e
            }
            return c
        },splitOnUnicodeAndAsciiEmojis: function(a) {
            return b.isUndefined(a) ? [] : b.flatten(b.map(this.splitOnUnicodeEmojis(a), function(a) {
                return this.splitOnAsciiEmojis(a)
            }, this), this)
        },substituteUnicodeForAsciiEmojis: function(a) {
            return b.isUndefined(a) ? "" : b.reduce(b.map(this.splitOnAsciiEmojis(a), function(a) {
                return this.isSupportedAscii(a) ? this.unicodeFromAscii(a) : a
            }, this), function(a, b) {
                return a + b
            }, "", this)
        },substituteSpansForEmojis: function(a, c, d) {
            return b.isUndefined(c) ? "" : b.reduce(b.map(this.splitOnUnicodeAndAsciiEmojis(c), function(b) {
                return this.isSupportedAscii(b) ? this.spritemapSpanTag(a, this.unicodeFromAscii(b), d) : this.isSupportedUnicode(b) ? this.spritemapSpanTag(a, b, d) : b
            }, this), function(a, b) {
                return a + b
            }, "", this)
        },wrapUnicodeEmojiInTitledSpans: function(a, c, d) {
            return b.isUndefined(c) ? "" : b.reduce(b.map(this.splitOnUnicodeEmojis(c), function(b) {
                return this.isSupportedUnicode(b) ? this.isUglyNativeEmoji(b) ? this.spritemapSpanTag(a, b, d) : '<span title="' + this.identifierFromUnicode(b) + '">' + b + "</span>" : b
            }, this), function(a, b) {
                return a + b
            }, "", this)
        },substituteUnicodeForColonified: function(a) {
            for (var b = function(a) {
                return ":" + a + ":"
            }, c = !0, d = "", e = "", f = 0; f < a.length; f++)
                ":" === a[f] ? (c ? (c = !1, e += d) : (c = !0, e += this.isSupportedIdentifier(d) ? this.unicodeFromIdentifier(d) : b(d)), d = "") : d += a[f];
            return c || (e += ":"), e += d
        },codepointIndexFromUnicode: function(a) {
            return this.isSupportedUnicode(a) ? c(a)[0][1] : 0
        }}
    }), define("activity-monitor", ["exports", "underscore", "jquery", "date"], function(a, b, c, d) {
        "use strict";
        function e() {
            b.invoke(o, "call")
        }
        function f() {
            b.invoke(p, "call")
        }
        function g() {
            return d.now() - j < k
        }
        function h() {
            m && (m = clearTimeout(m))
        }
        function i() {
            h(), m = setTimeout(a.recordActivityFinished, j)
        }
        var j, k, l, m, n = !1, o = [], p = [];
        a.start = function(b) {
            n || (n = !0, j = b || 1e3, l = !1, c(document).on("intercom.keyup", a.recordActivity), c(document).mousemove(a.recordActivity), c(document).focus(a.recordActivity), c(window).blur(a.recordActivityFinished))
        }, a.stop = function() {
            n && (c(document).off("intercom.keyup", a.recordActivity), c(document).off("mousemove", a.recordActivity), c(document).off("focus", a.recordActivity), c(window).off("blur", a.recordActivityFinished), h(), n = !1)
        }, a.recordActivity = function() {
            l = !0, k = d.now(), i(), e()
        }, a.recordActivityFinished = function() {
            l = !1, h(), f()
        }, a.onActive = function(a) {
            o.push(a)
        }, a.onInactive = function(a) {
            p.push(a)
        }, a.isActive = function() {
            return l || g()
        }
    }), define("activity-responder", function() {
        "use strict";
        var a = require("underscore"), b = require("activity-monitor");
        return {initialize: function(c) {
            b.onActive(a.bind(c.onUserPresent, c)), b.onInactive(a.bind(c.onUserAbsent, c))
        }}
    }), define("api", function() {
        "use strict";
        var a = require("underscore"), b = require("logger");
        return function(c) {
            function d(b) {
                return b = a.toArray(b), a.isEmpty(b) ? void 0 : e[b[0]].apply(e, b.slice(1))
            }
            var e = {boot: function(a) {
                c.initialize(a)
            },shutdown: function() {
                c.deinitialize()
            },update: function(a) {
                c.createOrUpdateUser(a)
            },reattachActivator: function() {
                c.enableCustomLauncher()
            },show: function() {
                c.show()
            },showMessages: function() {
                c.showConversations()
            },showNewMessage: function(a) {
                c.showNewConversation(a)
            },hide: function() {
                c.hide()
            },trackEvent: function(a, b) {
                c.createEvent(a, b)
            },onHide: function(a) {
                c.on("hide", a)
            },onShow: function(a) {
                c.on("show", a)
            },onActivatorClick: function(a) {
                c.on("click", a)
            },dumpLog: function() {
                return b.getLines()
            }};
            if (e.reattach_activator = e.reattachActivator, e.trackUserEvent = e.trackEvent, window.Intercom && window.Intercom.q)
                for (; ; ) {
                    var f = window.Intercom.q.shift();
                    if (a.isUndefined(f))
                        break;
                    d(f)
                }
            return window.Intercom = function() {
                return d(arguments)
            }, window.Intercom.public_api = e, window.Intercom.version = {sha: "6f34c72a0293980f3f53bf3513808caca2de2c33",date: new Date('"2015-11-04 08:53:19 +0000"')}, window.Intercom
        }
    }), define("audio", function() {
        "use strict";
        var a = require("browser");
        return {enable: function() {
            this.enabled = !0
        },isEnabled: function() {
            return this.enabled
        },playDelivered: function() {
            this.play("https://js.intercomcdn.com/audio/delivered.mp3")
        },playFailed: function() {
            this.play("https://js.intercomcdn.com/audio/failed.mp3")
        },playNotification: function() {
            this.play("https://js.intercomcdn.com/audio/notification.mp3")
        },playSubmit: function() {
            this.play("https://js.intercomcdn.com/audio/submit.mp3")
        },play: function(b) {
            if (a.features.audioMp3() && this.isEnabled()) {
                var c = this.load(b);
                c && c.play()
            }
        },load: function(a) {
            return void 0 === this.audio[a] && (this.audio[a] = new Audio(a)), this.audio[a]
        },audio: {}}
    }), define("boot", function() {
        "use strict";
        var a = require("jquery"), b = require("underscore"), c = require("backbone"), d = require("settings"), e = require("intercom"), f = require("sync"), g = require("api"), h = require("pjax"), i = require("turbolinks"), j = require("features"), k = require("user-metrics"), l = require("clients/intercom"), m = require("clients/nexus"), n = require("clients/message-matcher"), o = a("meta[name=intercom-js-api-base]").attr("content") || "https://api-iam.intercom.io", p = a("meta[name=intercom-js-api-base]").attr("content") || "https://api-ping.intercom.io", q = new d(window.intercomSettings);
        j.initialize(q);
        var r = new m(q), s = new l(o, p, q), t = new n(s, q), u = new e(s, r, t, q), v = window.Intercom && window.Intercom.q ? window.Intercom.q : [], w = b.any(v, function(a) {
            return "boot" === a[0] || "shutdown" === a[0]
        });
        return c.sync = f(s, r), k.initialize(q), h(u), i(u), g(u), w || !q.isValid() ? !1 : (u.initialize(), !0)
    }), define("browser", function() {
        "use strict";
        function a(a) {
            try {
                if (!(a in window))
                    return !1;
                var b = window[a];
                return null === b ? !1 : (b.setItem("intercom.testStorage", "0"), b.removeItem("intercom.testStorage"), !0)
            } catch (c) {
                return !1
            }
        }
        var b = require("underscore"), c = require("jquery"), d = require("intermoji"), e = {ie8: function() {
            return "attachEvent" in window && !window.addEventListener
        },xhr2: function() {
            return "XMLHttpRequest" in window && "withCredentials" in new XMLHttpRequest
        },xdr: function() {
            return "undefined" != typeof XDomainRequest
        },localStorage: function() {
            return a("localStorage")
        },sessionStorage: function() {
            return a("sessionStorage")
        },uiwebview: function() {
            return /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent)
        },upload: function() {
            return !!(window.File && window.FileList && window.FileReader && window.FormData)
        },audioMp3: function() {
            var a = c("<audio>")[0];
            return !!a.canPlayType && !!a.canPlayType("audio/mpeg;").replace(/^no$/, "")
        },visibility: function() {
            return "undefined" != typeof document.hidden || "undefined" != typeof document.mozHidden || "undefined" != typeof document.msHidden || "undefined" != typeof document.webkitHidden
        },emoji: function() {
            return b.isUndefined(this.isNativeEmojiSupport) && (this.isNativeEmojiSupport = d.hasNativeSupport(document)), this.isNativeEmojiSupport
        },pointerEvents: function() {
            if (b.isUndefined(this.isPointerEvents)) {
                var a = document.createElement("x");
                a.style.cssText = "pointer-events:auto", this.isPointerEvents = "auto" === a.style.pointerEvents
            }
            return this.isPointerEvents
        },touchScreen: function() {
            return b.isUndefined(this.isTouchScreen) && (this.isTouchScreen = b.isUndefined(navigator.userAgent) ? !1 : !b.isNull(navigator.userAgent.match(/iphone|ipad|ipod|android|blackberry|opera mini|iemobile/i))), this.isTouchScreen
        },ie: function() {
            return navigator.userAgent.indexOf("MSIE") >= 0 || navigator.appVersion.indexOf("Trident/") >= 0
        }};
        return {features: e}
    }), define("clients/http", ["browser", "logger", "url", "clients/http/xhr2", "clients/http/xdr", "clients/http/jsonp"], function(a, b, c, d, e, f) {
        "use strict";
        function g(b) {
            return a.features.xdr() && c.parse(b).protocol === document.location.protocol
        }
        var h = {xhr2: d,xdr: e,jsonp: f};
        return h.post = function(c, d, e, f) {
            return a.features.xhr2() ? (b.info("http - POST (xhr2) " + c), this.xhr2(c, "POST", d, e, f)) : g(c) ? (b.info("http - POST (xdr) " + c), this.xdr(c, d, e, f)) : (b.info("http - POST (jsonp) " + c), this.jsonp(c, d, e))
        }, h
    }), define("clients/http/jsonp", ["jquery", "date"], function(a, b) {
        "use strict";
        return function(c, d, e) {
            return a.ajax({type: "GET",url: c,data: d,dataType: "jsonp",jsonp: "callback",jsonpCallback: "intercom_jsonp_" + b.now(),success: e})
        }
    }), define("clients/http/xdr", ["jquery", "underscore", "json", "logger"], function(a, b, c, d) {
        "use strict";
        function e(a) {
            if ("string" == typeof a)
                if (a.match(/^\s*$/))
                    a = {};
            else
                try {
                    a = c.parse(a)
                } catch (b) {
                    d.error("Parsing failed:'" + a + "'")
                }
            return a
        }
        return function(c, d, f, g) {
            var h = new XDomainRequest, i = a.Deferred();
            return h.timeout = 1e4, h.open("POST", c), h.ontimeout = function() {
            }, h.onprogress = function() {
            }, h.onload = function() {
                var a = h.response || h.responseText, c = e(a);
                b.isFunction(f) && f(c, h.status), i.resolve(c)
            }, h.onerror = function() {
                var a = h.response || h.responseText, c = e(a);
                b.isFunction(g) && g(c), i.rejectWith(c)
            }, d.utf8 = "✓", setTimeout(function() {
                h.send(a.param(d))
            }, 0), i
        }
    }), define("clients/http/xhr2", ["jquery", "xhr"], function(a, b) {
        "use strict";
        return function(c, d, e, f, g) {
            return a.ajax({xhrFields: {withCredentials: !0},xhr: b.createXHR,dataType: "json",type: d,url: c,data: e,success: f,error: g})
        }
    }), define("clients/intercom", function() {
        "use strict";
        function a(a, b, c) {
            this.base = a, this.pingBase = b, this.settings = c
        }
        var b = require("underscore"), c = require("json"), d = require("logger"), e = require("clients/http"), f = require("date"), g = require("metrics"), h = require("idempotency-key"), i = require("backbone").Events;
        return b.extend(a.prototype, i, {createOrUpdateUser: function(a) {
            d.info("clients/intercom - createOrUpdateUser");
            var c, e = this._buildPingRequest(a);
            return c = this.settings.get("user.anonymous") === !0 ? "/ping" : "/vjs/users/ping", this._post(c, e, this.pingBase).pipe(b.bind(this._handlePingResponse, this)).promise()
        },getConversation: function(a) {
            return d.info("clients/intercom - getConversation - id:" + a), this._post("/widget_api/conversations/" + a + "/fetch", this._buildRequest()).promise()
        },getConversations: function(a) {
            return a = b.defaults(a || {}, {page: 1,per_page: 10,referer: this._getReferer()}), d.info("clients/intercom - getConversations"), this._post("/widget_api/conversations", this._buildRequest(a)).promise()
        },getConversationsAndFilterByIds: function(a) {
            return d.info("clients/intercom - getConversationsAndFilterByIds - ids:" + a), this.getConversations().then(function(c) {
                return b.filter(c.conversations, function(c) {
                    return b.contains(a, c.id)
                })
            }).promise()
        },markConversationAsRead: function(a) {
            return d.info("clients/intercom - updateConversation - id:" + a.id), this._post("/widget_api/conversations/" + a.id + "/read", this._buildRequest(b.omit(a, "id"))).promise()
        },createComment: function(a) {
            return d.info("clients/intercom - createComment"), b.extend(a, {referer: this._getReferer()}), this._post("/widget_api/conversations/" + a.conversation_id + "/reply", this._buildRequest(a)).pipe(function(a, b, c) {
                if (204 !== c.status) {
                    var d = a.conversation_parts.conversation_parts.length - 1, e = a.conversation_parts.conversation_parts[d];
                    return e.conversation_id = a.id, e
                }
            }).promise()
        },createConversation: function(a) {
            return d.info("clients/intercom - createConversation"), b.extend(a, {referer: this._getReferer()}), this._post("/widget_api/messages", this._buildRequest(a)).promise()
        },matchMessage: function(a) {
            var d = this._buildRequest({predicates: c.stringify(a.comparablePredicates)});
            this._post("/widget_api/messages/" + a.id + "/match", d).then(b.bind(function(a) {
                b.isEmpty(a) || this.trigger("new-unread-conversation", a)
            }, this))
        },createUpload: function(a) {
            return d.info("clients/intercom - createUpload"), this._post("/vjs/uploads", this._buildRequest({upload: c.stringify(a),user_id: this.settings.get("user.intercom-id")})).promise()
        },updateUpload: function(a) {
            d.info("clients/intercom - updateUpload");
            var b = a.id;
            return this._post("/vjs/uploads/" + b, this._buildRequest({upload: c.stringify(a),_method: "put"})).promise()
        },createEvent: function(a, b) {
            d.info("clients/intercom - createEvent");
            var e = this.settings.get("user.anonymous") ? "/ping/events" : "/vjs/users/events";
            return this._post(e, this._buildRequest({event_list: c.stringify({data: [{event_name: a,created: Math.round(f.now() / 1e3),metadata: b}]})})).promise()
        },_handlePingResponse: function(a) {
            if ("string" == typeof a)
                throw d.error("Unable to process String ping responses"), new Error("Intercom was unable to initialise.");
            return this.trigger("ping", a), this.settings.get("app.messaging-disabled") ? a : (this._getUnreadConversations(a.unread_conversation_ids), a)
        },_buildRequest: function(a) {
            return a = b.extend(a || {}, this._attributesForRequest()), a.user_data = c.stringify(a.user_data), a
        },_getUnreadConversations: function(a) {
            if (!b.isEmpty(a)) {
                var c = b.invoke(a, "toString");
                this.getConversationsAndFilterByIds(c).then(b.bind(function(a) {
                    b.each(a, b.bind(this.trigger, this, "new-unread-conversation"))
                        }, this))
            }
        },_buildPingRequest: function() {
            var a = this._attributesForRequest();
            return b.extend(a.user_data, {increments: this.settings.getAndClear("increments")}, this.settings.getCustomAttributes()), a.referer = this._getReferer(), a.user_data = c.stringify(a.user_data), a.metrics = c.stringify(g.getMetrics()), g.resetMetrics(), a
        },_attributesForRequest: function() {
            return {app_id: this.settings.get("app.id"),anonymous_session: this.settings.get("user.anonymous-session"),user_data: {email: this.settings.get("user.email"),user_id: this.settings.get("user.id"),user_hash: this.settings.get("user.hash"),anonymous_id: this.settings.get("user.anonymous-id"),anonymous_email: this.settings.get("user.anonymous-email")}}
        },_getReferer: function() {
            return window.location.href
        },_post: function(a, b, c) {
            return b[h.keyName] = h.randomKey(), e.post((c || this.base) + a, b)
        }}), a
    }), define("clients/message-matcher", function() {
        "use strict";
        function a(a, b) {
            this.client = a, this.settings = b, this.isInitialised = !1
        }
        var b = require("underscore");
        return b.extend(a.prototype, {initialise: function(a) {
            this.isInitialised || (this.messages = a, this._predicateHandlers = {time_on_page: this._timeOnPagePredicateHandler}, this._setupMessages(a), this.isInitialised = !0)
        },_setupMessages: function(a) {
            b.each(a, function(a) {
                this._setupMessagePredicateHandlers(a)
            }, this)
                },_setupMessagePredicateHandlers: function(a) {
                    a.hasOrPredicates = this._hasOrPredicates(a.predicates), a.comparablePredicates = this._comparablePredicates(a), b.each(a.comparablePredicates, function(c) {
                        var d = b.bind(this._predicateHandlers[c.attribute], this);
                        d(a, c)
                    }, this)
                        },_hasOrPredicates: function(a) {
                            return b.any(b.map(a, function(a) {
                                return a.type && "or" === a.type
                            }))
                        },_comparablePredicates: function(a) {
                            var c = [];
                            if (a.hasOrPredicates) {
                                var d = b.find(a.predicates, function(a) {
                                    return a.type && "or" === a.type
                                });
                                c = d.predicates
                            } else
                                c = a.predicates;
                            return b.each(c, function(a) {
                                a.matched = !1, a.attribute = a.attribute.replace("client_attributes.", "")
                            }), c
                        },_timeOnPagePredicateHandler: function(a, b) {
                            var c = this, d = 1e3 * parseInt(b.value, 10);
                            setTimeout(function() {
                                b.matched = !0, c._predicatesMatch(a) && c.client.matchMessage(a)
                            }, d)
                        },_predicatesMatch: function(a) {
                            var c = b.map(a.comparablePredicates, function(a) {
                                return a.matched
                            });
                            return a.hasOrPredicates ? b.any(c, b.identity) : b.all(c, b.identity)
                        }}), a
    }), define("clients/nexus", function() {
        "use strict";
        function a(a) {
            this.settings = a, this.listeners = [], this.isInitialised = !1
        }
        var b = require("underscore"), c = require("logger"), d = require("nexus-client"), e = require("rtm-latency-monitor");
        return a.prototype.initialise = function() {
            try {
                var a = this.settings.get("app.rtm-settings");
                if (b.isUndefined(a) || b.isUndefined(a.endpoints))
                    return void this._shutdown();
                if (this.isInitialised && 0 === b(this.nexusClient.getEndpoints()).difference(a.endpoints).length)
                    return;
                this.settings.get("app.rtm-enabled") || e.disable(), (this.isInitialised || !b.isUndefined(this.nexusClient)) && this._shutdown(), c.info("Starting Nexus client"), this.nexusClient = this._createNexusClient(a.endpoints, c), this.isInitialised = !0, this._addListeners(), this.addListener("NewComment", e.onNewComment)
            } catch (d) {
                c.error("initialise Error: " + d), this.isInitialised = !1
            }
        }, a.prototype.postEvent = function(a, b) {
            if (this.isInitialised)
                try {
                    this.nexusClient.sendEvent(a, b)
                } catch (d) {
                    c.error("postEvent Error: " + d)
                }
        }, a.prototype.addListener = function(a, b) {
            this.isInitialised ? this.nexusClient.addListener(a, b) : this.listeners.push({eventName: a,eventHandler: b})
        }, a.prototype.syncCreateConversation = function(a) {
            return this.postEvent("CreateConversation", a.id), a
        }, a.prototype.syncCreateComment = function(a) {
            return this.postEvent("NewComment", a.conversation_id), a
        }, a.prototype.onConversationSeen = function(a) {
            this.postEvent("ConversationSeen", {conversationId: a})
        }, a.prototype.onConversationReceived = function(a) {
            try {
                var d = e.popLatencyDataForConversation(a), f = b.extend(d, {conversationId: a});
                this.postEvent("ConversationReceived", f)
            } catch (g) {
                c.error("onConversationReceived Error: " + g)
            }
        }, a.prototype.onUserPresent = function() {
            if (this.isInitialised)
                try {
                    this.nexusClient.setUserPresent()
                } catch (a) {
                    c.error("onUserPresent Error: " + a)
                }
        }, a.prototype.onUserAbsent = function() {
            if (this.isInitialised)
                try {
                    this.nexusClient.setUserAbsent()
                } catch (a) {
                    c.error("onUserAbsent Error: " + a)
                }
        }, a.prototype.getMetrics = function() {
            return this.isInitialised ? this.nexusClient.getMetrics() : void 0
        }, a.prototype.resetMetrics = function() {
            this.isInitialised && this.nexusClient.resetMetrics()
        }, a.prototype._createNexusClient = function(a, b) {
            return new d(a, b)
        }, a.prototype._addListeners = function() {
            return this.isInitialised ? void b.each(this.listeners, function(a) {
                this.nexusClient.addListener(a.eventName, a.eventHandler)
            }, this) : void c.error("_addListeners must not be called until isInitialised is set")
        }, a.prototype._shutdown = function() {
            b.isUndefined(this.nexusClient) || (c.info("Shutting down Nexus client - configuration removed from ping response"), this.nexusClient.shutdown()), this.isInitialised = !1
        }, a
    }), define("collections/conversations", function() {
        "use strict";
        var a = require("underscore"), b = require("backbone"), c = require("models/conversation");
        return b.Collection.extend({model: c,initialize: function() {
            this.on("change", this.sort), this.on("reset", this.onReset)
        },comparator: function(a) {
            return a.updatedAt()
        },unread: function() {
            return a(this.reject(function(a) {
                return a.isRead()
            }))
        },newUnread: function() {
            return a(this.reject(function(a) {
                return a.isRead() || a.updatedBeforeInAppsV2()
            }))
        },fetchNextPage: function() {
            return this.pages += 1, this.fetch({remove: !1})
        },isFetched: function() {
            return this.pages === this.totalPages
        },parse: function(a) {
            return this.pages = a.pages.page, this.totalPages = a.pages.total_pages, a.conversations
        },onReset: function() {
            this.pages = void 0, this.totalPages = void 0
        }})
    }), define("collections/parts", ["underscore", "backbone", "models/part"], function(a, b, c) {
        "use strict";
        return b.Collection.extend({model: c,comparator: function(a) {
            return a.createdAt()
        },byAdmin: function() {
            return a(this.filter(function(a) {
                return a.byAdmin()
            }))
        },byUser: function() {
            return a(this.filter(function(a) {
                return a.byUser()
            }))
        },nonLwrResponses: function() {
            return a(this.reject(function(a) {
                return a.isLwrResponse()
            }))
        },lastNonLwrResponseBlock: function() {
            return this.nonLwrResponses().last().get("blocks")
        },lastNonLwrResponseBody: function() {
            return this.nonLwrResponses().last().body()
        },parse: function(a) {
            return (null === a || void 0 === a) && (a = {}), a.conversation_parts
        }})
    }), define("collections/uploads", ["backbone", "models/upload", "underscore"], function(a, b, c) {
        "use strict";
        return a.Collection.extend({model: b,initialize: function() {
            this.uploading = 0, this.on("upload:start", this.onUploadStart), this.on("upload:complete", this.onUploadComplete)
        },pendingUploads: function() {
            return this.filter(function(a) {
                return c.isUndefined(a.url())
            })
        },imageUploads: function() {
            return this.filter(function(a) {
                return a.isImage()
            })
        },anyUploading: function() {
            return this.uploading > 0
        },onUploadStart: function() {
            this.uploading++
        },onUploadComplete: function() {
            this.uploading--
        }})
    }), define("color", ["exports"], function(a) {
        "use strict";
        function b(a) {
            var b = a.slice(1), c = parseInt(b, 16);
            return {red: c >> 16,green: c >> 8 & 255,blue: 255 & c}
        }
        function c(a, b, c) {
            return "#" + String("000000" + (c | b << 8 | a << 16).toString(16)).slice(-6)
        }
        function d(a, b, c) {
            return Math.min(Math.max(b, a), c)
        }
        a.lighten = function(a, e) {
            var f = b(a), g = d(f.red + e, 0, 255), h = d(f.green + e, 0, 255), i = d(f.blue + e, 0, 255);
            return c(g, h, i)
        }, a.darken = function(b, c) {
            return a.lighten(b, -1 * c)
        }, a.addOpacity = function(a, c) {
            var e = b(a);
            return c = d(c, 0, 1), "rgba(" + e.red + "," + e.green + "," + e.blue + "," + c + ")"
        }
    }), define("cookie", ["exports"], function(a) {
        "use strict";
        var b = /[^.]*\.([^.]*|..\...|...\...)$/, c = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        a.findDomain = function(a) {
            var d = a.match(c);
            return d ? void 0 : (d = a.match(b), d ? "." + d[0] : void 0)
        }, a.read = function(a, b) {
            b = b || document.cookie;
            var c = "(?:(?:^|.*;)\\s*" + encodeURIComponent(a).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$";
            return decodeURIComponent(b.replace(new RegExp(c), "$1")) || void 0
        }, a.write = function(b, c, d, e, f) {
            var g = b + "=" + c;
            return "all" === d && (d = a.findDomain(location.host)), d && (g += "; domain=" + d), e && (g += "; path=" + e), f && (g += "; expires=" + f.toUTCString()), document.cookie = g, g
        }, a.clear = function(b, c, d) {
            a.write(b, "", c, d, new Date(0))
        }
    }), define("date", ["exports"], function(a) {
        "use strict";
        a.timestampToDate = function(a) {
            return new Date(1e3 * a)
        }, a.now = function() {
            return "function" == typeof Date.now ? Date.now() : (new Date).getTime()
        }
    }), define("draft-store", function() {
        "use strict";
        function a(a) {
            return a ? e + "-" + a : e
        }
        var b = require("store"), c = require("models/draft"), d = require("json"), e = "draft";
        return {loadDraft: function(d) {
            var e = b.sessionStorage.get(a(d));
            return c.fromJSON(e)
        },removeDraft: function(c) {
            b.sessionStorage.remove(a(c))
        },saveDraft: function(c, f) {
            c.isEmpty() || (b.sessionStorage.removeAll(e), b.sessionStorage.set(a(f), d.stringify(c.toJSON())))
        }}
    }), define("email", ["exports"], function(a) {
        "use strict";
        a.isValid = function(a) {
            var b = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return b.test(a)
        }
    }), define("embed", ["underscore", "jquery", "settings", "stylesheet", "models/part", "models/conversation", "views/embed/conversation", "views/embed/launcher"], function(a, b, c, d, e, f, g, h) {
        "use strict";
        function i(a) {
            return "chat" === a.type ? 0 : "announcement" === a.type ? 1 : "small-announcement" === a.type ? 2 : void 0
        }
        function j(a) {
            return m[a.replyType]
        }
        function k(a, c) {
            this.$el = b(a), this.selector = a, this.color = c, this.injectStyle()
        }
        var l = "chat announcement small-announcement", m = {thumbs: {type: "thumbs",options: [{id: "thumbs_up"}, {id: "thumbs_down"}],option: null},emotions: {type: "emotions",options: [{id: "happy"}, {id: "neutral"}, {id: "sad"}],option: null}}, n = {acquire: "intercom-acquire",inbox: "intercom-learn"};
        return k.prototype.addMessage = function(c) {
            var d = new e({id: a.uniqueId(),type: "conversation_message",body: c.body,message_style: i(c),lightweight_reply: j(c),author: {avatar: {square_128: c.avatarUrl},is_admin: c.byAdmin,name: c.authorName}});
            return c.uploads && d.uploads.add(c.uploads.map(function(a) {
                return {content_type: a.content_type,filesize: a.filesize,name: a.name,type: "upload",url: a.url}
            })), this.conversation.addPart(d), this.$el.addClass(c.type), b(this.selector).find(".intercom-embed-body")
        }, k.prototype.addComment = function(b) {
            this.conversation.addPart(new e({id: a.uniqueId(),type: "conversation_part",body: b.body,author: {avatar: {square_128: b.avatarUrl},is_admin: b.byAdmin}}))
        }, k.prototype.changeType = function(a) {
            b(this.selector).removeClass(l).addClass(a), this.conversation.getMessage().set({message_style: i({type: a})})
        }, k.prototype.changeReplyType = function(a) {
            "text" === a ? this.conversation.getMessage().unset("lightweight_reply") : this.conversation.getMessage().set({lightweight_reply: j({replyType: a})})
        }, k.prototype.changeColor = function(a) {
            this.color = a, this.$el.find("#intercom-embed-styles").remove(), this.injectStyle()
        }, k.prototype.toggleAttachments = function(a) {
            return this.$el.find(".intercom-attachments:first").toggle(a)
        }, k.prototype.reset = function() {
            void 0 !== this.conversation && this.conversation.parts.reset()
        }, k.prototype.injectStyle = function() {
            var a = d("stylesheets/intercom", this.color).replace(/#intercom-container/g, this.selector), c = b('<style type="text/css" id="intercom-embed-styles">' + a + "</style>");
            this.$el.append(c)
        }, k.prototype.embedConversation = function(a, b, c, d) {
            this.conversation = new f, this.conversationView = new g({model: this.conversation,appName: b,adminName: c,preview: d}), this.$el.find(a).append(this.conversationView.render().el)
        }, k.prototype.embedLauncher = function(a, b) {
            var c = new h;
            b && this.$el.addClass(n[b]), this.$el.find(a).append(c.render().el)
        }, k.prototype.changeLauncherIcon = function(b) {
            a.each(n, function(a) {
                this.$el.removeClass(a)
            }, this), b && this.$el.addClass(n[b])
        }, k.prototype.embedLauncherWithPreview = function(a, b, c) {
            var d = new h;
            this.$el.find(a).append(d.render().el), d.addPreview(b, c)
        }, {embed: function(a, c) {
            return b(a).addClass("intercom-reset intercom-embed-container"), new k(a, c)
        },embedForCustomContent: function(a, c) {
            return b(a).addClass("intercom-embed-container"), new k(a, c)
        }}
    }), define("emoji", ["underscore", "exports", "intermoji", "browser"], function(a, b, c, d) {
        "use strict";
        b.sizePx = function() {
            return 16
        }, b.maybeSubstituteWithSpans = function(a, e) {
            return d.features.emoji() ? c.wrapUnicodeEmojiInTitledSpans(b.sizePx(), c.substituteUnicodeForAsciiEmojis(a), e) : c.substituteSpansForEmojis(b.sizePx(), a, e)
        }
    }), define("environment", function() {
        "use strict";
        var a = require("metrics"), b = require("underscore");
        return {runAll: function() {
            var c = [["mixpanel", "mp"], ["olark", "ol"], ["$zopim", "zpm"], ["KM", "km"], ["_cio", "cus"], ["analytics", "sg"]], d = "#?#:";
            a.increment(d + b.filter(b.map(c, function(a) {
                return a[0] in window ? a[1] : ""
            }), function(a) {
                return a.length > 0
            }).join(":"))
        }}
    }), define("features", ["underscore"], function(a) {
        "use strict";
        return {features: {"spa-throttling": ["tx2p130c", "zuahrl6b", "zv1pyb0s", "w2knrl3f", "c5ea3ec6243c3a8164fb702a95a3e61ca193a2cc", "m707r5ky", "fbx44s81", "xn72f8jb", "xplyivn5", "b0catj9i", "s4mb41ak", "vcf876kt"]},initialize: function(a) {
            this.settings = a
        },isEnabled: function(b) {
            return this.settings ? a.include(this.features[b] || {}, this.settings.get("app.id")) || a.include(this.settings.get("app.feature-flags"), b) : !1
        }}
    }), define("i18n", function() {
        "use strict";
        function a(a, b) {
            return a.replace(/{([\s\S]+?)}/g, function(a, c) {
                return b[c]
            })
        }
        var b = require("underscore"), c = require("logger"), d = ["ar", "bg", "bs", "ca", "cs", "da", "de", "de-form", "el", "en", "es", "et", "fi", "fr", "he", "hr", "hu", "id", "it", "ja", "ko", "lt", "lv", "mn", "nb", "nl", "pl", "pt", "ro", "ru", "sl", "sr", "sv", "tr", "vi", "zh-CN", "zh-TW"], e = "en", f = {};
        b.each(d, function(a) {
            f[a] = require("i18n/" + a)
        });
        var g = {translate: function(b, d) {
            var g = f[e];
            if (!g)
                return c.error("Unknown locale '" + e + "'"), "";
            var h = g[b];
            if (!h)
                return c.error("Unknown key '" + b + "' in locale '" + e + "'"), "";
            try {
                return a(h, d)
            } catch (i) {
                return c.error("Interpolation failed for key '" + b + "' in locale '" + e + "'"), ""
            }
            return h
        },setLocales: function(a) {
            f = a
        },setLocale: function(a) {
            e = a
        },getLocales: function() {
            return f
        },getLocale: function() {
            return e
        },isLocaleEnglish: function() {
            return "en" === e
        },isSupportedLocale: function(a) {
            return b.has(f, a)
        }};
        return g
    }), define("i18n/ar", [], function() {
        return {"language-name-en": "Arabic","language-name": "العربية","new-message": "رسالة جديدة","new-comment-placeholder": "إنتظر الرد","new-conversation-placeholder": "إبدأ محادثة","no-conversations": "لا يوجد محادثات",send: "إرسال","powered-by-intercom": "بواسطة إنتركوم",Xs: "الآن",Xm: "منذ {delta} دقيقة",Xh: "منذ {delta} ساعات",Xd: "منذ {delta} أيام",Xw: "منذ {delta} أسابيع",you: "أنت",delivered: "وصلت","anonymous-email-response": "شكرًا لك، سوف نُبلغك عبر البريد الإلكتروني ({email}) عند ردنا.","anonymous-email-responder": "دعنا نُبلغك عبر البريد الإلكتروني.","your-email": "بريدك الإلكتروني",sending: "جاري الإرسال",failed: "خطأ، إضغط لإعادة المحاولة",uploading: "جارٍ التحميل",uploaded: "تم التحميل","max-upload-size": "الحد الأقصى للتحميل هو {number} ميجا بايت","insert-emoji": "إدراج رمز تعبيري","send-attachment": "إرسال المرفق","press-enter-to-send": "اضغط Enter للإرسال","not-seen-yet": "لم تتم مشاهدتها بعد",seen: "تمت المشاهدتها","x-says": "{firstName} يقول ...","someone-says": "شخص ما يقول ...","active-in-the-last-x-minutes": "كان نشطًا خلال الـ {minutes} دقائق الأخيرة","active-in-the-last-hour": "آخر نشاط كان منذ ساعة","last-active-one-hour-ago": "آخر نشاط كان منذ ساعة","last-active-x-hours-ago": "آخر نشاط كان منذ {hours} ساعات","last-active-one-day-ago": "آخر نشاط كان أمس","last-active-x-days-ago": "وكان آخر نشاط منذ {days} أيام","last-active-more-than-one-week-ago": "آخر نشاط كان منذ أكثر من أسبوع","message-autoresponse": "سوف نُبلغك هنا عند ردّنا.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "استقبل تحديثات هذه المحادثة عبر البريد الإلكتروني","team-will-reply-asap": "سيرُد الفريق عليك في أقرب وقت ممكن.","check-back-or-email": "ألقِ نظرة هنا في وقت لاحق أو سيقومون بمراسلتك عبر البريد الإلكتروني {email} إذا كنت غير متواجد."}
    }), define("i18n/bg", [], function() {
        return {"language-name-en": "Bulgarian","language-name": "Български","new-message": "Нова дискусия","new-comment-placeholder": "Напиши отговор&hellip;","new-conversation-placeholder": "Започни дискусия&hellip;","no-conversations": "Няма дискусии",send: "Изпрати","powered-by-intercom": "Powered by Intercom",Xs: "Преди малко",Xm: "преди {delta}мин.",Xh: "преди {delta}часа",Xd: "преди {delta}дни",Xw: "преди {delta}седмици",you: "You",delivered: "Доставено","anonymous-email-response": "Блгодаря, ще ви съобщим по имейл ({email}) когато отговорим","anonymous-email-responder": "Нека да ви уведомим по имейл.","your-email": "Вашият имейл",sending: "Изпраща се&hellip;",failed: "Не е доставено. Кликнете за да опитате отново.",uploading: "Качва се",uploaded: "Качено","max-upload-size": "Максималния размер за качване е {number}MB","insert-emoji": "Въведи емотикон","send-attachment": "Изпрати прикачен файл","press-enter-to-send": "Натиснете Enter за да изпратите","not-seen-yet": "Не е видяно все още",seen: "Видяно","x-says": "{firstName} казва...","someone-says": "Някой казва...","active-in-the-last-x-minutes": "Активен през последните {minutes} минути","active-in-the-last-hour": "Активен през последния час","last-active-one-hour-ago": "Последно активен преди 1 час","last-active-x-hours-ago": "Последно кативен преди {hours} часа","last-active-one-day-ago": "Последно активен вчера","last-active-x-days-ago": "Последно активен преди {days} дни","last-active-more-than-one-week-ago": "Последно активен преди 1 седмица","message-autoresponse": "Ще ви уведомим, когато отгооврим.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "","team-will-reply-asap": "","check-back-or-email": ""}
    }), define("i18n/bs", [], function() {
        return {"language-name-en": "Bosnian","language-name": "Bosanski","new-message": "Nova poruka","new-comment-placeholder": "Napiši odovor&hellip;","new-conversation-placeholder": "Započni razgovor&hellip;","no-conversations": "Nema razgovora",send: "Pošalji","powered-by-intercom": "Powered by Intercom",Xs: "Upravo sada",Xm: "{delta}m prije",Xh: "{delta}h prije",Xd: "{delta}d prije",Xw: "{delta}sedm. prije",you: "Vi",delivered: "Isporučena","anonymous-email-response": "Hvala, mi ćemo vas obavijestiti putem e-maila ({email}) kad odgovorimo.","anonymous-email-responder": "Dozvolite da vas obavijestimo putem e-maila.","your-email": "Vaš e-mail",sending: "Slanje&hellip;",failed: "Nije isporučena. Kliknite da pokušate ponovo.",uploading: "Snimanje",uploaded: "Snimljeno","max-upload-size": "Maksimalna veličina upload je {number}MB","insert-emoji": "Ubacite Emoji","send-attachment": "Pošalji prilog","press-enter-to-send": "Pritisnite „Enter“ za slanje","not-seen-yet": "Nije još pogledano",seen: "Pogledano","x-says": "{firstName} kaže...","someone-says": "Netko kaže...","active-in-the-last-x-minutes": "Aktivan zadnjih {minutes} minuta","active-in-the-last-hour": "Aktivan je u posljednjih sat vremena","last-active-one-hour-ago": "Zadnji put aktivan: prije 1 sat","last-active-x-hours-ago": "Zadnji put aktivan: prije {hours} sati","last-active-one-day-ago": "Zadnji puta aktivan: jučer","last-active-x-days-ago": "Zadnji put aktivan: {days} dana prije","last-active-more-than-one-week-ago": "Zadnji puta aktivan: prije više od jednog tjedna","message-autoresponse": "Obavijestit ćemo vas nakon što odgovorimo.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "","team-will-reply-asap": "","check-back-or-email": ""}
    }), define("i18n/ca", [], function() {
        return {"language-name-en": "Catalan","language-name": "Català","new-message": "Missatge nou","new-comment-placeholder": "Escriu una resposta&hellip;","new-conversation-placeholder": "Comença una conversa&hellip;","no-conversations": "Sense converses",send: "Enviar","powered-by-intercom": "Powered by Intercom",Xs: "Just ara",Xm: "Fa {delta}m",Xh: "Fa {delta}h",Xd: "Fa {delta}d",Xw: "Fa {delta}set",you: "Tu",delivered: "Entregat","anonymous-email-response": "Gràcies, et notificarem per email ({email}) quan contestem.","anonymous-email-responder": "Deixa'ns el teu correu electrònic i t'informarem.","your-email": "El teu email",sending: "Enviant&hellip;",failed: "No entregat. Pitja per tornar-hi.",uploading: "Pujant",uploaded: "Pujat","max-upload-size": "La mida màxima de càrrega és {number}MB","insert-emoji": "Insertar emogi","send-attachment": "Enviar un afegit","press-enter-to-send": "Prem Entrar per enviar","not-seen-yet": "Sense veure encara",seen: "Vist","x-says": "{firstName} diu...","someone-says": "Algú diu...","active-in-the-last-x-minutes": "Actiu els darrers {minutes} minuts","active-in-the-last-hour": "Actiu per darrera vegada fa 1 hora","last-active-one-hour-ago": "Actiu per darrera vegada fa 1 hora","last-active-x-hours-ago": "Actiu per darrera vegada fa {hours} hores","last-active-one-day-ago": "Actiu per darrera vegada ahir","last-active-x-days-ago": "Actiu per última vegada fa {days} dies","last-active-more-than-one-week-ago": "Actiu per darrera vegada fa més d'una setmana","message-autoresponse": "Et notificarem per aquí quan contestem.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Rebre les novetats d'aquesta conversa per correu electrònic","team-will-reply-asap": "L'equip et respondrà tan aviat com pugui.","check-back-or-email": "Torna a comprovar-ho aquí més tard, o ells t'escriuran un correu a {email} si no hi ets."}
    }), define("i18n/cs", [], function() {
        return {"language-name-en": "Czech","language-name": "Česky","new-message": "Nová zpráva","new-comment-placeholder": "Napsat odpověď&hellip;","new-conversation-placeholder": "Zahájení konverzace&hellip;","no-conversations": "Žádné konverzace",send: "Odeslat","powered-by-intercom": "Powered by Intercom",Xs: "Nyní",Xm: "Před {delta}m",Xh: "Před {delta}h",Xd: "Před {delta}d",Xw: "Před {delta}t",you: "Vy",delivered: "Doručeno","anonymous-email-response": "Děkujeme, až vám odpovíme, budeme vás o tom informovat e-mailem ({email}).","anonymous-email-responder": "Dovolte nám informovat vás e-mailem.","your-email": "Váš e-mail",sending: "Posílá se&hellip;",failed: "Doručení se nezdařilo. Klikněte a zkuste to znovu.",uploading: "Odesílání",uploaded: "Odesláno","max-upload-size": "Maximální velikost odesílaného souboru je {number}MB","insert-emoji": "Vložit emoji","send-attachment": "Poslat přílohu","press-enter-to-send": "","not-seen-yet": "",seen: "","x-says": "","someone-says": "","active-in-the-last-x-minutes": "","active-in-the-last-hour": "","last-active-one-hour-ago": "","last-active-x-hours-ago": "","last-active-one-day-ago": "","last-active-x-days-ago": "","last-active-more-than-one-week-ago": "","message-autoresponse": "","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Dostávat aktualizované příspěvky k této konverzaci prostřednictvím mailu","team-will-reply-asap": "Tým se vám ozve, jakmile bude moct.","check-back-or-email": "Podívejte se sem později, a pokud tu právě nebudete, pošlou vám mail na adresu {email}."}
    }), define("i18n/da", [], function() {
        return {"language-name-en": "Danish","language-name": "Dansk","new-message": "Ny besked","new-comment-placeholder": "Skriv et svar&hellip;","new-conversation-placeholder": "Start en samtale&hellip;","no-conversations": "Ingen samtaler",send: "Send","powered-by-intercom": "Drevet af Intercom",Xs: "Lige nu",Xm: "{delta}m siden",Xh: "{delta}t siden",Xd: "{delta}d siden",Xw: "{delta}u siden",you: "Dig",delivered: "Leveret","anonymous-email-response": "Tak, vi vil lade dig vide via e-mail på ({email}), når vi svarer.","anonymous-email-responder": "Lad os give dig besked via e-mail.","your-email": "Din e-mail",sending: "Sender&hellip;",failed: "Ikke leveret. Klik, for at prøve igen.",uploading: "Uploader",uploaded: "Uploadet","max-upload-size": "Den maksimale uploadstørrelse er {number}MB","insert-emoji": "Indsæt emoji","send-attachment": "Send vedhæftet fil","press-enter-to-send": "Tryk på Enter for at sende","not-seen-yet": "Ikke set endnu",seen: "Set","x-says": "{firstName} siger...","someone-says": "Nogen siger...","active-in-the-last-x-minutes": "Aktiv inden for de sidste {minutes} minutter","active-in-the-last-hour": "Aktiv i den sidste time","last-active-one-hour-ago": "Sidst aktiv 1 time siden","last-active-x-hours-ago": "Sidst aktiv {hours} timer siden","last-active-one-day-ago": "Sidst aktiv i går","last-active-x-days-ago": "Sidste aktiv {days} dage siden","last-active-more-than-one-week-ago": "Sidst aktiv over 1 uge siden","message-autoresponse": "Vi vil give dig besked, når vi svarer.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Modtag opdateringer om denne samtale via e-mail","team-will-reply-asap": "Holdet vil vende tilbage til dig, så snart de kan.","check-back-or-email": "Vend tilbage her senere, eller vent på at modtage en e-mail til {email}, hvis du ikke er tilgængelig."}
    }), define("i18n/de-form", [], function() {
        return {"language-name-en": "German (formal)","language-name": "Deutsch (höflich)","new-message": "Neue Nachricht","new-comment-placeholder": "Antwort schreiben&hellip;","new-conversation-placeholder": "Unterhaltung beginnen&hellip;","no-conversations": "Keine Unterhaltungen",send: "Senden","powered-by-intercom": "Betrieben von Intercom",Xs: "Jetzt",Xm: "vor {delta}m",Xh: "vor {delta}h",Xd: "vor {delta}d",Xw: "vor {delta}w",you: "Sie",delivered: "Zugestellt","anonymous-email-response": "Danke, wir benachrichtigen Sie per E-Mail ({email}), wenn wir antworten.","anonymous-email-responder": "Wir benachrichtigen Sie per E-Mail.","your-email": "Ihre E-Mail-Adresse",sending: "Senden&hellip;",failed: "Nicht zugestellt. Bitte klicken, um es nochmals zu versuchen.",uploading: "Hochladen",uploaded: "Hochgeladen","max-upload-size": "Die maximale Größe zum Hochladen ist {number}MB","insert-emoji": "Emoticon einfügen","send-attachment": "Anhang senden","press-enter-to-send": "Zum Senden ENTER drücken","not-seen-yet": "Noch nicht geöffnet",seen: "Geöffnet","x-says": "{firstName} sagt...","someone-says": "Jemand sagt...","active-in-the-last-x-minutes": "In den letzten {minutes} Minuten aktiv","active-in-the-last-hour": "In den letzten Stunde aktiv","last-active-one-hour-ago": "Vor 1 Stunde das letzte Mal aktiv","last-active-x-hours-ago": "Vor {hours} Stunden das letzte Mal aktiv","last-active-one-day-ago": "Gestern das letzte Mal aktiv","last-active-x-days-ago": "Vor {days} Tagen das letzte Mal aktiv","last-active-more-than-one-week-ago": "Vor über 1 Woche das letzte Mal aktiv","message-autoresponse": "Wir benachrichtigen Sie hier, sobald wir antworten.","median-reply-autoresponse-with-email": "Schauen Sie später wieder vorbei. Falls Sie nicht online sind, schreiben sie Ihnen eine E-Mail an {email}.","median-reply-autoresponse-without-email": "Schauen Sie später wieder vorbei, oder hinterlassen Sie Ihre E-Mail Addresse um benachrichtigt zu werden, falls Sie nicht online sind.","visitor-auto-message-email-collector": "Erhalten Sie E-Mail-Benachrichtigungen bei neuen Nachrichten in diesem Gespräch","team-will-reply-asap": "Das Team wird Ihnen baldmöglichst antworten.","check-back-or-email": "Schauen Sie später wieder vorbei. Falls Sie nicht online sind, schreiben sie Ihnen eine E-Mail an {email}."}
    }), define("i18n/de", [], function() {
        return {"language-name-en": "German","language-name": "Deutsch","new-message": "Neue Nachricht","new-comment-placeholder": "Antwort schreiben&hellip;","new-conversation-placeholder": "Unterhaltung beginnen&hellip;","no-conversations": "Keine Unterhaltungen",send: "Senden","powered-by-intercom": "Betrieben von Intercom",Xs: "Gerade eben",Xm: "vor {delta}m",Xh: "vor {delta}h",Xd: "vor {delta}d",Xw: "vor {delta}w",you: "Du",delivered: "Zugestellt","anonymous-email-response": "Danke, wir benachrichtigen Dich per E-Mail ({email}), wenn wir antworten.","anonymous-email-responder": "Wir benachrichtigen Dich per E-Mail.","your-email": "Deine E-Mail-Adresse",sending: "Senden&hellip;",failed: "Nicht zugestellt. Klicke, um es nochmals zu versuchen.",uploading: "Lädt hoch",uploaded: "Hochgeladen","max-upload-size": "Die maximale Größe zum Hochladen ist {number}MB","insert-emoji": "Emoticon einfügen","send-attachment": "Anhang senden","press-enter-to-send": "Zum Senden ENTER drücken","not-seen-yet": "Noch nicht geöffnet",seen: "Geöffnet","x-says": "{firstName} sagt...","someone-says": "Jemand sagt...","active-in-the-last-x-minutes": "In den letzten {minutes} Minuten aktiv","active-in-the-last-hour": "In den letzten Stunde aktiv","last-active-one-hour-ago": "Vor 1 Stunde das letzte Mal aktiv","last-active-x-hours-ago": "Vor {hours} Stunden das letzte Mal aktiv","last-active-one-day-ago": "Gestern das letzte Mal aktiv","last-active-x-days-ago": "Vor {days} Tagen das letzte Mal aktiv","last-active-more-than-one-week-ago": "Vor über 1 Woche das letzte Mal aktiv","message-autoresponse": "Wir benachrichtigen dich hier, sobald wir antworten.","median-reply-autoresponse-with-email": "Schau später wieder vorbei. Falls du nicht online bist, schreiben sie dir eine E-Mail an {email}.","median-reply-autoresponse-without-email": "Schau später wieder vorbei, oder hinterlasse Deine E-Mail Addresse um benachrichtigt zu werden, falls Du nicht online bist.","visitor-auto-message-email-collector": "Erhalte E-Mail-Benachrichtigungen bei neuen Nachrichten in diesem Gespräch","team-will-reply-asap": "Das Team wird dir baldmöglichst antworten.","check-back-or-email": "Schau später wieder vorbei. Falls du nicht online bist, schreiben sie dir eine E-Mail an {email}."}
    }), define("i18n/el", [], function() {
        return {"language-name-en": "Greek","language-name": "ελληνικά","new-message": "Νέο Μήνυμα","new-comment-placeholder": "Γράψτε μία απάντηση&hellip;","new-conversation-placeholder": "Ξεκινήστε μια συζήτηση&hellip;","no-conversations": "Καμία συνομιλία",send: "Αποστολή","powered-by-intercom": "Υποστηρίζεται από την Intercom",Xs: "Μόλις τώρα",Xm: "{delta}λ πριν",Xh: "{delta}ω πριν",Xd: "{delta}ημ πριν",Xw: "{delta}εβδ πριν",you: "Εσύ",delivered: "Παραδόθηκε","anonymous-email-response": "Ευχαριστούμε, θα λάβετε απάντησή μας με το email ({email}).","anonymous-email-responder": "Θα σας ειδοποιήσουμε με email.","your-email": "Το email σας",sending: "Γίνεται αποστολή&hellip;",failed: "Δεν παραδόθηκε. Κάντε κλικ για να ξαναδοκιμάσετε.",uploading: "Μεταφόρτωση",uploaded: "Μεταφορτώθηκε","max-upload-size": "Το μέγιστο μέγεθος μεταφόρτωσης είναι {number}ΜΒ","insert-emoji": "Εισάγετε emoji","send-attachment": "Στείλτε το συνημμένο","press-enter-to-send": "Πατήστε Enter για αποστολή","not-seen-yet": "Δεν έχει ακόμη αναγνωστεί",seen: "Αναγνώστηκε","x-says": "O/H {firstName} λέει...","someone-says": "Κάποιος λέει...","active-in-the-last-x-minutes": "Ενεργός/ή τα τελευταία {minutes} λεπτά","active-in-the-last-hour": "Τελευταία ενεργός/ή πριν από 1 ώρα","last-active-one-hour-ago": "Τελευταία ενεργός/ή πριν από 1 ώρα","last-active-x-hours-ago": "Τελευταία ενεργός/ή πριν από {hours} ώρες","last-active-one-day-ago": "Τελευταία ενεργός/ή χθες","last-active-x-days-ago": "Τελευταία ενεργός/ή πριν από {days} ημέρες","last-active-more-than-one-week-ago": "Τελευταία ενεργός/ή πριν περισσότερο από 1 εβδομάδα","message-autoresponse": "Θα σας ειδοποιήσουμε εδώ όταν απαντήσουμε.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Λάβετε ενημερώσεις σχετικά με αυτή τη συνομιλία μέσω email","team-will-reply-asap": "Η ομάδα θα επικοινωνήσει μαζί σας το συντομότερο δυνατό.","check-back-or-email": "Ελέγξτε ξανά εδώ αργότερα, διαφορετικά θα σας αποσταλεί email στο {email} αν απουσιάζετε."}
    }), define("i18n/en", [], function() {
        return {"language-name-en": "English","language-name": "English","new-message": "New Conversation","new-comment-placeholder": "Write a reply&hellip;","new-conversation-placeholder": "Start a conversation&hellip;","no-conversations": "No conversations",send: "Send","powered-by-intercom": "Powered by Intercom",Xs: "Just now",Xm: "{delta}m ago",Xh: "{delta}h ago",Xd: "{delta}d ago",Xw: "{delta}w ago",you: "You",delivered: "Delivered","anonymous-email-response": "Thanks, we'll update you here and by email ({email}).","anonymous-email-responder": "Let us notify you by email.","your-email": "Your email",sending: "Sending&hellip;",failed: "Not delivered. Click to try again.",uploading: "Uploading",uploaded: "Uploaded","max-upload-size": "The maximum upload size is {number}MB","insert-emoji": "Insert emoji","send-attachment": "Send attachment","press-enter-to-send": "Press Enter to send","not-seen-yet": "Not seen yet",seen: "Seen","x-says": "{firstName} says...","someone-says": "Someone says...","active-in-the-last-x-minutes": "Active in the last {minutes} minutes","active-in-the-last-hour": "Active in the last hour","last-active-one-hour-ago": "Last active 1 hour ago","last-active-x-hours-ago": "Last active {hours} hours ago","last-active-one-day-ago": "Last active yesterday","last-active-x-days-ago": "Last active {days} days ago","last-active-more-than-one-week-ago": "Last active more than 1 week ago","message-autoresponse": "We'll notify you here when we reply.","median-reply-autoresponse-with-email": "Check back here later, or they'll email you at {email} if you're away.","median-reply-autoresponse-without-email": "Check back here later, or enter your email address to get notified if you're away.","visitor-auto-message-email-collector": "Receive updates on this conversation via email:","team-will-reply-asap": "The team will get back to you as soon as they can.","check-back-or-email": "Check back here later, or they'll email you at {email} if you're away."}
    }), define("i18n/es", [], function() {
        return {"language-name-en": "Spanish","language-name": "Español","new-message": "Nuevo Mensaje","new-comment-placeholder": "Escribir una respuesta&hellip;","new-conversation-placeholder": "Iniciar una conversación&hellip;","no-conversations": "No hay conversaciones",send: "Enviar","powered-by-intercom": "Patrocinado por Intercom",Xs: "Justo ahora",Xm: "hace {delta}m",Xh: "hace {delta}h",Xd: "hace {delta}d",Xw: "hace {delta}sem",you: "Tú",delivered: "Entregado","anonymous-email-response": "Gracias. Te informaremos por correo electrónico ({email}) cuando respondamos.","anonymous-email-responder": "Déjanos tu correo electrónico y te informaremos.","your-email": "Correo electrónico",sending: "Enviando...",failed: "No entregado. Haz clic para volver a intentarlo.",uploading: "Subiendo",uploaded: "Subido","max-upload-size": "El tamaño máximo de subida es {number}MB","insert-emoji": "Insertar emoji","send-attachment": "Enviar adjunto","press-enter-to-send": "Pulsa Entrar para enviar","not-seen-yet": "Aún no se ha visto",seen: "Visto","x-says": "{firstName} dice...","someone-says": "Alguien dice...","active-in-the-last-x-minutes": "Activo los últimos {minutes} minutos","active-in-the-last-hour": "Activo en la última hora","last-active-one-hour-ago": "Activo por última vez hace 1 hora","last-active-x-hours-ago": "Activo por última vez hace {hours} horas","last-active-one-day-ago": "Activo por última vez ayer","last-active-x-days-ago": "Activo por última vez hace {days} dias","last-active-more-than-one-week-ago": "Activo por última vez hace más de una semana","message-autoresponse": "Te notificaremos por aquí cuando contestemos.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Recibe actualizaciones sobre esta conversación por correo electrónico.","team-will-reply-asap": "El equipo se pondrá en contacto contigo en cuanto pueda.","check-back-or-email": "Vuelve más tarde por aquí o se pondrán en contacto contigo por correo electrónico en {email} si estás ausente."}
    }), define("i18n/et", [], function() {
        return {"language-name-en": "Estonian","language-name": "Eesti keel","new-message": "Uus sõnum","new-comment-placeholder": "Kirjuta vastus&hellip;","new-conversation-placeholder": "Alusta uut vestlust&hellip;","no-conversations": "Vestlusi ei ole",send: "Saada","powered-by-intercom": "Teenust pakub Intercom",Xs: "Just nüüd",Xm: "{delta}m eest",Xh: "{delta}t eest",Xd: "{delta}p eest",Xw: "{delta}n eest",you: "Sina",delivered: "Saadetud","anonymous-email-response": "Täname! Teatame su meilile ({email}) oma vastusest","anonymous-email-responder": "Las me saadame sulle meiliga teate.","your-email": "Sinu meiliaadress",sending: "Saadan &hellip;.",failed: "Sõnumi saatmine ebaõnnestus. Klõpsa nupule, et uuesti saata.",uploading: "Laen üles",uploaded: "Üles laetud","max-upload-size": "Maksimaalne üleslaadimise maht on {number}MB","insert-emoji": "Saada emoji","send-attachment": "Saada manus","press-enter-to-send": "Vajuta saatmiseks sisestuklahvi","not-seen-yet": "Ei ole veel vaadatud",seen: "Vaadatud","x-says": "{firstName} ütleb...","someone-says": "Keegi ütleb...","active-in-the-last-x-minutes": "Aktiivne {minutes} minutit","active-in-the-last-hour": "Aktiivne viimase tunni","last-active-one-hour-ago": "Viimati aktiivne 1 tund tagasi","last-active-x-hours-ago": "Viimati aktiivne {hours} tundi tagasi","last-active-one-day-ago": "Viimati aktiivne eile","last-active-x-days-ago": "Viimati aktiivne {days} päeva tagasi","last-active-more-than-one-week-ago": "Viimati aktiivne rohkem kui 1 nädal tagasi","message-autoresponse": "Teatame oma vastusest.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Saa teavitusi selle vestluse kohta meili teel","team-will-reply-asap": "Tiim vastab sulle esimesel võimalusel.","check-back-or-email": "Vaata hiljem siit. Kui oled aga eemal, saadab tiim sulle meili aadressile {email}."}
    }), define("i18n/fi", [], function() {
        return {"language-name-en": "Finnish","language-name": "Finnish","new-message": "Uusi viesti","new-comment-placeholder": "Kirjoita vastaus&hellip;","new-conversation-placeholder": "Aloittaa keskustelun&hellip;","no-conversations": "Ei keskusteluja",send: "Lähetä","powered-by-intercom": "Palvelun tarjoaa Intercom",Xs: "Juuri nyt",Xm: "{delta}m sitten",Xh: "{delta}t sitten",Xd: "{delta}p sitten",Xw: "{delta}vk sitten",you: "Sinä",delivered: "Lähetetty","anonymous-email-response": "Kiitos. Ilmoitamme sähköpostitse ({email}), kun vastaamme viestiisi.","anonymous-email-responder": "Salli sähköposti-ilmoituksen lähettäminen.","your-email": "Sähköpostiosoitteesi",sending: "Lähetetään&hellip;",failed: "Lähettäminen epäonnistui. Yritä uudestaan napsauttamalla.",uploading: "Ladataan",uploaded: "Ladattu","max-upload-size": "Palvelimelle ladattavan tiedoston kokorajoitus on {number}Mt","insert-emoji": "Lisää emoji","send-attachment": "Lähetä liitetiedosto","press-enter-to-send": "Lähetä painamalla Enter","not-seen-yet": "Ei nähty",seen: "Nähty","x-says": "{firstName} sanoo...","someone-says": "Joku sanoo...","active-in-the-last-x-minutes": "Aktiivinen {minutes} minuuttia sitten","active-in-the-last-hour": "Aktiivinen viimeisen tunnin aikana","last-active-one-hour-ago": "Aktiivinen tunti sitten","last-active-x-hours-ago": "Aktiivinen {hours} tuntia sitten","last-active-one-day-ago": "Aktiivinen eilen","last-active-x-days-ago": "Aktiivinen {days} päivää sitten","last-active-more-than-one-week-ago": "Aktiivinen yli viikko sitten","message-autoresponse": "Ilmoitamme tässä, kun vastaamme viestiisi.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Vastaanota keskustelun päivitykset sähköpostilla","team-will-reply-asap": "Tiimi ottaa sinuun yhteyttä niin pian kuin mahdollista.","check-back-or-email": "Käväise paikalla myöhemmin. Jos olet poissa, saat sähköpostin osoitteeseen {email}."}
    }), define("i18n/fr", [], function() {
        return {"language-name-en": "French","language-name": "Français","new-message": "Nouveau message","new-comment-placeholder": "Ecrire une réponse&hellip;","new-conversation-placeholder": "Démarrez une conversation&hellip;","no-conversations": "Aucune conversation",send: "Envoyer","powered-by-intercom": "Propulsé par Intercom",Xs: "À l'instant",Xm: "Il y a {delta} min",Xh: "Il y a {delta}h",Xd: "Il y a {delta}j",Xw: "Il y a {delta} sem",you: "Vous",delivered: "Livré","anonymous-email-response": "Merci, nous vous préviendrons par e-mail ({email}) lorsque nous vous répondons.","anonymous-email-responder": "Laissez-nous vous prévenir par e-mail.","your-email": "Votre e-mail",sending: "Envoi en cours&hellip;",failed: "Non livré. Cliquez pour réessayer.",uploading: "Téléversement",uploaded: "Téléversé","max-upload-size": "La taille maximale de téléversement est de {number}Mo","insert-emoji": "Insérer une émoticône","send-attachment": "Envoyer une pièce jointe","press-enter-to-send": "Appuyez sur Entrée pour envoyer","not-seen-yet": "Pas encore vu",seen: "Vu","x-says": "{firstName} dit...","someone-says": "Quelqu'un dit...","active-in-the-last-x-minutes": "Actifs dans les {minutes} dernières minutes","active-in-the-last-hour": "Actifs dans la dernière heure","last-active-one-hour-ago": "Dernière activité il y a 1 heure","last-active-x-hours-ago": "Dernière activité il y a {hours} heures","last-active-one-day-ago": "Dernière activité hier","last-active-x-days-ago": "Dernière activité il y a {days} jours","last-active-more-than-one-week-ago": "Dernière activité il y a plus de 1 semaine","message-autoresponse": "Nous vous préviendrons ici lorsque nous vous répondrons.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Recevoir des mises à jour sur cette conversation par e-mail","team-will-reply-asap": "L'équipe vous répondra dès que possible.","check-back-or-email": "Revenez plus tard ou on vous enverra un e-mail à l'adresse {email} si vous êtes absent(e)."}
    }), define("i18n/he", [], function() {
        return {"language-name-en": "Hebrew","language-name": "עברית","new-message": "הודעה חדשה","new-comment-placeholder": "&hellip; כתוב את התשובה","new-conversation-placeholder": "&hellip; הודעה חדשה","no-conversations": "אין שיחות",send: "שליחה","powered-by-intercom": "מופעל על ידי Intercom",Xs: "רק עכשיו",Xm: "לפני {delta} דקות",Xh: "לפני {delta} שעות",Xd: "לפני {delta} ימים",Xw: "לפני {delta} שבועות",you: "אתם",delivered: "נמסר","anonymous-email-response": "תודה, נודיע לך באמצעות הדוא'ל ({email}) כאשר ישלח מענה.","anonymous-email-responder": "אפשרי לנו לידע אותך באמצעות דוא'ל.","your-email": "הדוא'ל שלך",sending: "שולח&hellip;",failed: "לא נמסר. הקש/י לנסות שוב.",uploading: "מעלה",uploaded: "הועלה","max-upload-size": "הגודל המקסימלי להעלאה הוא {number}MB","insert-emoji": "הוספת אמוג'י","send-attachment": "שליחת קובץ מצורף","press-enter-to-send": "לשליחה לחץ על Enter","not-seen-yet": "עדיין לא נצפה",seen: "נצפה","x-says": "{firstName} אומר...","someone-says": "מישהו אומר...","active-in-the-last-x-minutes": "פעילות ב-{minutes} הדקות האחרונות","active-in-the-last-hour": "פעיל בשעה האחרונה","last-active-one-hour-ago": "פעילות אחרונה לפני שעה אחת","last-active-x-hours-ago": "פעילות אחרונה לפני {hours} שעות","last-active-one-day-ago": "פעילות אחרונה אתמול","last-active-x-days-ago": "הפעילות אחרונה ימים {days}","last-active-more-than-one-week-ago": "פעילות אחרונה לפני יותר משבוע","message-autoresponse": "נודיע לך כאן כשתתקבל תשובה.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": 'קבלת עדכונים בדוא"ל אודות שיחה זו',"team-will-reply-asap": "הצוות יחזור אליכם בהקדם האפשרי.","check-back-or-email": 'בדקו כאן שוב מאוחר יותר או שהם ישלחו לכם דוא"ל ל-{email} אם אתם לא מחוברים.'}
    }), define("i18n/hr", [], function() {
        return {"language-name-en": "Croatian","language-name": "Hrvatski","new-message": "Nova poruka","new-comment-placeholder": "Napiši odovor&hellip;","new-conversation-placeholder": "Započni razgovor&hellip;","no-conversations": "Nema razgovora",send: "Pošalji","powered-by-intercom": "Powered by Intercom",Xs: "Upravo sada",Xm: "{delta}m prije",Xh: "{delta}h prije",Xd: "{delta}d prije",Xw: "{delta}tjed. prije",you: "Vi",delivered: "Isporučeno","anonymous-email-response": "Hvala, obavijestit ćemo vas e-poštom ({email}) kad odgovorimo.","anonymous-email-responder": "Željeli bismo vas obavijestiti e-poštom.","your-email": "Vaša e-pošta",sending: "Slanje&hellip;",failed: "Nije isporučeno. Kliknite za ponovni pokušaj.",uploading: "Prenošenje&hellip;",uploaded: "Prenešeno","max-upload-size": "Maksimalna veličina prijenosa je {number}MB","insert-emoji": "Umetni emoji","send-attachment": "Pošalji privitak","press-enter-to-send": "Pritisnite „Enter“ za slanje","not-seen-yet": "Nije još pogledano",seen: "Pogledano","x-says": "{firstName} kaže...","someone-says": "Netko kaže...","active-in-the-last-x-minutes": "Aktivan zadnjih {minutes} minuta","active-in-the-last-hour": "Aktivan je u posljednjih sat vremena","last-active-one-hour-ago": "Zadnji put aktivan: prije 1 sat","last-active-x-hours-ago": "Zadnji put aktivan: prije {hours} sati","last-active-one-day-ago": "Zadnji puta aktivan: jučer","last-active-x-days-ago": "Zadnji put aktivan: {days} dana prije","last-active-more-than-one-week-ago": "Zadnji puta aktivan: prije više od jednog tjedna","message-autoresponse": "Obavijestit ćemo vas nakon što odgovorimo.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Primajte ažuriranja o ovom razgovoru e-poštom","team-will-reply-asap": "Tim će vam se javiti u što kraćem roku.","check-back-or-email": "Provjerite poslije ovdje ili, ako ste odsutni, pričekajte da vam se jave na adresu {email}."}
    }), define("i18n/hu", [], function() {
        return {"language-name-en": "Hungarian","language-name": "Magyar","new-message": "Új üzenet","new-comment-placeholder": "Írj egy választ&hellip;","new-conversation-placeholder": "Indítsunk el egy beszélgetést&hellip;","no-conversations": "Nincsenek párbeszédek",send: "Küld","powered-by-intercom": "Technológia: Intercom",Xs: "Csak most",Xm: "{delta}p",Xh: "{delta}ó",Xd: "{delta}n",Xw: "{delta}h",you: "Te",delivered: "Kézbesítve","anonymous-email-response": "Köszönjük. A válaszról e-mailben ({email}) értesítünk.","anonymous-email-responder": "Kérj e-mail értesítést.","your-email": "E-mail címed",sending: "Küldés&hellip;",failed: "Küldés sikertelen. Kattints, hogy újból megpróbáljuk.",uploading: "Feltöltés",uploaded: "Feltöltve","max-upload-size": "A feltölthető fájl maximális mérete {number}MB","insert-emoji": "Szmájli beszúrása","send-attachment": "Csatolmány küldése","press-enter-to-send": "Küldéshez nyomd meg az Enter billentyűt","not-seen-yet": "Még nem látta",seen: "Látta","x-says": "{firstName} szerint...","someone-says": "Valaki szerint...","active-in-the-last-x-minutes": "Aktív az elmúlt {minutes} percben","active-in-the-last-hour": "Aktív az elmúlt órában","last-active-one-hour-ago": "Legutóbb aktív: 1 órája","last-active-x-hours-ago": "Legutóbb aktív: {hours} órája","last-active-one-day-ago": "Legutóbb aktív: tegnap","last-active-x-days-ago": "Legutóbb aktív: {days} nappal ezelőtt","last-active-more-than-one-week-ago": "Legutóbb aktív: több mint 1 hete","message-autoresponse": "A válaszunkról itt értesítünk.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "E-mail értesítés a beszélgetés frissüléséről","team-will-reply-asap": "Csapatunk amint tud, válaszol Önnek.","check-back-or-email": "Nézzen vissza később, vagy ha nincs itt, e-mailt küldünk Önnek a következő címre: {email}."}
    }), define("i18n/id", [], function() {
        return {"language-name-en": "Bahasa","language-name": "Bahasa","new-message": "Chat Baru","new-comment-placeholder": "Ketik reply&hellip;","new-conversation-placeholder": "Mulai percakapan&hellip;","no-conversations": "Belum ada percakapan",send: "Send","powered-by-intercom": "Powered by Intercom",Xs: "Baru saja",Xm: "{delta} menit yang lalu",Xh: "{delta} jam yang lalu",Xd: "{delta} hari yang lalu",Xw: "{delta} minggu yang lalu",you: "Anda",delivered: "Terkirim","anonymous-email-response": "Terima kasih, Anda akan mendapat kabar dari kami lewat email ({email}) setelah kami mengirim jawaban.","anonymous-email-responder": "Harap perbolehkan kami untuk mengabari Anda lewat email.","your-email": "Email Anda",sending: "Sedang mengirim&hellip;",failed: "Tidak terkirim. Harap klik untuk mencoba sekali lagi.",uploading: "Uploading",uploaded: "Uploaded","max-upload-size": "Ukuran upload maksimal adalah {number}MB","insert-emoji": "Masukkan emoji","send-attachment": "Kirim lampiran","press-enter-to-send": "Tekan Enter untuk mengirim","not-seen-yet": "Belum terlihat",seen: "Terlihat","x-says": "{firstName} mengatakan...","someone-says": "Seseorang mengatakan...","active-in-the-last-x-minutes": "Aktif dalam {minutes} menit","active-in-the-last-hour": "Aktif dalam 1 jam yang lalu","last-active-one-hour-ago": "Terakhir aktif 1 jam yang lalu","last-active-x-hours-ago": "Terakhir aktif {hours} jam yang lalu","last-active-one-day-ago": "Terakhir aktif kemarin","last-active-x-days-ago": "Terakhir aktif {days} hari yang lalu","last-active-more-than-one-week-ago": "Terakhir aktif lebih dari 1 minggu yang lalu","message-autoresponse": "Anda akan mendapat kabar dari kami di sini ketika kami menjawab.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "","team-will-reply-asap": "","check-back-or-email": ""}
    }), define("i18n/it", [], function() {
        return {"language-name-en": "Italian","language-name": "Italiano","new-message": "Nuovo messaggio","new-comment-placeholder": "Scrivi una risposta&hellip;","new-conversation-placeholder": "Inizia una conversazione&hellip;","no-conversations": "Nessuna conversazione",send: "Invia","powered-by-intercom": "Powered by Intercom",Xs: "In questo istante",Xm: "{delta}m fa",Xh: "{delta}h fa",Xd: "{delta}d fa",Xw: "{delta}sem fa",you: "Tu",delivered: "Consegnato","anonymous-email-response": "Grazie. Ti invieremo una notifica non appena risponderemo tramite email all'indirizzo ({email}).","anonymous-email-responder": "Ricevi una email di notifica.","your-email": "La tua email",sending: "Invio in corso&hellip;",failed: "Non inviato. Clicca per riprovare.",uploading: "Caricamento",uploaded: "Caricato","max-upload-size": "Limite massimo di caricamento: {number}MB","insert-emoji": "Inserisci emoji","send-attachment": "Invia l'allegato","press-enter-to-send": "Premi Invio per inviare","not-seen-yet": "Non ancora visualizzato",seen: "Visualizzato","x-says": "{firstName} dice...","someone-says": "Qualcuno dice...","active-in-the-last-x-minutes": "Ultima attività negli ultimi {minutes} minuti","active-in-the-last-hour": "Ultima attività: nelle ultime ora","last-active-one-hour-ago": "Ultima attività: 1 ora fa","last-active-x-hours-ago": "Ultima attività: {hours} ore fa","last-active-one-day-ago": "Ultima attività: ieri","last-active-x-days-ago": "Ultima attività: {days} giorni fa","last-active-more-than-one-week-ago": "Ultima attività: più di 1 settimana fa","message-autoresponse": "Quando risponderemo, riceverai una notifica qui.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Ricevi aggiornamenti su questa conversazione tramite e-mail","team-will-reply-asap": "Riceverai una risposta da parte del team non appena possibile.","check-back-or-email": "Controlla qui tra un po' oppure, se non ci sei, riceverai un'e-mail all'indirizzo {email}."}
    }), define("i18n/ja", [], function() {
        return {"language-name-en": "Japanese","language-name": "日本の","new-message": "新しいメッセージ","new-comment-placeholder": "返信を書く&hellip;","new-conversation-placeholder": "会話を始める&hellip;","no-conversations": "会話なし",send: "送信","powered-by-intercom": "Intercom により稼働しています",Xs: "数秒",Xm: "{delta}分前",Xh: "{delta}時間前",Xd: "{delta}日前",Xw: "{delta}週間前",you: "お客様",delivered: "配信済み","anonymous-email-response": "ありがとうございます。返信時にはこちらからメール({email})に通知します。","anonymous-email-responder": "メールで通知させてください。","your-email": "あなたのメール",sending: "送信中&hellip;",failed: "送信されませんでした。クリックして再度お試しください。",uploading: "アップロード中",uploaded: "アップロード済み","max-upload-size": "アップロードできるサイズの上限は{number}MBです","insert-emoji": "絵文字を挿入する","send-attachment": "添付を送信する","press-enter-to-send": "Enterキーを押して送信してください","not-seen-yet": "まだ閲覧されていません",seen: "閲覧済み","x-says": "{firstName}さんが言っています...","someone-says": "誰かが言っています...","active-in-the-last-x-minutes": "{minutes}分前からオンライン","active-in-the-last-hour": "最後の時間でアクティブ","last-active-one-hour-ago": "最終オンライン時: 1時間前","last-active-x-hours-ago": "最終オンライン時: {hours}時間前","last-active-one-day-ago": "最終オンライン時: 昨日","last-active-x-days-ago": "最終オンライン時: {days}日前","last-active-more-than-one-week-ago": "最終オンライン時: 1週間以上前","message-autoresponse": "返信時にはこちらか通知します。","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "この会話についての最新情報をメールで受け取る","team-will-reply-asap": "当社チームができるだけすぐにお返事いたします。","check-back-or-email": "後ほどこちらから再度確認してください。あなたがいない場合は、{email}にメールが届きます。"}
    }), define("i18n/ko", [], function() {
        return {"language-name-en": "Korean","language-name": "한국어","new-message": "새 메시지","new-comment-placeholder": "답변 작성하기&hellip;","new-conversation-placeholder": "대화 시작하기&hellip;","no-conversations": "대화 없음",send: "전송","powered-by-intercom": "Intercom 제공",Xs: "방금",Xm: "{delta} 분 전",Xh: "{delta} 시간 전",Xd: "{delta} 일 전",Xw: "{delta} 주 전",you: "나",delivered: "전달됨","anonymous-email-response": "감사합니다. 답장을 할 때 이메일({email})로 알려드리겠습니다.","anonymous-email-responder": "이메일로 알려드리겠습니다.","your-email": "이메일",sending: "전송 중&hellip;",failed: "전송 실패. 다시 시도하시려면 클릭하세요.",uploading: "업로드 중",uploaded: "업로드 완료","max-upload-size": "업로드 가능한 최대 크기는 {number}MB입니다.","insert-emoji": "에모지 삽입","send-attachment": "첨부파일 전송","press-enter-to-send": "엔터 키를 눌러 전송하세요.","not-seen-yet": "아직 읽지 않음",seen: "읽음","x-says": "{firstName}님의 메시지...","someone-says": "누군가의 메시지...","active-in-the-last-x-minutes": "마지막 접속 {minutes}분 전","active-in-the-last-hour": "마지막 접속 1시간 전","last-active-one-hour-ago": "마지막 접속 1시간 전","last-active-x-hours-ago": "마지막 접속 {hours}시간 전","last-active-one-day-ago": "마지막 접속 어제","last-active-x-days-ago": "마지막 접속 {days}일 전","last-active-more-than-one-week-ago": "마지막 접속 1주일 전","message-autoresponse": "저희가 답변하면 여기에서 알림을 확인하실 수 있습니다.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "이 대화의 업데이트 내용을 이메일로 받기","team-will-reply-asap": "가능한 빨리 팀이 답변을 드립니다.","check-back-or-email": "나중에 여기에서 확인해보세요. 부재중일 경우, {email}으로 이메일이 발송됩니다."}
    }), define("i18n/lt", [], function() {
        return {"language-name-en": "Lithuanian","language-name": "Lietuvių kalba","new-message": "Nauja žinutė","new-comment-placeholder": "Atsakyti&hellip;","new-conversation-placeholder": "Pradėti pokalbį&hellip;","no-conversations": "Nėra pokalbių",send: "Siųsti","powered-by-intercom": "Sukurta Intercom",Xs: "Ką tik",Xm: "prieš {delta}m",Xh: "prieš {delta}v",Xd: "prieš {delta}d",Xw: "prieš {delta}s",you: "Tu",delivered: "Pristatyta","anonymous-email-response": "Ačiū. Apie atsakymą pranešime el. paštu.","anonymous-email-responder": "Leiskite pranešti el. paštu.","your-email": "Jūsų el. paštas",sending: "Siunčiama&hellip;",failed: "Nepristatyta. Spustelėkite, kad pabandytume dar kartą.",uploading: "Keliama",uploaded: "Įkelta","max-upload-size": "Maksimalus leistinas failo dydis – {number}MB","insert-emoji": "Įterpkite šypsniuką","send-attachment": "Siųskite priedą","press-enter-to-send": "Paspauskite „Enter“, kad išsiųstumėte","not-seen-yet": "Dar nepamatyta.",seen: "Pamatyta.","x-says": "{firstName} sako...","someone-says": "Kažkas sako...","active-in-the-last-x-minutes": "Aktyvus per paskutines {minutes} minutes","active-in-the-last-hour": "Aktyvus paskutinę valandą","last-active-one-hour-ago": "Paskutinį kartą aktyvus prieš 1 valandą","last-active-x-hours-ago": "Paskutinį kartą aktyvus prieš {hours} valandas","last-active-one-day-ago": "Paskutinį kartą aktyvus vakar","last-active-x-days-ago": "Paskutinį kartą aktyvus prieš {days} dienas","last-active-more-than-one-week-ago": "Paskutinį kartą aktyvus daugiau nei prieš 1 savaitę","message-autoresponse": "Atsakydami jums pranešime.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Gaukite informaciją apie šį pokalbį elektroniniu paštu","team-will-reply-asap": "Komanda Jums atsakys kai tik galės.","check-back-or-email": "Grįžkite vėliau arba, jei nepasiliksite, gausite elektroninį laišką adresu {email}."}
    }), define("i18n/lv", [], function() {
        return {"language-name-en": "Latvian","language-name": "Latviešu","new-message": "Jauna ziņa","new-comment-placeholder": "Rakstīt atbildi&hellip;","new-conversation-placeholder": "Uzsākt sarunu&hellip;","no-conversations": "Nav ziņas",send: "Sūtīt","powered-by-intercom": "Nodrošina Intercom",Xs: "Tikko",Xm: "pirms {delta}m",Xh: "pirms {delta}s",Xd: "pirms {delta}d",Xw: "pirms {delta}n",you: "Tu",delivered: "Nosūtīts","anonymous-email-response": "Mēs jūs informēsim pa e-pastu ({email}), kad mūsu ziņojums būs nosūtīts.","anonymous-email-responder": "Mēs informēsim Jūs pa e-pastu.","your-email": "Jūsu e-pasts",sending: "Nosūta&hellip;",failed: "Nav nosūtīts. Uzklišķiniet vēlreiz.",uploading: "Augšupielādē",uploaded: "Augšupielādēts","max-upload-size": "Maksimālais augšupielādes lielums ir {number}MB","insert-emoji": "Ievietot emocijzīmes","send-attachment": "Nosūtīt pielikumu","press-enter-to-send": "Nospiediet Enter, lai nosūtītu","not-seen-yet": "Vēl nav apskatīts",seen: "Apskatīts","x-says": "{firstName} saka...","someone-says": "Kāds saka...","active-in-the-last-x-minutes": "Aktīvs pēdējās {minutes} minūtēs","active-in-the-last-hour": "Aktīvs pēdējās stundas","last-active-one-hour-ago": "Pēdējoreiz aktīvs pirms 1 stundas","last-active-x-hours-ago": "Pēdējoreiz aktīvs pirms {hours} stundām","last-active-one-day-ago": "Pēdējoreiz aktīvs vakar","last-active-x-days-ago": "Pēdējoreiz aktīvs pirms {days} dienas","last-active-more-than-one-week-ago": "Pēdējoreiz aktīvs pirms vairāk nekā 1 nedēļas","message-autoresponse": "Mēs jūs informēsim, kad būsim nosūtījuši atbildi.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Saņemiet jaunāko informāciju par šo saraksti pa e-pastu","team-will-reply-asap": "Komandas loceklis sazināsies ar Jums, cik ātri vien iespējams.","check-back-or-email": "Mēģiniet vēlāk, vai Jums tiks nosūtīts e-pasts uz {email} Jūsu prombūtnes laikā."}
    }), define("i18n/mn", [], function() {
        return {"language-name-en": "Mongolian","language-name": "Монгол","new-message": "Шинэ Зурвас","new-comment-placeholder": "Хариу бичих&hellip;","new-conversation-placeholder": "Яриа эхлэх&hellip;","no-conversations": "Ямар ч яриа",send: "Илгээх","powered-by-intercom": "Intercom зайтай",Xs: "Яг одоо",Xm: "{delta} минут өмнө",Xh: "{delta} цагийн өмнө",Xd: "{delta} өдрийн өмнө",Xw: "{delta} долоо хоногийн өмнө",you: "Та",delivered: "Хүргэсэн","anonymous-email-response": "Баярлалаа, бид танд э-мэйл ({email})-ээр хариу мэдэгдэх болно.","anonymous-email-responder": "Танд э-мэйлээр мэдэгдье.","your-email": "Таны э-мэйл",sending: "Илгээж байна&hellip;",failed: "Очсонгүй. Дахин дарж оролдоно уу.",uploading: "Байршуулж байна",uploaded: "Байршууллаа","max-upload-size": "Байршуулах файлын дээд хэмжээ {number}MB.","insert-emoji": "Эможи оруулах","send-attachment": "Хавсралт илгээх","press-enter-to-send": "","not-seen-yet": "",seen: "","x-says": "","someone-says": "","active-in-the-last-x-minutes": "","active-in-the-last-hour": "","last-active-one-hour-ago": "","last-active-x-hours-ago": "","last-active-one-day-ago": "","last-active-x-days-ago": "","last-active-more-than-one-week-ago": "","message-autoresponse": "","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Имэйлээр энэ ярианы тухай шинэ мэдээллийг хүлээн авах","team-will-reply-asap": "Тус баг тантай аль болох хурдан холбоо барина.","check-back-or-email": "Та дараа үүнийг шалгана уу эсвэл таныг хол байвал {email} хаягаар танд имэйл илгээнэ."}
    }), define("i18n/nb", [], function() {
        return {"language-name-en": "Norwegian Bokmål","language-name": "Norsk","new-message": "Ny melding","new-comment-placeholder": "Skriv et svar&hellip;","new-conversation-placeholder": "Start en samtale&hellip;","no-conversations": "Ingen samtaler","admin-from-app": "{adminFirstName} fra {appName}",send: "Send","powered-by-intercom": "Levert av Intercom",Xs: "Noen sekunder",Xm: "{delta}m",Xh: "{delta}t",Xd: "{delta}d",Xw: "{delta}u",you: "Du",delivered: "Levert","anonymous-email-response": "Takk. Vi varsler deg via e-post ({email}) når vi svarer.","anonymous-email-responder": "La oss varsle deg via e-post.","your-email": "Din e-post",sending: "Sender &hellip;",failed: "Ikke levert. Prøv igjen.",uploading: "Laster opp",uploaded: "Opplastet","max-upload-size": "Maksimal opplastingsstørrelse er {number}MB","insert-emoji": "Sett inn emoji","send-attachment": "Send vedlegg","press-enter-to-send": "Trykk på Enter for å sende","not-seen-yet": "Ikke sett ennå.",seen: "Sett.","x-says": "{firstName} sier...","someone-says": "Noen sa...","active-in-the-last-x-minutes": "Aktiv de siste {minutes} minuttene","active-in-the-last-hour": "Aktiv den siste timen","last-active-one-hour-ago": "Aktiv for 1 time siden","last-active-x-hours-ago": "Sist aktiv for {hours} timer siden","last-active-one-day-ago": "Sist aktiv i går","last-active-x-days-ago": "Sist aktiv for {days} dager siden","last-active-more-than-one-week-ago": "Sist aktiv for over 1 uke siden","message-autoresponse": "Vi varsler deg her når vi svarer.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Motta oppdateringer om denne samtalen via e-post","team-will-reply-asap": "Temaet vil svare deg så snart de kan.","check-back-or-email": "Ta en titt senere. Dersom du er borte, vil de sende deg en e-post til {email}."}
    }), define("i18n/nl", [], function() {
        return {"language-name-en": "Dutch","language-name": "Nederlands","new-message": "Nieuw bericht","new-comment-placeholder": "Schrijf een reactie&hellip;","new-conversation-placeholder": "Begin een gesprek&hellip;","no-conversations": "Geen gesprekken",send: "Stuur","powered-by-intercom": "Powered by Intercom",Xs: "Een paar seconden",Xm: "{delta}m geleden",Xh: "{delta}u geleden",Xd: "{delta}d geleden",Xw: "{delta}w geleden",you: "U",delivered: "Afgeleverd","anonymous-email-response": "Bedankt, we brengen je per e-mail ({email}) op de hoogte wanneer we reageren.","anonymous-email-responder": "Laat ons je per e-mail op de hoogte brengen.","your-email": "Je e-mail",sending: "Aan het verzenden&hellip;",failed: "Niet afgeleverd. Klik om opnieuw te proberen.",uploading: "Aan het uploaden",uploaded: "Geüpload","max-upload-size": "De maximale uploadgrootte is {number}MB","insert-emoji": "Emoji invoegen","send-attachment": "Bijlage verzenden","press-enter-to-send": "Druk op Enter om te versturen","not-seen-yet": "Nog niet bekeken",seen: "Bekeken","x-says": "{firstName} zegt...","someone-says": "Iemand zegt...","active-in-the-last-x-minutes": "In de afgelopen {minutes} minuten actief","active-in-the-last-hour": "In het afgelopen uur actief","last-active-one-hour-ago": "1 uur geleden voor het laatst actief","last-active-x-hours-ago": "{hours} uur geleden voor het laatst actief","last-active-one-day-ago": "Gisteren voor het laatst actief","last-active-x-days-ago": "{days} dagen geleden voor het laatst actief","last-active-more-than-one-week-ago": "Meer dan 1 week geleden voor het laatst actief","message-autoresponse": "We laten het je hier weten als we antwoorden.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Ontvang updates over dit gesprek via e-mail","team-will-reply-asap": "Het team zal zo snel mogelijk contact met je opnemen.","check-back-or-email": "Je kunt hier later terugkomen, of ze sturen je een e-mail naar {email} als je er niet bent."}
    }), define("i18n/pl", [], function() {
        return {"language-name-en": "Polish","language-name": "Polski","new-message": "Nowa wiadomość","new-comment-placeholder": "Napisz odpowiedź&hellip;","new-conversation-placeholder": "Rozpocznij rozmowę&hellip;","no-conversations": "Brak rozmów","admin-from-app": "{adminFirstName} z {appName}",send: "Wyślij","powered-by-intercom": "Obsługa przez Intercom",Xs: "Tylko teraz",Xm: "{delta}m temu",Xh: "{delta}g temu",Xd: "{delta}d temu",Xw: "{delta}t temu",you: "Ty",delivered: "Dostarczono","anonymous-email-response": "Dziękujemy, o odpowiedzi poinformujemy Cię mailowo ({email}).","anonymous-email-responder": "Pozwól nam zawiadamiać Cię przez email.","your-email": "Twój email",sending: "Wysyłanie&hellip;",failed: "Nie dostarczono. Kliknij, aby spróbować ponownie.",uploading: "Ładowanie",uploaded: "Załadowano","max-upload-size": "Maksymalny rozmiar ładowania to {number}MB","insert-emoji": "Wstaw emoji","send-attachment": "Wyślij załącznik","press-enter-to-send": "Wciśnij Enter, aby wysłać","not-seen-yet": "Nieodczytana",seen: "Odczytana","x-says": "{firstName} mówi...","someone-says": "Ktoś mówi...","active-in-the-last-x-minutes": "Aktywny(a) w ciągu ostatnich {minutes} minut","active-in-the-last-hour": "Aktywny(a) w ciągu ostatniej godziny","last-active-one-hour-ago": "Ostatnio aktywny(a) godzinę temu","last-active-x-hours-ago": "Ostatnio aktywny(a) {hours} godzin(y) temu","last-active-one-day-ago": "Ostatnio aktywny(a) wczoraj","last-active-x-days-ago": "Ostatnio aktywny(a) {days} dni temu","last-active-more-than-one-week-ago": "Ostatnio aktywny(a) ponad tydzień temu","message-autoresponse": "Powiadomimy cię o tutaj naszej odpowiedzi.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Informacje o przebiegu tej sprawy możesz dostawać pocztą elektroniczną.","team-will-reply-asap": "Nasz zespół postara się udzielić odpowiedzi jak najszybciej.","check-back-or-email": "Sprawdź później, a jeśli nie będziesz dostępny(a), otrzymasz e-mail na adres {email}."}
    }), define("i18n/pt", [], function() {
        return {"language-name-en": "Portuguese","language-name": "Português","new-message": "Nova Mensagem","new-comment-placeholder": "Escreva uma resposta&hellip;","new-conversation-placeholder": "Iniciar uma conversa&hellip;","no-conversations": "Sem conversas",send: "Enviar","powered-by-intercom": "Fornecido pela Intercom",Xs: "Agora mesmo",Xm: "Há {delta}m",Xh: "Há {delta}h",Xd: "Há {delta}d",Xw: "Há {delta}s",you: "Você",delivered: "Entregue","anonymous-email-response": "Obrigado, irá ser notificado(a) por e-mail ({email}) ao receber a nossa resposta.","anonymous-email-responder": "Permita que o(a) notifiquemos por e-mail.","your-email": "O seu e-mail",sending: "A enviar&hellip;",failed: "Não entregue. Clique para tentar de novo.",uploading: "A carregar&hellip;",uploaded: "Carregado","max-upload-size": "O tamanho de carregamento máximo é {number}MB","insert-emoji": "Inserir emoji","send-attachment": "Enviar anexo","press-enter-to-send": "Prime Enter para enviar","not-seen-yet": "Não lida",seen: "Lida","x-says": "{firstName} diz...","someone-says": "Alguém diz...","active-in-the-last-x-minutes": "Ativo nos últimos {minutes} minutos","active-in-the-last-hour": "Ativo nos últimas hora","last-active-one-hour-ago": "Ativo há 1 hora atrás","last-active-x-hours-ago": "Ativo há {hours} horas atrás","last-active-one-day-ago": "Ativo ontem","last-active-x-days-ago": "Ativo há {days} dias atrás","last-active-more-than-one-week-ago": "Ativo há mais de 1 semana atrás","message-autoresponse": "Vais ser notificado aqui quando nos respondermos.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Receba atualizações sobre esta conversa por e-mail","team-will-reply-asap": "A equipa vai responder-lhe assim que possível.","check-back-or-email": "Volte aqui mais tarde ou espere por e-mail deles para {email} se estiver longe."}
    }), define("i18n/ro", [], function() {
        return {"language-name-en": "Romanian","language-name": "Română","new-message": "Mesaje noi","new-comment-placeholder": "Scrie un raspuns&hellip;","new-conversation-placeholder": "Incepe o conversatie&hellip;","no-conversations": "Fara conversatii","admin-from-app": "{adminFirstName} de la {appName}",send: "Trimite","powered-by-intercom": "Powered by Intercom",Xs: "Chiar acum",Xm: "{delta}m inainte",Xh: "{delta}h inainte",Xd: "{delta}d inainte",Xw: "{delta}s inainte",you: "Tu",delivered: "Trimis","anonymous-email-response": "Mulțumim, te vom notifica prin e-mail ({email}) atunci când răspundem.","anonymous-email-responder": "Permite-ne să te notificăm prin e-mail.","your-email": "E-mailul tău",sending: "Se trimite&hellip;",failed: "Netransmis. Fă clic pentru a încerca din nou.",uploading: "Se încarcă",uploaded: "Încărcat","max-upload-size": "Dimensiunea maximă de încărcare este {number}MB","insert-emoji": "Introducere emoji","send-attachment": "Trimitere atașament","press-enter-to-send": "Apasă Enter pentru a trimite","not-seen-yet": "Nu s-a văzut încă",seen: "Văzut","x-says": "{firstName} scrie...","someone-says": "Cineva scrie...","active-in-the-last-x-minutes": "Activ în ultimele {minutes} minute","active-in-the-last-hour": "Activă în ultimele oră","last-active-one-hour-ago": "Activ acum 1 oră","last-active-x-hours-ago": "Activ acum {hours} ore","last-active-one-day-ago": "Activ ieri","last-active-x-days-ago": "Activ {days} zile în urmă","last-active-more-than-one-week-ago": "Activ acum peste o săptămână","message-autoresponse": "Te vom notifica aici atunci când răspundem.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Primește actualizări la această conversație prin e-mail","team-will-reply-asap": "Echipa te va contacta în cel mai scurt timp posibil.","check-back-or-email": "Revino mai târziu sau îți vor trimite un e-mail la {email} dacă ești plecat."}
    }), define("i18n/ru", [], function() {
        return {"language-name-en": "Russian","language-name": "Русский","new-message": "Новое сообщение","new-comment-placeholder": "Написать ответ&hellip;","new-conversation-placeholder": "Начать разговор&hellip;","no-conversations": "Нет сообщений",send: "Отправить","powered-by-intercom": "На платформе Intercom",Xs: "несколько секунд",Xm: "{delta}m назад",Xh: "{delta}ч назад",Xd: "{delta}д назад",Xw: "{delta}нед назад",you: "Вы",delivered: "Доставлено","anonymous-email-response": "Спасибо, мы уведомим вас об ответе по эл. почте ({email}).","anonymous-email-responder": "Давайте мы уведомим вас по эл. почте.","your-email": "Ваш эл. адрес",sending: "Отправка&hellip;",failed: "Не доставлено. Нажмите, чтобы повторить попытку.",uploading: "Загрузка",uploaded: "Загружено","max-upload-size": "Максимальный размер загружаемого файла ― {number}Мб","insert-emoji": "Вставить эмодзи","send-attachment": "Отправить вложение","press-enter-to-send": "Нажмите Enter для отправки","not-seen-yet": "Еще не просмотрено",seen: "Просмотрено","x-says": "{firstName} говорит...","someone-says": "Кто-то говорит...","active-in-the-last-x-minutes": "Активные в последние {minutes} мин.","active-in-the-last-hour": "Активные в последний час","last-active-one-hour-ago": "Последняя активность 1 час назад","last-active-x-hours-ago": "Последняя активность {hours} ч назад","last-active-one-day-ago": "Последняя активность вчера","last-active-x-days-ago": "Последняя активность {days} дней назад","last-active-more-than-one-week-ago": "Последняя активность более 1 недели назад","message-autoresponse": "Мы уведомим вас здесь об ответе.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Получайте уведомления о новых сообщениях этой беседы по электронной почте","team-will-reply-asap": "Наша команда ответит вам, как только сможет.","check-back-or-email": "Проверьте позже, не появился ли ответ здесь, либо, в случае вашего отсутствия, ответ придет на ваш емейл: {email}"}
    }), define("i18n/sl", [], function() {
        return {"language-name-en": "Slovenian","language-name": "Slovenščina","new-message": "Novo sporočilo","new-comment-placeholder": "Odgovorite&hellip;","new-conversation-placeholder": "Pričnite pogovor&hellip;","no-conversations": "Ni pogovorov","admin-from-app": "{adminFirstName} iz {appName}",send: "Pošlji","powered-by-intercom": "Powered by Intercom",Xs: "Ravnokar",Xm: "{delta}m nazaj",Xh: "{delta}h nazaj",Xd: "{delta}d nazaj",Xw: "{delta}t nazaj",you: "Vi",delivered: "Dostavljeno","anonymous-email-response": "Hvala, ko bomo odgovorili, vas bomo obvestili po e-pošti ({email}).","anonymous-email-responder": "Dovolite, da vas obvestimo po e-pošti.","your-email": "Vaša e-pošta",sending: "Pošiljanje&hellip;",failed: "Ni dostavljeno. Kliknite, če želite znova poskusiti.",uploading: "Prenos",uploaded: "Preneseno","max-upload-size": "Največja velikost prenosa je {number}MB","insert-emoji": "Vstavi smeška","send-attachment": "Pošlji prilogo","press-enter-to-send": "Za pošiljanje pritisnite Enter","not-seen-yet": "Še nevideno",seen: "Videno","x-says": "{firstName} pravi...","someone-says": "Nekdo pravi...","active-in-the-last-x-minutes": "Aktiven v zadnjih {minutes} minutah","active-in-the-last-hour": "Aktiven v zadnjih uro","last-active-one-hour-ago": "Zadnjič aktiven pred 1 uro","last-active-x-hours-ago": "Zadnjič aktiven pred {hours} urami","last-active-one-day-ago": "Zadnjič aktiven včeraj","last-active-x-days-ago": "Zadnjič aktiven pred {days} dnevi","last-active-more-than-one-week-ago": "Zadnjič aktiven pred več kot 1 tednom","message-autoresponse": "Ko bomo odgovorili, vas bomo obvestili tukaj.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Prejmite posodobitve tega pogovora po e-pošti","team-will-reply-asap": "Ekipa se vam bo oglasila takoj, ko bo mogoče.","check-back-or-email": "Preverite kasneje tu, ali pa boste prejeli e-pošto {email}, če boste odsotni."}
    }), define("i18n/sr", [], function() {
        return {"language-name-en": "Serbian","language-name": "Srpski","new-message": "Novi razgovor","new-comment-placeholder": "Napiši odovor&hellip;","new-conversation-placeholder": "Započni razgovor&hellip;","no-conversations": "Nemate razgovora",send: "Pošalji","powered-by-intercom": "Powered by Intercom",Xs: "Upravo sada",Xm: "{delta}m prije",Xh: "{delta}h prije",Xd: "{delta}d prije",Xw: "{delta}sedm. prije",you: "Vi",delivered: "Послато","anonymous-email-response": "Хвала, обавестићемо те поруком ({number}) када будемо одговорили.","anonymous-email-responder": "Омогући нам да те обавестимо поруком.","your-email": "Твоја адреса",sending: "Шаље се&hellip;",failed: "Није послато. Притисни да покушаш поново.",uploading: "Учитава се",uploaded: "Учитано","max-upload-size": "Максимална величина за учитавање је {email}MB","insert-emoji": "Убаци смешка","send-attachment": "Пошаљи прилог","press-enter-to-send": "Притисни ентер да пошаљеш","not-seen-yet": "Још није прегледан",seen: "Прегледан","x-says": "{firstName} каже...","someone-says": "Неко каже...","active-in-the-last-x-minutes": "Активан током последњих {minutes} минута","active-in-the-last-hour": "Активан током последњих сату","last-active-one-hour-ago": "Последњи пут активан пре 1 сат","last-active-x-hours-ago": "Последњи пут активан пре {hours} сата","last-active-one-day-ago": "Последњи пут активан јуче","last-active-x-days-ago": "Последњи пут активан {days} дана","last-active-more-than-one-week-ago": "Последњи пут активан пре више од 1 недеље","message-autoresponse": "Ми ћемо те обавестити овде када одговоримо.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Примите ажурирања у вези ове конверзације електронском поштом","team-will-reply-asap": "Тим ће Вас контактирати чим буде могао.","check-back-or-email": "Вратите се назад да проверите касније или ће Вам послати поруку на {email} ако сте одсутни."}
    }), define("i18n/sv", [], function() {
        return {"language-name-en": "Swedish","language-name": "Svenska","new-message": "Nytt meddelande","new-comment-placeholder": "Skriv ett svar&hellip;","new-conversation-placeholder": "Starta en konversation&hellip;","admin-from-app": "{adminFirstName} från {appName}","no-conversations": "Inga konversationer",send: "Skicka","powered-by-intercom": "Drivs av Intercom",Xs: "Just nu",Xm: "{delta}m sedan",Xh: "{delta}t sedan",Xd: "{delta}d sedan",Xw: "{delta}v sedan",you: "Du",delivered: "Levererat","anonymous-email-response": "Tack, vi meddelar dig via e-post ({email}) när vi svarar.","anonymous-email-responder": "Låt oss meddela dig via e-post.","your-email": "Din e-postadress",sending: "Skickar&hellip;",failed: "Ej levererat. Klicka för att försöka igen.",uploading: "Laddar upp",uploaded: "Uppladdad","max-upload-size": "Maximal uppladdningsstorlek är {number} MB","insert-emoji": "Infoga emoji","send-attachment": "Skicka bifogad fil","press-enter-to-send": "Tryck på Enter för att skicka","not-seen-yet": "Inte visat ännu",seen: "Visat","x-says": "{firstName} säger...","someone-says": "Någon säger...","active-in-the-last-x-minutes": "Aktiv inom de senaste {minutes} minuterna","active-in-the-last-hour": "Aktiv inom de senaste timmen","last-active-one-hour-ago": "Var senast aktiv för 1 timme sedan","last-active-x-hours-ago": "Var senast aktiv för {hours} timmar sedan","last-active-one-day-ago": "Var senast aktiv igår","last-active-x-days-ago": "Var senast aktiv för {days} dagar sedan","last-active-more-than-one-week-ago": "Var senast aktiv för mer än 1 vecka sedan","message-autoresponse": "Vi kommer att meddela dig här när vi svarar.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Få uppdateringar om den här konversationen via e-post","team-will-reply-asap": "Teamet kommer att svara så snabbt de kan.","check-back-or-email": "Ta en titt här senare, eller så får du ett meddelande på {email} om du är någon annanstans."}
    }), define("i18n/tr", [], function() {
        return {"language-name-en": "Turkish","language-name": "Türkçe","new-message": "Yeni Mesaj","new-comment-placeholder": "Bir cevap yazın&hellip;","new-conversation-placeholder": "Bir konuşmayı başlatmak&hellip;","no-conversations": "Sohbet Yok",send: "Gönder","powered-by-intercom": "Intercom tarafından güçlendirilmiştir",Xs: "Birkaç saniye",Xm: "{delta}d önce",Xh: "{delta}s önce",Xd: "{delta}g önce",Xw: "{delta}h önce",you: "Sen",delivered: "İletildi","anonymous-email-response": "Teşekkürler, cevapladığımızda e-posta ile ({email}) seni bu konuda bilgilendireceğiz.","anonymous-email-responder": "Sorunu yanıtladığımızda e-posta ile bilgilendireceğiz.","your-email": "E-posta adresin",sending: "Gönderiliyor&hellip;",failed: "Teslim edilemedi. Tekrar denemek için tıkla.",uploading: "Yükleniyor",uploaded: "Yüklendi","max-upload-size": "Yüklenebilecek maksimum boyut {number}MB","insert-emoji": "Emoji ekle","send-attachment": "Eklenti gönder","press-enter-to-send": "Göndermek için Enter tuşuna bas","not-seen-yet": "Henüz görünmedi",seen: "Göründü","x-says": "{firstName} diyor ki...","someone-says": "Birisi diyor ki...","active-in-the-last-x-minutes": "Son {minutes} dakika içinde etkindi","active-in-the-last-hour": "Son bir saat içinde etkin olan","last-active-one-hour-ago": "En son 1 saat önce etkindi","last-active-x-hours-ago": "En son {hours} saat önce etkindi","last-active-one-day-ago": "En son dün etkindi","last-active-x-days-ago": "En son {days} gün içinde etkindi","last-active-more-than-one-week-ago": "1 haftadan fazla bir süredir etkin değil","message-autoresponse": "Cevap verdiğimizde sana bildirim göndereceğiz.","median-reply-autoresponse-with-email": "Daha sonra kontrol edebilirsiniz yada ekibimizin size {email} adresinden ulaşmasını bekleyebilirsiniz.","median-reply-autoresponse-without-email": "Daha sonra kontrol edebilirsiniz yada bilgilendirilmek için email adresinizi tanımlayabilirsiniz.","visitor-auto-message-email-collector": "Bu sohbetle lgili güncellemeleri e-posta ile alın","team-will-reply-asap": "Ekip, mümkün olan en kısa zamanda size geri dönüş yapacaktır.","check-back-or-email": "Daha sonra buradan tekrar kontrol edin ya da uzaktaysanız size {email} adresinden e-posta gönderirler."}
    }), define("i18n/vi", [], function() {
        return {"language-name-en": "Vietnamese","language-name": "Tiếng Việt","new-message": "Trao đổi mới","new-comment-placeholder": "Trả lời&hellip;","new-conversation-placeholder": "Bắt đầu trao đổi&hellip;","no-conversations": "Chưa có trao đổi",send: "Gửi","powered-by-intercom": "Cung cấp bởi Intercom",Xs: "Mới đây",Xm: "{delta} phút trước",Xh: "{delta} giờ trước",Xd: "{delta} ngày trước",Xw: "{delta} tuần trước",you: "Bạn",delivered: "Đã gửi","anonymous-email-response": "Cám ơn. Khi chúng tôi trả lời, chúng tôi cũng sẽ gửi email ({email}) thông báo.","anonymous-email-responder": "Cho phép chúng tôi thông báo đến bạn qua email.","your-email": "Email",sending: "Đang gửi&hellip;",failed: "Chưa gửi. Bấm để thử gửi lại.",uploading: "Đang tải lên",uploaded: "Đã tải lên","max-upload-size": "Giới hạn dung lượng tải lên là {number}MB","insert-emoji": "Thêm emoji","send-attachment": "Gửi đính kèm","press-enter-to-send": "Bấm Enter để gửi","not-seen-yet": "Chưa được xem",seen: "Đã xem","x-says": "{firstName} nói...","someone-says": "Có người nói...","active-in-the-last-x-minutes": "Có hoạt động trong {minutes} phút vừa rồi","active-in-the-last-hour": "Có hoạt động trong những giờ cuối","last-active-one-hour-ago": "Lần cuối hoạt động 1 giờ trước","last-active-x-hours-ago": "Lần cuối hoạt động {hours} giờ trước","last-active-one-day-ago": "Lần cuối hoạt động ngày hôm qua","last-active-x-days-ago": "Lần cuối hoạt động {hours} ngày trước","last-active-more-than-one-week-ago": "Lần cuối hoạt động hơn 1 tuần trước","message-autoresponse": "Chúng tôi sẽ thông báo cho bạn tại đây khi chúng tôi trả lời.","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "Nhận các cập nhật về cuộc trò chuyện này qua email","team-will-reply-asap": "Nhóm sẽ phản hồi lại bạn nhanh nhất có thể.","check-back-or-email": "Hãy quay lại đây sau, hoặc họ sẽ gửi email cho bạn tới {email} nếu bạn không có mặt."}
    }), define("i18n/zh-CN", [], function() {
        return {"language-name-en": "Chinese (Simplified)","language-name": "中文 (简体)","new-message": "新信息","new-comment-placeholder": "写回复","new-conversation-placeholder": "写信息","no-conversations": "无对话","admin-from-app": "{adminFirstName} 来自 {appName}",send: "送出","powered-by-intercom": "由Intercom提供",Xs: "现在",Xm: "{delta}分钟前",Xh: "{delta}小时前",Xd: "{delta}天前",Xw: "{delta}周前",you: "你",delivered: "已发送","anonymous-email-response": "谢谢！我们回复你的消息时，将会通过电子邮件({email})通知你。","anonymous-email-responder": "允许我们通过电子邮件通知你。","your-email": "你的邮箱地址",sending: "正在发送&hellip;",failed: "没有发送成功。请点击重试。",uploading: "正在上传",uploaded: "已上传","max-upload-size": "最大上传文档大小：{number}MB","insert-emoji": "插入表情符号","send-attachment": "发送附件","press-enter-to-send": "按Enter发送","not-seen-yet": "还未见到",seen: "已见到","x-says": "{firstName}说...","someone-says": "有人说...","active-in-the-last-x-minutes": "最近{minutes}分钟内活跃","active-in-the-last-hour": "最近一次活跃是在1小时前","last-active-one-hour-ago": "最近一次活跃是在1小时前","last-active-x-hours-ago": "最近一次活跃是在{hours}小时前","last-active-one-day-ago": "最近一次活跃是在昨天","last-active-x-days-ago": "最近一次活跃是在{days}天前","last-active-more-than-one-week-ago": "最近一次活跃是在1周以前","message-autoresponse": "回复你的消息时，我们将会在这里通知你。","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "通过电子邮件接收此对话的更新","team-will-reply-asap": "团队会尽快回复您。","check-back-or-email": "稍后回来查看，如果您离开了，他们也会发送电子邮件到{email}。"}
    }), define("i18n/zh-TW", [], function() {
        return {"language-name-en": "Chinese (Traditional)","language-name": "中文（繁體)","new-message": "新訊息","new-comment-placeholder": "輸入回覆","new-conversation-placeholder": "輸入訊息","no-conversations": "無對話",send: "送出","powered-by-intercom": "由 Intercom 提供",Xs: "現在",Xm: "{delta}分鐘前",Xh: "{delta}小時前",Xd: "{delta}天前",Xw: "{delta}週前",you: "您",delivered: "已送出","anonymous-email-response": "謝謝您，我們回覆時會透過電郵 ({email}) 通知您。","anonymous-email-responder": "讓我們透過電郵通知您。","your-email": "您的電郵",sending: "發送中…",failed: "尚未送出。請點擊再試一次。",uploading: "上載中",uploaded: "已上載","max-upload-size": "最多可以上載 {number}MB","insert-emoji": "插入表情符號","send-attachment": "發送附件","press-enter-to-send": "按Enter鍵即可發送","not-seen-yet": "未讀",seen: "已讀","x-says": "{firstName} 說...","someone-says": "某人說...","active-in-the-last-x-minutes": "過去的{minutes}分鐘都在線上","active-in-the-last-hour": "網上的最後一小時","last-active-one-hour-ago": "上次上線時間為1小時前","last-active-x-hours-ago": "上次上線時間為{hours}小時前","last-active-one-day-ago": "上次上線時間為昨天","last-active-x-days-ago": "上次上線時間為{days}天前","last-active-more-than-one-week-ago": "上次上線時間為超過一星期前","message-autoresponse": "我們回覆時會在這裡通知您。","median-reply-autoresponse-with-email": "","median-reply-autoresponse-without-email": "","visitor-auto-message-email-collector": "透過電郵接收這個對話的更新","team-will-reply-asap": "團隊會盡快作出回覆。","check-back-or-email": "請稍後再查看，如果您碰巧離開了，他們會電郵至 {email}。"}
    }), define("idempotency-key", ["exports"], function(a) {
        "use strict";
        a.randomKey = function() {
            return Math.floor(4294967295 * Math.random()).toString(16)
        }, a.keyName = "Idempotency-Key"
    }), define("initials", ["jquery", "underscore"], function(a, b) {
        "use strict";
        return {firstInitial: function(c) {
            return c = a.trim(c), b.isEmpty(c) ? "?" : c[0]
        }}
    }), define("installation", [], function() {
        "use strict";
        var a = require("jquery");
        return {hasInstallationQueryParameter: function() {
            return window.location.search.substring(1).match(/intercom-installation/)
        },isLegacyInstallationMode: function(a) {
            return "object" == typeof a.modules && "object" == typeof a.modules.install
        },listenForInstallationStartMessage: function(b) {
            a(window).off("message.intercom-installation-start").on("message.intercom-installation-start", function(c) {
                a(window).off("message.intercom-installation-start");
                var d = c.originalEvent;
                "installation.start" === d.data && (b(), d.ports[0] ? d.ports[0].postMessage("installation.started") : d.source.postMessage("installation.started", d.origin))
            })
        },showSuccessOverlay: function() {
            a("body").append(this.successOverlay())
        },successOverlay: function() {
            var b = a("<div />", {"class": "intercom-installation-icon"}), c = a("<h1 />", {"class": "intercom-installation-heading",text: "Intercom is successfully installed!"}), d = a("<p />", {"class": "intercom-installation-message",text: "Live user data is now being synced to Intercom."}), e = a("<p />", {"class": "intercom-installation-message",text: "Now you can make Intercom messenger visible by starting a free trial."}), f = a("<button />", {"class": "intercom-installation-button",text: "Next step",click: function() {
                setTimeout(window.close, 300)
            }}), g = a("<div />", {"class": "intercom-installation-content"});
            g.append(b, c, d, e, f);
            var h = a("<div />", {"class": "intercom-installation-arrow"}), i = a("<div />", {"class": "intercom-installation-overlay"});
            return setTimeout(function() {
                a("#intercom-launcher").off("click"), a("#intercom-launcher").off("mouseover")
            }, 1e3), i.append(g, h)
        },fakePingResponse: {modules: {messages: {activator: "#IntercomDefaultWidget",colors: {base: "#0071b2"},features: {inbound_lead_messaging: !0},use_activator: !0}},app: {name: ""}}}
    }), define("intercom", ["sync"], function() {
        "use strict";
        function a(a, d, e, f) {
            this.initialized = !1, this.ready = b.Deferred(), this.client = a, this.nexusClient = d, this.messageMatcher = e, this.refreshConversations = c.bind(this.refreshConversations, this), this.throttledRefreshConversations = c.throttle(this.refreshConversations, y, {leading: !1}), this.settings = f, this.throttledClient = new t(this.client), this.poller = new s(this.client), this.conversations = new p, this.app = new q, b(document).keyup(c.bind(this.onKeyUp, this))
        }
        var b = require("jquery"), c = require("underscore"), d = require("backbone"), e = require("activity-monitor"), f = require("date"), g = require("audio"), h = require("i18n"), i = require("logger"), j = require("cookie"), k = require("mobile-app-detection"), l = require("navigation-events"), m = require("user-notifier"), n = require("activity-responder"), o = require("state-store"), p = require("collections/conversations"), q = require("models/app"), r = require("views/intercom"), s = require("poller"), t = require("throttler"), u = require("environment"), v = require("installation"), w = 864e5, x = 6311e8, y = 6e4;
        return c.extend(a.prototype, d.Events, {initialize: function(a) {
            if (!this.isInitialized()) {
                i.info("intercom - Initializing"), this.settings.update(a || {});
                var b = j.read("intercom-id");
                void 0 !== b && this.settings.update({user: {anonymous_id: b}});
                var d = j.read("intercom-session");
                if (void 0 !== d && this.settings.get("user.anonymous") && this.settings.update({anonymous_session: d}), !this.settings.isValid())
                    return void i.error("intercom - Invalid settings");
                this.nexusClient.addListener("NewComment", c.bind(function(a) {
                    this.trigger("new-comment", a.eventData.conversationId)
                }, this.client)), this.nexusClient.addListener("UserContentSeenByAdmin", c.bind(function(a) {
                    this.trigger("user-content-seen-by-admin", a.eventData.conversationId)
                }, this.client)), this.view = new r({client: this.client,nexusClient: this.nexusClient,settings: this.settings,collection: this.conversations,app: this.app}), this.listenTo(this.client, "ping", this.onPingResponse), this.listenTo(this.client, "new-unread-conversation", this.onUnreadConversationAdded), this.listenTo(this.client, "new-comment", this.onNewComment), this.listenTo(this.client, "user-content-seen-by-admin", this.onUserContentSeenByAdmin), this.listenTo(l, "click:open", this.onLauncherClicked), this.listenTo(l, "click:conversations", this.showConversations), this.listenTo(l, "click:conversation", this.showConversation), this.listenTo(l, "click:new-conversation", this.showNewConversation), this.listenTo(l, "click:new-conversation-no-animation", this.showNewConversationWithoutAnimation), this.listenTo(l, "click:close", this.hide), this.listenTo(l, "click:minimize", this.minimize), u.runAll(), k.run(), this.enableCustomLauncher(), this.throttledClient.reset(), this.poller.start(), e.start(), n.initialize(this.nexusClient), this.initialized = !0, this.createOrUpdateUser()
            }
        },deinitialize: function() {
            this.isInitialized() && (i.info("intercom - Deinitializing"), this.ready.reject(), this.settings.reset(), this.conversations.reset(), this.stopListening(), this.disableCustomLauncher(), this.poller.stop(), e.stop(), o.clear(), j.clear("intercom-session", "all", "/"), this.remove(), this.initialized = !1, this.ready = b.Deferred())
        },createOrUpdateUser: function(a) {
            return this.isInitialized() ? (this.settings.update(a || {}), this.settings.isValid() ? void this.throttledClient.throttledCreateOrUpdateUser() : void i.error("intercom - Invalid settings")) : void 0
        },show: function(a) {
            this.showWhenReady(function() {
                this.view.isMinimized() ? this.maximize(a) : this.view.show(a)
            })
        },showConversations: function() {
            this.showWhenReady(function() {
                this.view.showConversations()
            })
        },showConversation: function(a) {
            this.showWhenReady(function() {
                this.view.showConversation(a)
            })
        },showNewConversation: function(a, b) {
            console.log('-->showNewConversation');
            this.showWhenReady(function() {

                console.log('-->showWhenReady,', b);

                // this.view.isMinimized() && this.maximize();
                this.view.showNewConversation(a, b);
                
                // if (0 === b && (b = !0)) {
                //     console.log('-->0 === b');
                //     this.view.isMinimized() && this.maximize();
                //     this.view.showNewConversation(a, b);
                // }
                
                // void 0 === b && (b = !0),this.view.isMinimized() && this.maximize(),this.view.showNewConversation(a, b)
            })
        },showNewConversationWithoutAnimation: function(a) {
            console.log('-->showNewConversationWithoutAnimation');
            this.showNewConversation(a, !1)
        },autoOpenConversation: function(a) {
            this.showWhenReady(function() {
                this.view.autoOpenConversation(a)
            })
        },hide: function() {
            this.whenReady(function() {
                var a = this.isActive();
                this.view.hide(), a && !this.isActive() && this.trigger("hide")
            })
        },minimize: function() {
            this.whenReady(function() {
                this.view.minimize()
            })
        },maximize: function(a) {
            this.whenReady(function() {
                this.view.maximize(a)
            })
        },add: function(a) {
            this.whenReady(function() {
                b("body").append(this.view.render(a).$el), this.trigger("add")
            })
        },remove: function() {
            this.whenReady(function() {
                this.view.remove(), this.trigger("remove")
            })
        },createEvent: function(a, b) {
            this.whenReady(function() {
                this.client.createEvent(a, b)
            })
        },enableCustomLauncher: function() {
            this.settings.has("launcher.selector") && (this.disableCustomLauncher(), b(this.settings.get("launcher.selector")).on("click.intercom-launcher", c.bind(this.onCustomLauncherClicked, this)), i.info("intercom – Enabled custom launcher: " + this.settings.get("launcher.selector")))
        },disableCustomLauncher: function() {
            this.settings.has("launcher.selector") && b(this.settings.get("launcher.selector")).off("click.intercom-launcher")
        },isActive: function() {
            return this.isInitialized() && this.view.isActive()
        },isInitialized: function() {
            return this.initialized
        },whenReady: function(a) {
            return b.when(this.ready).then(c.bind(a, this))
        },showWhenReady: function(a) {
            this.whenReady(function() {
                var b = this.isActive();
                c.bind(a, this)(), b || this.trigger("show")
            })
        },windowIsChild: function() {
            return null !== window.opener
        },redirectToInstallUrlIfPresent: function() {
            var a = this.settings.get("install.redirect-url"), c = this.settings.get("user.email");
            void 0 !== a && (void 0 !== c && (a = a + "?" + b.param({email: c})), i.info("intercom - Redirecting to install URL: " + a), this.redirectToUrl(a))
        },redirectToUrl: function(a) {
            window.location.href = a
        },onLauncherClicked: function(a) {
            this.show(a), this.trigger("click")
        },onCustomLauncherClicked: function(a) {
            return a.preventDefault(), this.onLauncherClicked(), !1
        },onPingResponse: function(a) {
            if (v.hasInstallationQueryParameter())
                return v.showSuccessOverlay(), this.settings.update(v.fakePingResponse), void this.onPingResponseBoot(a);
            v.listenForInstallationStartMessage(c.bind(function() {
                v.showSuccessOverlay(), this.settings.update(v.fakePingResponse), this.onPingResponseBoot(a)
            }, this));
            var b = function() {
                return a.type && "error.list" === a.type ? void i.error("intercom - createOrUpdateUser failed") : (this.settings.update(a), void this.onPingResponseBoot(a))
            };
            b = c.bind(b, this), v.isLegacyInstallationMode(a) ? setTimeout(b, 1e3) : b()
        },onPingResponseBoot: function(a) {
            "resolved" !== this.ready.state() && this.onFirstPingResponse(a);
            var b = this.settings.get("user.anonymous-id");
            void 0 !== b && j.write("intercom-id", b, "all", "/", new Date(f.now() + x));
            var c = this.settings.get("user.anonymous-session");
            void 0 === c || this.settings.get("user.anonymous") || j.write("intercom-session", c, "all", "/", new Date(f.now() + w)), a.app && a.app.last_active && this.app.set({last_active: a.app.last_active}), this.nexusClient.initialise(), a.client_messages && a.client_messages.length > 0 && this.messageMatcher.initialise(a.client_messages), this.trigger("ping")
        },onFirstPingResponse: function(a) {
            var b = this.settings.get("user.locale");
            h.isSupportedLocale(b) ? h.setLocale(b) : i.error("intercom - Unknown locale '" + b + "'"), this.settings.get("app.audio-enabled") && g.enable(), this.settings.get("app.rtm-enabled") && m.enable();
            var c = a && a.unread_conversation_ids && a.unread_conversation_ids.length > 0;
            this.add(c), this.windowIsChild() || this.redirectToInstallUrlIfPresent(), this.ready.resolve(), i.info("intercom - Initialized")
        },refreshConversations: function(a) {
            this.view.refreshActiveConversation(a) || this.client.createOrUpdateUser()
        },refreshConversationsMaybeThrottled: function(a) {
            this.settings.get("app.rtm-enabled") ? this.refreshConversations(a) : this.throttledRefreshConversations(a)
        },onUserContentSeenByAdmin: function(a) {
            this.refreshConversationsMaybeThrottled(a)
        },onNewComment: function(a) {
            this.refreshConversationsMaybeThrottled(a)
        },onUnreadConversationAdded: function(a) {
            if (!this.view.refreshActiveConversation(a.id)) {
                var b = this.conversations.add(a, {merge: !0});
                !this.isActive() && b.autoOpen() && this.autoOpenConversation(b)
            }
        },onKeyUp: function(a) {
            0 === b(".intercom-image-viewer").length && this.isActive() && !this.view.isMinimized() && 27 === a.keyCode && this.hide()
        }}), a
    }), define("json", ["underscore", "json2"], function(a, b) {
        "use strict";
        function c(a) {
            return a && !("prototype" in a)
        }
        var d, e, f = a.isUndefined;
        f(window.JSON) || (d = window.JSON.stringify, e = window.JSON.parse);
        var g = c(d) && c(Date.prototype.toJSON) && f(String.prototype.toJSON) && f(Number.prototype.toJSON) && f(Boolean.prototype.toJSON) && f(Array.prototype.toJSON), h = c(e);
        return {stringify: g ? d : b.stringify,parse: h ? e : b.parse}
    }), define("logger", [], function() {
        "use strict";
        function a(a, c) {
            b += (new Date).toString() + " " + a + " " + c + "\n"
        }
        var b = "";
        return {info: function(b) {
            a("INFO ", b)
        },error: function(b) {
            a("ERROR", b)
        },getLines: function() {
            return b
        }}
    }), define("metrics", function() {
        "use strict";
        var a = require("underscore"), b = require("jquery"), c = require("logger"), d = require("date"), e = require("json"), f = require("store"), g = "metrics";
        return {increment: function(b) {
            c.info("metrics - increment " + b);
            var d = !1, e = this.getMetrics();
            a.each(e, function(a) {
                "increment" === a.type && a.name === b && (a.value += 1, d = !0)
            }), d ? this.saveMetrics(e) : this.addMetric("increment", b, 1)
        },timer: function(e) {
            var f = d.now(), g = b.Deferred();
            return g.then(a.bind(function() {
                var a = d.now() - f;
                c.info("metrics - timing " + e + ": " + a + "ms"), this.addMetric("timing", e, a)
            }, this)), g
        },getMetrics: function() {
            return e.parse(f.localStorage.get(g) || "[]")
        },addMetric: function(a, b, c) {
            var d = this.getMetrics();
            d.push({type: a,name: b,value: c}), this.saveMetrics(d)
        },saveMetrics: function(a) {
            f.localStorage.set(g, e.stringify(a))
        },resetMetrics: function() {
            f.localStorage.removeAll(g)
        }}
    }), define("mobile-app-detection", function() {
        "use strict";
        var a = require("jquery"), b = require("metrics");
        return {hasAppleMetaTag: function() {
            return a('head meta[name="apple-itunes-app"]').length > 0
        },run: function() {
            this.hasAppleMetaTag() && b.increment("ma:ap_meta")
        }}
    }), define("models/app", ["underscore", "backbone"], function(a, b) {
        "use strict";
        var c = b.Model.extend();
        return c
    }), define("models/conversation", ["underscore", "backbone", "models/part", "collections/parts", "collections/uploads", "date", "initials", "interblocks", "features", "json"], function(a, b, c, d, e, f, g, h, i, j) {
        "use strict";
        var k = 1407334860, l = b.Model.extend({initialize: function() {
            this.parts = new d, this.on("change:conversation_message", this.onMessageChanged), this.on("change:conversation_parts", this.onPartsChanged), this.parts.add(this.get("conversation_message")), this.has("conversation_parts") && this.parts.add(this.get("conversation_parts"), {parse: !0})
        },markAsRead: function() {
            this.isRead() || this.save({read: !0})
        },markAsUnread: function() {
            this.set({read: !1})
        },isRead: function() {
            return this.get("read")
        },isUnread: function() {
            return !this.get("read")
        },isChat: function() {
            return this.getMessage().isChat()
        },isAnnouncement: function() {
            return this.getMessage().isAnnouncement()
        },isSmallAnnouncement: function() {
            return this.getMessage().isSmallAnnouncement()
        },doesNotMatchCurrentUrl: function() {
            return this.get("matches_url") === !1
        },matchesCurrentUrl: function() {
            return !this.doesNotMatchCurrentUrl()
        },autoOpen: function() {
            return this.createdBeforeInAppsV2() ? !1 : this.getMessage().autoOpen() && 1 === this.partsCount() && this.isUnread()
        },replyDelayBodyBlockList: function() {
            return a.isEmpty(this.get("reply_delay_json_blocks")) ? [] : j.parse(this.get("reply_delay_json_blocks"))
        },lastAdminName: function() {
            var a = this.lastAdmin();
            if (a)
                return a.name
        },lastAdminFirstName: function() {
            var a = this.lastAdminName();
            if (a) {
                var b = a.split(" ")[0];
                return b ? b : a
            }
        },lastAdminAvatar: function(a) {
            var b = this.lastAdmin();
            if (b)
                return b.avatar[a || "square_128"]
        },lastAdminInitials: function() {
            var a = this.lastAdmin();
            if (a)
                return g.firstInitial(a.name)
        },lastAdminActiveTimestamp: function() {
            var a = this.lastAdmin();
            if (a && a.last_active_at)
                return 1e3 * a.last_active_at
        },lastAdmin: function() {
            return this.get("last_participating_admin")
        },updateLastAdminActiveTimestamp: function(a) {
            var b = this.lastAdmin();
            b && (b.last_active_at = a)
        },hasAdminComment: function() {
            return a.any(this.getComments(), function(a) {
                return a.byAdmin()
            })
        },hasUserComment: function() {
            return a.any(this.getComments(), function(a) {
                return a.byUser()
            })
        },preview: function() {
            return this.parts.lastNonLwrResponseBody() || ""
        },previewText: function() {
            return this.preview().replace(/<br>/gi, " ").replace(/(<([^>]+)>)/gi, "")
        },getMessage: function() {
            return this.parts.first()
        },getComments: function() {
            return this.parts.rest(1)
        },hasComments: function() {
            return this.parts.length > 1
        },getLastComment: function() {
            return a.last(this.getComments())
        },createdAt: function() {
            return f.timestampToDate(this.get("created_at"))
        },updatedAt: function() {
            var a = this.parts.nonLwrResponses().last();
            return a.isMessage() ? this.createdAt() : a.updatedAt()
        },partsCount: function() {
            return this.get("parts_count")
        },onPartsChanged: function() {
            this.parts.set(this.get("conversation_parts"), {parse: !0,remove: !1})
        },onMessageChanged: function() {
            var a = this.getMessage();
            a ? a.set(this.get("conversation_message")) : this.parts.add(this.get("conversation_message"))
        },createdBeforeInAppsV2: function() {
            return this.get("created_at") < k
        },updatedBeforeInAppsV2: function() {
            return this.get("updated_at") < k
        },qualifiesForAutoResponse: function() {
            return this.getMessage().byUser() && !this.hasAdminComment()
        },addPart: function(a) {
            this.parts.add(a), this.trigger("change", this)
        },toJSON: function() {
            return {id: this.id,body: this.getMessage().get("body"),upload_ids: this.getMessage().get("uploads") ? this.getMessage().get("uploads").pluck("id") : []}
        }});
        return l.fromBodyAndUploads = function(b, c) {
            return new l({conversation_message: {body: a.escape(b),uploads: new e(c)},read: !0})
        }, l
    }), define("models/draft", function() {
        "use strict";
        function a(a) {
            this.text = a
        }
        var b = require("underscore"), c = require("json");
        return a.prototype = {getText: function() {
            return this.text
        },isEmpty: function() {
            return b.isEmpty(this.text)
        },toJSON: function() {
            return {text: this.text}
        }}, a.fromJSON = function(d) {
            if (!b.isUndefined(d) && !b.isNull(d)) {
                var e = c.parse(d);
                return new a(e.text)
            }
        }, a
    }), define("models/part", function() {
        "use strict";
        var a = require("underscore"), b = require("jquery"), c = require("initials"), d = require("backbone"), e = require("collections/uploads"), f = require("date"), g = require("intermoji"), h = require("interblocks"), i = d.Model.extend({SEEN: "seen",UNSEEN: "unseen",initialize: function() {
            this.uploads = this.get("uploads") || new e(this.get("attachments") || [])
        },isMessage: function() {
            return "conversation_message" === this.get("type")
        },byAdmin: function() {
            var a = this.get("author");
            return a ? a.is_admin : !1
        },isSeenByAdmin: function() {
            return this.get("seen_by_admin") === this.SEEN
        },shouldShowAdminSeenState: function() {
            return this.byUser() && (this.get("seen_by_admin") === this.SEEN || this.get("seen_by_admin") === this.UNSEEN)
        },byUser: function() {
            return !this.byAdmin()
        },_bodyText: function() {
            return b.trim(b("<div>").append(this.body()).text())
        },isAsciiSticker: function() {
            return g.isSupportedAscii(this._bodyText())
        },isUnicodeSticker: function() {
            return g.isSupportedUnicode(this._bodyText())
        },isSticker: function() {
            return this.isAsciiSticker() || this.isUnicodeSticker()
        },getStickerData: function() {
            var a;
            return a = this.isUnicodeSticker() ? this._bodyText() : this.isAsciiSticker() ? g.unicodeFromAscii(this._bodyText()) : "❓", {identifier: g.identifierFromUnicode(a),assetId: g.codepointIndexFromUnicode(a).toString(16).toLowerCase(),unicodeSticker: a}
        },isChat: function() {
            return 0 === this.get("message_style")
        },isAnnouncement: function() {
            return 1 === this.get("message_style")
        },isSmallAnnouncement: function() {
            return 2 === this.get("message_style")
        },isUpload: function() {
            return this.byUser() && a.isEmpty(this.get("body")) && this.uploads.length > 0
        },isImageUpload: function() {
            return this.isUpload() && this.uploads.length === this.uploads.imageUploads().length
        },bodyIsImage: function() {
            return !1
        },isChatAutoMessage: function() {
            return this.isMessage() && !this.get("show_created_at")
        },autoOpen: function() {
            return this.isAnnouncement() || this.isSmallAnnouncement()
        },body: function() {
            return this.isUpload() ? "[Attachment]" : this.sanitize(this.get("body") || "")
        },createdAt: function() {
            return f.timestampToDate(this.get("created_at"))
        },adminAvatar: function(a) {
            return this.byAdmin() ? (a = a || "square_128", this.get("author").avatar[a]) : void 0
        },adminInitials: function() {
            return this.byAdmin() ? c.firstInitial(this.get("author").name) : void 0
        },isLwrMessage: function() {
            return this.get("lightweight_reply") && !this.isLwrResponse()
        },isLwrResponse: function() {
            return "lightweight_reply_user_response" === this.get("part_type")
        },getLwrType: function() {
            return this.get("lightweight_reply").type
        },getLwrResponse: function() {
            return this.get("lightweight_reply").option
        },updatedAt: function() {
            return f.timestampToDate(this.get("updated_at"))
        },getAuthorFirstName: function() {
            var a = this.get("author");
            return a.first_name || a.name || a.email
        },getAuthorEmail: function() {
            var a = this.get("author");
            return a.email
        },sanitize: function(b) {
            return b.replace(/(<script)/gi, a.escape("<script")).replace(/(<[/]script>)/gi, a.escape("</script>"))
                                                                                                                                                                                                                                                 },renderedBody: function() {
                                                                                                                                                                                                                                                     var a = this.get("blocks");
                                                                                                                                                                                                                                                     return a && h.supportsBlockRendering(a) ? h.renderBlocks(a) : this.body()
                                                                                                                                                                                                                                                 },isVideoReply: function() {
                                                                                                                                                                                                                                                     var b = this.get("blocks"), c = b && a.find(b, function(a) {
                                                                                                                                                                                                                                                         return "videoReply" === a.type
                                                                                                                                                                                                                                                     });
                                                                                                                                                                                                                                                     return !!c
                                                                                                                                                                                                                                                 },toJSON: function() {
                                                                                                                                                                                                                                                     return {body: this.get("body"),reply_type: this.get("reply_type"),reply_option: this.get("reply_option"),conversation_id: this.get("conversation_id"),upload_ids: this.uploads.pluck("id")}
                                                                                                                                                                                                                                                 }});
    return i.fromBodyAndUploads = function(b, c, d) {
        return new i({body: a.escape(b),conversation_id: d.id,uploads: new e(c)})
    }, i
}), define("models/upload", ["underscore", "backbone", "upload"], function(a, b, c) {
    "use strict";
    var d = 264, e = 41943040, f = b.Model.extend({initialize: function() {
        this.file = this.get("file")
    },name: function() {
        return this.get("file_name") || this.get("name")
    },url: function() {
        return this.get("url") || this.get("public_url")
    },size: function() {
        return this.get("file_size") || this.get("filesize") || 0
    },isTooBig: function() {
        return this.size() > e
    },content_type: function() {
        return this.get("content_type")
    },upload: function() {
        return c(this)
    },isImage: function() {
        return !!this.get("content_type").toLowerCase().match(/^image\//)
    },imageData: function() {
        return this.get("imageData")
    },hasDimensions: function() {
        return this.isImage() && a.isNumber(this.naturalWidth()) && a.isNumber(this.naturalHeight())
    },naturalWidth: function() {
        return parseInt(this.get("width"), 10) || null
    },naturalHeight: function() {
        return parseInt(this.get("height"), 10) || null
    },scale: function() {
        return this.naturalWidth() > d ? this.naturalWidth() / d : 1
    },width: function() {
        return parseInt(this.naturalWidth() / this.scale(), 10)
    },height: function() {
        return parseInt(this.naturalHeight() / this.scale(), 10)
    },parse: function(a) {
        var b = a.upload_url;
        return b && (a.id = parseInt(b.match(/\/(\d+)$/)[1], 10)), a
    },toJSON: function() {
        return {id: this.id,original_filename: this.name(),size_in_bytes: this.size(),content_type: this.content_type(),width: this.naturalWidth(),height: this.naturalHeight()}
    }});
    return f.fromFile = function(a) {
        return new f({file_name: a.name,file_size: a.size,content_type: a.type,file: a})
    }, f
}), define("models/user", ["underscore", "backbone"], function(a, b) {
    "use strict";
    var c = b.Model.extend({initialize: function(a, b) {
        this.settings = b.settings
    },hasEmail: function() {
        return !a.isEmpty(this.getEmail())
    },getEmail: function() {
        return this.settings.get("user.email") || this.settings.get("user.anonymous-email")
    },updateAnonymousEmail: function(a) {
        return this.settings.update({user: {anonymous_email: a}}), this.save()
    },fetchRealtimeSettingsIfMissing: function() {
        this.settings.get("user.anonymous") && !this.settings.has("app.rtm-settings") && this.fetch()
    }});
    return c.fromSettings = function(a) {
        return new c({}, {settings: a})
    }, c
}), define("navigation-events", function() {
    "use strict";
    var a = require("underscore"), b = require("backbone"), c = {};
    return a.extend(c, b.Events), c.retrigger = function(a) {
        return function(b) {
            b.preventDefault(), b.stopPropagation(), c.trigger(a)
        }
    }, c
}), define("page-title", function() {
    "use strict";
    function a(a) {
        h("head title").text(a)
    }
    function b() {
        return h("head title").text()
    }
    function c() {
        var c = b();
        a(e), e = c
    }
    var d, e, f, g = require("underscore"), h = require("jquery"), i = require("browser"), j = require("visibility");
    return {setNotification: function(h) {
        i.features.visibility() && (j.isPageVisible() || (d = d || b(), e = d, a(h), g.isUndefined(f) && (f = setInterval(g.bind(function() {
            return j.isPageVisible() ? void this.reset() : void c()
        }, this), 3e3))))
    },reset: function() {
        clearInterval(f), f = void 0, a(d), d = void 0
    }}
}), define("pjax", function() {
    "use strict";
    return function(a) {
        var b = window.$;
        null !== b && void 0 !== b && void 0 !== b.pjax && (b(document).on("pjax:click", ".intercom-container a", function(a) {
            a.preventDefault()
        }), b(document).on("pjax:success", function() {
            a.createOrUpdateUser()
        }))
    }
}), define("poller", function() {
    "use strict";
    var a = require("underscore"), b = require("logger"), c = require("activity-monitor"), d = require("rtm-latency-monitor"), e = 18e5, f = 3, g = function(b, d) {
        this.failures = 0, this.options = a.defaults({}, d, {interval: e,maxFailures: f}), this.client = b, this.running = !1, this.pollImmediatelyWhenNextActive = !1, c.onActive(a.bind(this.onActive, this))
    };
    return g.prototype = {start: function() {
        return this.running ? void b.info("poller - Already running.") : (this.enqueue(), this.running = !0, void b.info("poller - Polling started"))
    },stop: function() {
        return this.running ? (this.running = !1, void b.info("poller - Polling stopped")) : void b.info("poller - Not running.")
    },update: function() {
        return this.running ? this.isActive() ? (d.invalidateLatencyData(), b.info("poller - Polling"), void this.client.createOrUpdateUser().fail(a.bind(function() {
            this.failures++
        }, this)).always(a.bind(function() {
            this.failures >= this.options.maxFailures ? b.info("poller - Max failures exceeded, stopping") : this.enqueue()
        }, this))) : (b.info("poller - User not active."), void (this.pollImmediatelyWhenNextActive = !0)) : void b.info("poller - Not running.")
    },enqueue: function() {
        setTimeout(a.bind(this.update, this), this.options.interval)
    },isActive: function() {
        return c.isActive()
    },onActive: function() {
        this.pollImmediatelyWhenNextActive && (this.pollImmediatelyWhenNextActive = !1, this.update())
    }}, g
}), define("preview", ["jquery", "underscore"], function(a, b) {
    "use strict";
    function c(a, c) {
        c = b.defaults({}, c, {rows: 2,overflow: "&hellip;"});
        var d = a.html(), e = a.height();
        a.text("a");
        var f = parseFloat(a.css("line-height"), 10), g = a.height(), h = f > g ? f - g : 0, i = h * (c.rows - 1) + g * c.rows;
        if (i >= e)
            return void a.html(d);
        for (var j = 1, k = 0, l = d.length; l > j; )
            k = Math.ceil((j + l) / 2), a.html(d.slice(0, k) + c.overflow), a.height() <= i ? j = k : l = k - 1;
        a.html(d.slice(0, j) + c.overflow)
    }
    return a.fn.previewify = function(a) {
        return c(this, a)
    }, c
}), define("previewer", function() {
    "use strict";
    function a(a) {
        return "" !== a.text().replace(/^\s+|\s+$/g, "")
    }
    function b(a) {
        return 0 !== a.find("img").length
    }
    function c(a) {
        return 0 !== a.find('iframe[src*="vimeo.com"],iframe[src*="wistia.net"],iframe[src*="youtube.com"]').length
    }
    var d = require("jquery"), e = require("i18n");
    return {isMetadataPreview: function(f) {
        if (!e.isLocaleEnglish())
            return !1;
        var g = d("<p/>", {html: f});
        return !a(g) && (b(g) || c(g))
    },preview: function(f) {
        if (!e.isLocaleEnglish())
            return f;
        var g = d("<p/>", {html: f});
        return a(g) ? f : b(g) ? "(image attached)" : c(g) ? "(video attached)" : ""
    }}
}), define("rtm-latency-monitor", ["exports", "underscore"], function(a, b) {
    "use strict";
    var c = {}, d = !1;
    a.onNewComment = function(a) {
        var e = a.eventData;
        if (e && e.conversationId && e.adminTimestamp && e.adminTabId)
            return b.has(c, e.conversationId) ? void (d = !0) : void (c[e.conversationId] = b.pick(e, ["adminTimestamp", "adminTabId"]))
    }, a.invalidateLatencyData = function() {
        c = {}
    }, a.popLatencyDataForConversation = function(a) {
        var e = {};
        return !d && b.has(c, a) && (e = c[a], delete c[a]), e
    }, a.disable = function() {
        d = !0
    }, a.reset = function() {
        a.invalidateLatencyData(), d = !1
    }
}), define("settings", function() {
    "use strict";
    function a(a) {
        this.settings = p.clone(a || {})
    }
    function b(a) {
        var b = d(a, "app.name");
        return b.indexOf(/team/gi) < 0 && r.isLocaleEnglish() ? b + " Team" : b
    }
    function c(a) {
        return void 0 === d(a, "user_id") && void 0 === d(a, "email")
    }
    function d(a, b) {
        return p.reduce(b.split("."), function(a, b) {
            return p.isObject(a) ? a[b] : void 0
        }, a)
    }
    function e(a) {
        return p.chain(a).keys().reject(function(b) {
            return (p.isArray(a[b]) || p.isObject(a[b]) || p.contains(t, b)) && !p.contains(u, b)
        }).value()
    }
    function f(a) {
        return p.pick(a, e(a))
    }
    function g(a) {
        var b = d(a, "widget.activator");
        if (!p.include(s, b))
            return b
    }
    function h(a) {
        if (m(a, "messages"))
            return !1;
        var b = d(a, "widget.activator"), c = d(a, "modules.messages.use_activator");
        return void 0 === c ? "#IntercomDefaultWidget" === b : c === !0 && ("#IntercomDefaultWidget" === b || 0 === o(b).length) && (i(a) || j(a))
    }
    function i(a) {
        return c(a) ? d(a, "modules.messages.features.inbound_lead_messaging") === !0 : d(a, "modules.messages.features.inbound_messages") === !0
    }
    function j(a) {
        return d(a, "modules.messages.features.outbound_messages") !== !1
    }
    function k(a) {
        return d(a, "modules.messages.features.rtm") === !0
    }
    function l(a) {
        var b = d(a, "modules.rtm");
        return p.isEmpty(b) ? void 0 : b
    }
    function m(a, b) {
        var c = d(a, "disable_modules");
        return void 0 !== c && p.contains(c, b)
    }
    function n(a) {
        var b = d(a, "app.last_active");
        return p.isNumber(b) ? 1e3 * b : void 0
    }
    var o = require("jquery"), p = require("underscore"), q = require("logger"), r = require("i18n");
    a.prototype = {get: function(a) {
        switch (a) {
        case "app.id":
            return d(this.settings, "app_id");
        case "app.name":
            return b(this.settings);
        case "app.locale":
            return d(this.settings, "app.locale");
        case "app.branding-enabled":
            return d(this.settings, "app.show_powered_by");
        case "app.color":
            return d(this.settings, "modules.messages.colors.base");
        case "app.message":
            return d(this.settings, "app.message");
        case "app.inbound-messaging-enabled":
            return i(this.settings);
        case "app.outbound-messaging-enabled":
            return j(this.settings);
        case "app.messaging-disabled":
            return m(this.settings, "messages");
        case "app.powered-by-text":
            return d(this.settings, "app.powered_by_variant");
        case "app.powered-by-id":
            return d(this.settings, "app.powered_by_variant_id");
        case "app.rtm-enabled":
            return k(this.settings);
        case "app.rtm-settings":
            return l(this.settings);
        case "app.auto-response":
            return d(this.settings, "app.auto_response");
        case "app.audio-enabled":
            return d(this.settings, "app.audio_enabled");
        case "app.active-admins":
            return d(this.settings, "app.active_admins");
        case "app.feature-flags":
            return d(this.settings, "app.feature_flags") || [];
        case "user.id":
            return d(this.settings, "user_id") || d(this.settings, "user_data.user_id");
        case "user.intercom-id":
            return d(this.settings, "user.id");
        case "user.email":
            return d(this.settings, "email") || d(this.settings, "user_data.email");
        case "user.hash":
            return d(this.settings, "user_hash") || d(this.settings, "user_data.user_hash");
        case "user.anonymous":
            return c(this.settings);
        case "user.anonymous-id":
            return d(this.settings, "user.anonymous_id");
        case "user.anonymous-email":
            return d(this.settings, "user.anonymous_email");
        case "user.anonymous-session":
            return d(this.settings, "anonymous_session");
        case "user.has-conversations":
            return d(this.settings, "user.has_conversations");
        case "user.locale":
            return d(this.settings, "user.locale");
        case "launcher.selector":
            return g(this.settings);
        case "launcher.enabled":
            return h(this.settings);
        case "increments":
            return d(this.settings, "increments");
        case "install.redirect-url":
            return d(this.settings, "modules.install.complete_install_url");
        case "team.last-active":
            return n(this.settings)
        }
    },has: function(a) {
        return void 0 !== this.get(a)
    },isValid: function() {
        return this.has("app.id")
    },update: function(a) {
        p.isObject(a) ? o.extend(!0, this.settings, a) : q.error("Unable to update settings")
    },getCustomAttributes: function() {
        return f(this.settings)
    },reset: function() {
        this.settings = {}
    },getAndClear: function(a) {
        var b = this.get(a);
        return delete this.settings[a], b
    }};
    var s = ["#IntercomDefaultWidget", "body"], t = ["app_id", "user_id", "email", "user_hash", "modules", "disable_modules", "widget", "inert", "fake_message_response", "increments", "anonymous_session"], u = ["custom_data", "company", "companies"];
    return a
}), define("state-store", function() {
    "use strict";
    var a = require("underscore"), b = require("store"), c = require("json");
    return {save: function(d) {
        b.sessionStorage.set("state", c.stringify(a.extend(this.load() || {}, d)))
    },load: function() {
        try {
            return c.parse(b.sessionStorage.get("state"))
        } catch (a) {
        }
    },clear: function() {
        b.sessionStorage.remove("state")
    }}
}), define("store", ["underscore", "browser"], function(a, b) {
    "use strict";
    function c() {
        return {get: a.noop,set: a.noop,remove: a.noop,removeAll: a.noop}
    }
    function d(b) {
        return {get: function(a) {
            return b.getItem(e + a)
        },set: function(a, c) {
            return b.setItem(e + a, c || "")
        },remove: function(a) {
            b.removeItem(e + a)
        },removeAll: function(c) {
            if (a.isString(c))
                for (var d in b)
                    0 === d.indexOf(e + c) && b.removeItem(d)
        }}
    }
    var e = "intercom.";
    return {localStorage: b.features.localStorage() ? d(localStorage) : c(),sessionStorage: b.features.sessionStorage() ? d(sessionStorage) : c()}
}), define("stylesheet", ["color"], function(a) {
    "use strict";
    return function(b, c) {
        var d = a.lighten(c, 20), e = a.darken(c, 20), f = a.darken(c, 40), g = require(b);
        return g = g.replace(/custom-color-light/g, d), g = g.replace(/custom-color-darker/g, f), g = g.replace(/custom-color-dark/g, e), g = g.replace(/custom-color/g, c)
    }
}), define("stylesheets/intercom", [], function() {
    return '@charset "UTF-8";\n#intercom-container .intercom-sheet-loading .intercom-sheet-spinner, #intercom-container .intercom-conversations-fetching .intercom-conversations-spinner {\n  background-image: url(https://js.intercomcdn.com/images/spinner.png) /* noembed */;\n  background-size: 28px 28px;\n  background-repeat: no-repeat;\n  display: block;\n  width: 28px;\n  height: 28px; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container .intercom-sheet-loading .intercom-sheet-spinner, #intercom-container .intercom-conversations-fetching .intercom-conversations-spinner {\n      background-image: url(https://js.intercomcdn.com/images/spinner@2x.png) /* noembed */; } }\n\n.intercom-reset div, .intercom-reset span, .intercom-reset applet, .intercom-reset object, .intercom-reset iframe, .intercom-reset h1, .intercom-reset h2, .intercom-reset h3, .intercom-reset h4, .intercom-reset h5, .intercom-reset h6, .intercom-reset p, .intercom-reset blockquote, .intercom-reset pre, .intercom-reset a, .intercom-reset abbr, .intercom-reset acronym, .intercom-reset address, .intercom-reset big, .intercom-reset cite, .intercom-reset code, .intercom-reset del, .intercom-reset dfn, .intercom-reset em, .intercom-reset img, .intercom-reset ins, .intercom-reset kbd, .intercom-reset q, .intercom-reset s, .intercom-reset samp, .intercom-reset small, .intercom-reset strike, .intercom-reset strong, .intercom-reset sub, .intercom-reset sup, .intercom-reset tt, .intercom-reset var, .intercom-reset b, .intercom-reset u, .intercom-reset i, .intercom-reset center, .intercom-reset dl, .intercom-reset dt, .intercom-reset dd, .intercom-reset ol, .intercom-reset ul, .intercom-reset li, .intercom-reset fieldset, .intercom-reset form, .intercom-reset div.form, .intercom-reset label, .intercom-reset legend, .intercom-reset table, .intercom-reset caption, .intercom-reset tbody, .intercom-reset tfoot, .intercom-reset thead, .intercom-reset tr, .intercom-reset th, .intercom-reset td, .intercom-reset article, .intercom-reset aside, .intercom-reset canvas, .intercom-reset details, .intercom-reset figcaption, .intercom-reset figure, .intercom-reset footer, .intercom-reset header, .intercom-reset hgroup, .intercom-reset menu, .intercom-reset nav, .intercom-reset section, .intercom-reset summary, .intercom-reset time, .intercom-reset mark, .intercom-reset audio, .intercom-reset video, .intercom-reset button, .intercom-reset textarea, .intercom-reset input, .intercom-reset input[type] {\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-size-adjust: none;\n  font-size: 100%;\n  font-style: normal;\n  letter-spacing: normal;\n  font-stretch: normal;\n  font-variant: normal;\n  font-weight: normal;\n  font: normal normal 100% "Helvetica Neue", Helvetica, Arial, sans-serif;\n  text-align: left;\n  -moz-text-align-last: initial;\n       text-align-last: initial;\n  text-decoration: none;\n  -webkit-text-emphasis: none;\n          text-emphasis: none;\n  text-height: auto;\n  text-indent: 0;\n  text-justify: auto;\n  text-outline: none;\n  text-shadow: none;\n  text-transform: none;\n  text-wrap: normal;\n  alignment-adjust: auto;\n  alignment-baseline: baseline;\n  -webkit-animation: none 0 ease 0 1 normal;\n          animation: none 0 ease 0 1 normal;\n  -webkit-animation-play-state: running;\n          animation-play-state: running;\n  appearance: normal;\n  azimuth: center;\n  -webkit-backface-visibility: visible;\n          backface-visibility: visible;\n  background: none 0 0 auto repeat scroll padding-box transparent;\n  background-color: transparent;\n  background-image: none;\n  baseline-shift: baseline;\n  binding: none;\n  bleed: 6pt;\n  bookmark-label: content();\n  bookmark-level: none;\n  bookmark-state: open;\n  bookmark-target: none;\n  border: 0 none transparent;\n  border-radius: 0;\n  bottom: auto;\n  box-align: stretch;\n  -webkit-box-decoration-break: slice;\n          box-decoration-break: slice;\n  box-direction: normal;\n  box-flex: 0.0;\n  box-flex-group: 1;\n  box-lines: single;\n  box-ordinal-group: 1;\n  box-orient: inline-axis;\n  box-pack: start;\n  box-shadow: none;\n  box-sizing: content-box;\n  -webkit-break-after: auto;\n     -moz-break-after: auto;\n          break-after: auto;\n  -webkit-break-before: auto;\n     -moz-break-before: auto;\n          break-before: auto;\n  -webkit-column-break-inside: auto;\n     page-break-inside: auto;\n          break-inside: auto;\n  caption-side: top;\n  clear: none;\n  clip: auto;\n  color: inherit;\n  color-profile: auto;\n  -webkit-column-count: auto;\n     -moz-column-count: auto;\n          column-count: auto;\n  -webkit-column-fill: balance;\n     -moz-column-fill: balance;\n          column-fill: balance;\n  -webkit-column-gap: normal;\n     -moz-column-gap: normal;\n          column-gap: normal;\n  -webkit-column-rule: medium medium #1f1f1f;\n     -moz-column-rule: medium medium #1f1f1f;\n          column-rule: medium medium #1f1f1f;\n  -webkit-column-span: 1;\n     -moz-column-span: 1;\n          column-span: 1;\n  -webkit-column-width: auto;\n     -moz-column-width: auto;\n          column-width: auto;\n  -webkit-columns: auto auto;\n     -moz-columns: auto auto;\n          columns: auto auto;\n  content: normal;\n  counter-increment: none;\n  counter-reset: none;\n  crop: auto;\n  cursor: auto;\n  direction: ltr;\n  display: inline;\n  dominant-baseline: auto;\n  drop-initial-after-adjust: text-after-edge;\n  drop-initial-after-align: baseline;\n  drop-initial-before-adjust: text-before-edge;\n  drop-initial-before-align: caps-height;\n  drop-initial-size: auto;\n  drop-initial-value: initial;\n  elevation: level;\n  empty-cells: show;\n  fit: fill;\n  fit-position: 0% 0%;\n  float: none;\n  float-offset: 0 0;\n  grid-columns: none;\n  grid-rows: none;\n  hanging-punctuation: none;\n  height: auto;\n  hyphenate-after: auto;\n  hyphenate-before: auto;\n  hyphenate-character: auto;\n  hyphenate-lines: no-limit;\n  hyphenate-resource: none;\n  -webkit-hyphens: manual;\n     -moz-hyphens: manual;\n      -ms-hyphens: manual;\n          hyphens: manual;\n  icon: auto;\n  image-orientation: auto;\n  image-rendering: auto;\n  image-resolution: normal;\n  inline-box-align: last;\n  left: auto;\n  line-height: inherit;\n  line-stacking: inline-line-height exclude-ruby consider-shifts;\n  list-style: disc outside none;\n  margin: 0;\n  marks: none;\n  marquee-direction: forward;\n  marquee-loop: 1;\n  marquee-play-count: 1;\n  marquee-speed: normal;\n  marquee-style: scroll;\n  max-height: none;\n  max-width: none;\n  min-height: 0;\n  min-width: 0;\n  move-to: normal;\n  nav-down: auto;\n  nav-index: auto;\n  nav-left: auto;\n  nav-right: auto;\n  nav-up: auto;\n  opacity: 1;\n  orphans: 2;\n  outline: invert none medium;\n  outline-offset: 0;\n  overflow: visible;\n  overflow-style: auto;\n  padding: 0;\n  page: auto;\n  page-break-after: auto;\n  page-break-before: auto;\n  page-break-inside: auto;\n  page-policy: start;\n  -webkit-perspective: none;\n          perspective: none;\n  -webkit-perspective-origin: 50% 50%;\n          perspective-origin: 50% 50%;\n  position: static;\n  presentation-level: 0;\n  punctuation-trim: none;\n  quotes: none;\n  rendering-intent: auto;\n  resize: none;\n  right: auto;\n  rotation: 0;\n  rotation-point: 50% 50%;\n  ruby-align: auto;\n  ruby-overhang: none;\n  ruby-position: before;\n  ruby-span: none;\n  size: auto;\n  string-set: none;\n  table-layout: auto;\n  top: auto;\n  -webkit-transform: none;\n      -ms-transform: none;\n          transform: none;\n  -webkit-transform-origin: 50% 50% 0;\n      -ms-transform-origin: 50% 50% 0;\n          transform-origin: 50% 50% 0;\n  -webkit-transform-style: flat;\n          transform-style: flat;\n  transition: all 0 ease 0;\n  unicode-bidi: normal;\n  vertical-align: baseline;\n  white-space: normal;\n  white-space-collapse: collapse;\n  widows: 2;\n  width: auto;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  z-index: auto;\n  text-align: start;\n  /* And disable MS gradients */\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled=false);\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n.intercom-reset address, .intercom-reset blockquote, .intercom-reset dd, .intercom-reset div, .intercom-reset dl, .intercom-reset dt, .intercom-reset fieldset, .intercom-reset form, .intercom-reset div.form, .intercom-reset frame, .intercom-reset frameset, .intercom-reset h1, .intercom-reset h2, .intercom-reset h3, .intercom-reset h4, .intercom-reset h5, .intercom-reset h6, .intercom-reset noframes, .intercom-reset ol, .intercom-reset p, .intercom-reset ul, .intercom-reset center, .intercom-reset dir, .intercom-reset hr, .intercom-reset menu, .intercom-reset pre, .intercom-reset article, .intercom-reset aside, .intercom-reset canvas, .intercom-reset details, .intercom-reset figcaption, .intercom-reset figure, .intercom-reset footer, .intercom-reset header, .intercom-reset hgroup, .intercom-reset menu, .intercom-reset nav, .intercom-reset section, .intercom-reset summary {\n  display: block; }\n.intercom-reset li {\n  display: list-item; }\n.intercom-reset table {\n  display: table; }\n.intercom-reset tr {\n  display: table-row; }\n.intercom-reset thead {\n  display: table-header-group; }\n.intercom-reset tbody {\n  display: table-row-group; }\n.intercom-reset tfoot {\n  display: table-footer-group; }\n.intercom-reset col {\n  display: table-column; }\n.intercom-reset colgroup {\n  display: table-column-group; }\n.intercom-reset td, .intercom-reset th {\n  display: table-cell; }\n.intercom-reset caption {\n  display: table-caption; }\n.intercom-reset input, .intercom-reset select {\n  display: inline-block; }\n.intercom-reset b, .intercom-reset strong {\n  font-weight: bold; }\n.intercom-reset b > i, .intercom-reset strong > i, .intercom-reset b > em, .intercom-reset strong > em, .intercom-reset i > b, .intercom-reset i > strong, .intercom-reset em > b, .intercom-reset em > strong {\n  font-weight: bold;\n  font-style: italic; }\n.intercom-reset textarea, .intercom-reset input {\n  cursor: text; }\n  .intercom-reset textarea::-webkit-input-placeholder, .intercom-reset input::-webkit-input-placeholder {\n    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n    font-size-adjust: none;\n    font-size: 100%;\n    font-style: normal;\n    letter-spacing: normal;\n    font-stretch: normal;\n    font-variant: normal;\n    font-weight: normal;\n    font: normal normal 100% "Helvetica Neue", Helvetica, Arial, sans-serif;\n    text-align: left;\n    text-align-last: initial;\n    text-decoration: none;\n    -webkit-text-emphasis: none;\n            text-emphasis: none;\n    text-height: auto;\n    text-indent: 0;\n    text-justify: auto;\n    text-outline: none;\n    text-shadow: none;\n    text-transform: none;\n    text-wrap: normal;\n    background-color: inherit;\n    color: inherit; }\n  .intercom-reset textarea::-moz-placeholder, .intercom-reset input::-moz-placeholder {\n    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n    font-size-adjust: none;\n    font-size: 100%;\n    font-style: normal;\n    letter-spacing: normal;\n    font-stretch: normal;\n    font-variant: normal;\n    font-weight: normal;\n    font: normal normal 100% "Helvetica Neue", Helvetica, Arial, sans-serif;\n    text-align: left;\n    -moz-text-align-last: initial;\n         text-align-last: initial;\n    text-decoration: none;\n    text-emphasis: none;\n    text-height: auto;\n    text-indent: 0;\n    text-justify: auto;\n    text-outline: none;\n    text-shadow: none;\n    text-transform: none;\n    text-wrap: normal;\n    background-color: inherit;\n    color: inherit; }\n  .intercom-reset textarea:-ms-input-placeholder, .intercom-reset input:-ms-input-placeholder {\n    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n    font-size-adjust: none;\n    font-size: 100%;\n    font-style: normal;\n    letter-spacing: normal;\n    font-stretch: normal;\n    font-variant: normal;\n    font-weight: normal;\n    font: normal normal 100% "Helvetica Neue", Helvetica, Arial, sans-serif;\n    text-align: left;\n    text-align-last: initial;\n    text-decoration: none;\n    text-emphasis: none;\n    text-height: auto;\n    text-indent: 0;\n    text-justify: auto;\n    text-outline: none;\n    text-shadow: none;\n    text-transform: none;\n    text-wrap: normal;\n    background-color: inherit;\n    color: inherit; }\n  .intercom-reset textarea::-moz-selection, .intercom-reset input::-moz-selection {\n    background-color: #b3d4fc; }\n  .intercom-reset textarea::selection, .intercom-reset input::selection {\n    background-color: #b3d4fc; }\n  .intercom-reset textarea::-moz-selection, .intercom-reset input::-moz-selection {\n    background-color: #b3d4fc; }\n.intercom-reset input[type=checkbox], .intercom-reset input[type=radio] {\n  cursor: default; }\n.intercom-reset a, .intercom-reset a *, .intercom-reset a span, .intercom-reset button, .intercom-reset button *, .intercom-reset button span, .intercom-reset input[type=submit], .intercom-reset input[type=reset] {\n  cursor: pointer; }\n.intercom-reset a:link, .intercom-reset a:visited, .intercom-reset a:hover, .intercom-reset a:active {\n  color: inherit;\n  background: transparent;\n  text-shadow: none; }\n.intercom-reset button::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n.intercom-reset iframe {\n  max-width: 100%; }\n\n#intercom-container .intercom-conversations-new-conversation-button, #intercom-container .intercom-announcement-body-container a.intercom-h2b-button, #intercom-container .intercom-small-announcement-body-container a.intercom-h2b-button, #intercom-container .intercom-new-anonymous-user input[type="submit"], #intercom-container .intercom-composer-send-button {\n  box-shadow: inset 0 1px 0px 0 rgba(255, 255, 255, 0.17);\n  background: custom-color;\n  background-image: linear-gradient(to bottom, custom-color-light, custom-color);\n  border-radius: 3px;\n  text-shadow: 0 -1px rgba(0, 0, 0, 0.2);\n  text-decoration: none;\n  font-size: 14px;\n  line-height: 25px;\n  padding: 0 9px;\n  display: inline-block;\n  color: white;\n  border: 1px solid custom-color-dark; }\n  #intercom-container .intercom-conversations-new-conversation-button:hover, #intercom-container .intercom-announcement-body-container a.intercom-h2b-button:hover, #intercom-container .intercom-small-announcement-body-container a.intercom-h2b-button:hover, #intercom-container .intercom-new-anonymous-user input[type="submit"]:hover, #intercom-container .intercom-composer-send-button:hover {\n    background: custom-color-dark;\n    background-image: linear-gradient(to bottom, custom-color, custom-color-dark);\n    border-color: custom-color-darker; }\n  #intercom-container .intercom-conversations-new-conversation-button:active, #intercom-container .intercom-announcement-body-container a.intercom-h2b-button:active, #intercom-container .intercom-small-announcement-body-container a.intercom-h2b-button:active, #intercom-container .intercom-new-anonymous-user input[type="submit"]:active, #intercom-container .intercom-composer-send-button:active {\n    background: custom-color-darker;\n    border-color: custom-color-darker; }\n  #intercom-container .intercom-conversations-new-conversation-button:disabled, #intercom-container .intercom-announcement-body-container a.intercom-h2b-button:disabled, #intercom-container .intercom-small-announcement-body-container a.intercom-h2b-button:disabled, #intercom-container .intercom-new-anonymous-user input[type="submit"]:disabled, #intercom-container .intercom-composer-send-button:disabled {\n    box-shadow: 0 1px 1px 0 rgba(255, 255, 255, 0.11), inset 0px 0px 1px 1px rgba(255, 255, 255, 0.08);\n    background: #acbbc2;\n    background-image: linear-gradient(to bottom, #b6c5cb, #acbbc2);\n    border-color: #a0aeb4; }\n\n#intercom-container .intercom-conversations-new-conversation-button {\n  padding: 2px 12px;\n  font-weight: 400;\n  font-size: 14px;\n  line-height: 30px; }\n\nbody > .intercom-container {\n  z-index: 2147483000;\n  position: fixed; }\n\n.intercom-embed-container {\n  position: relative; }\n\n@media print {\n  #intercom-container {\n    display: none; } }\n\n#intercom-container .intercom-launcher {\n  z-index: 2147483000;\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  position: fixed;\n  bottom: 20px;\n  right: 20px;\n  width: 48px;\n  height: 48px;\n  visibility: hidden;\n  -webkit-transform: translateZ(0); }\n#intercom-container .intercom-launcher-enabled {\n  visibility: visible; }\n#intercom-container .intercom-launcher-inactive {\n  visibility: hidden; }\n#intercom-container .intercom-launcher-preview, #intercom-container .intercom-launcher-badge, #intercom-container .intercom-launcher-initials {\n  opacity: 0;\n  visibility: hidden; }\n#intercom-container .intercom-launcher-inactive.intercom-launcher-maximized {\n  opacity: 1;\n  visibility: visible; }\n#intercom-container .intercom-launcher-inactive.intercom-launcher-minimized {\n  opacity: 0; }\n#intercom-container .intercom-launcher-maximized.intercom-launcher-with-preview, #intercom-container .intercom-launcher-active.intercom-launcher-with-preview {\n  width: 330px; }\n#intercom-container .intercom-launcher-maximized.intercom-launcher-with-preview .intercom-launcher-preview, #intercom-container .intercom-launcher-active.intercom-launcher-with-preview .intercom-launcher-preview {\n  opacity: 1;\n  visibility: visible; }\n#intercom-container .intercom-launcher-maximized.intercom-launcher-with-badge .intercom-launcher-badge, #intercom-container .intercom-launcher-active.intercom-launcher-with-badge .intercom-launcher-badge {\n  opacity: 1;\n  visibility: visible; }\n#intercom-container .intercom-launcher-maximized.intercom-launcher-with-initials .intercom-launcher-initials, #intercom-container .intercom-launcher-active.intercom-launcher-with-initials .intercom-launcher-initials {\n  opacity: 1;\n  visibility: visible; }\n#intercom-container .intercom-launcher.intercom-launcher-with-avatar .intercom-launcher-button {\n  border-width: 0;\n  background-size: 48px 48px; }\n#intercom-container .intercom-launcher-active.intercom-launcher-with-message .intercom-launcher-button {\n  visibility: visible; }\n#intercom-container .intercom-launcher-button {\n  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAQAAABuvaSwAAAAzElEQVR4AY3Kr0qDcRSA4bNgmUkZSyr2YVkWwTtYEZNFxLQ0wajZZrJ4AcIQ1O4fLHoFpkXTTDIXNoQ9RtEf+p3nrW9EaLk28p+RKy0R2sYyxtrhTtZtmMiahNKbvgtDhXLumxdC3WX1vKTh2aOGBZ9V86kHsCl8VM1wb1fNBpl51Zxtw9y8Yg1y845efkZ+XrdFKcyU9hwqzcJA1iB0ZXVDzbGpKlNHaiGEpo6ed8CrA/s/6mgKEb47By+WRdnv+QxPFkVmPnGjLv7uC9s8WoTqo+lHAAAAAElFTkSuQmCC") /* embed */;\n  background-size: 22px 22px;\n  background-repeat: no-repeat;\n  border-radius: 50%;\n  border-style: solid;\n  border-width: 1px;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 48px;\n  height: 48px;\n  cursor: pointer;\n  background-position: center;\n  background-color: custom-color;\n  border-color: custom-color-darker; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container .intercom-launcher-button {\n      background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAQAAAC0jZKKAAABnklEQVR4AdXOP2gUdgDF8acnElQSEOuSbhUd1CEB0UDQQQiIZBNFUTDgkkEwgqPgqDgGgzjoEhd10kgG/4xOIbTQXKF0aEoqKMYhWXpG83EIx8ER5Jr73ZDP27+81Ok3rqpmo2qqxvXJ2iKi26RVJayatKse7vGrkn73k0RMKe2lxGmdcCqe6YQn8V4nLMQ3nfA1OiRaUTPpogHHXfbUl1LhGftEY/vNlAjP6ZGm9ai2Hx4WUXHVC89dEhFD7Yd7RVxXd17EVp/bDY+KPT6oeyAiqu2GmbOoYUzElvYeN1t233YRRykVfmfANhFR8bpc+KSszU6PKRceFLHXmHnKh0dhk4SHRdwsH/7DGSMWi4frNlF4yi/6/VY+/LOI4fLhYyKuaFHUtOYfN9yypDX/xV864c+4pxPG45AVpa04GHFHabclouKRkh6qSKxtxL9KWDAiIlFfl3MmTHvjk/UsmfXqB5s24awuaYSb1+2tZnftkP+zWG8nNLDqmkiJ8GENNRekVLhP3bIhKRceBHx0RMqH/3ZAyoZ3mzerVza+70aAaX0tAGh+AAAAAElFTkSuQmCC") /* embed */; } }\n#intercom-container.intercom-acquire .intercom-launcher-button {\n  background-image: url(https://js.intercomcdn.com/images/acquire.png) /* noembed */;\n  background-size: 26px 25px;\n  background-repeat: no-repeat; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container.intercom-acquire .intercom-launcher-button {\n      background-image: url(https://js.intercomcdn.com/images/acquire@2x.png) /* noembed */; } }\n#intercom-container.intercom-learn .intercom-launcher-button {\n  background-image: url(https://js.intercomcdn.com/images/inbox.png) /* noembed */;\n  background-size: 22px 20px;\n  background-repeat: no-repeat; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container.intercom-learn .intercom-launcher-button {\n      background-image: url(https://js.intercomcdn.com/images/inbox@2x.png) /* noembed */; } }\n#intercom-container .intercom-launcher-maximized .intercom-launcher-button {\n  background-image: url(https://js.intercomcdn.com/images/icon-launcher-minimized.png) /* noembed */;\n  background-size: 22px 22px;\n  background-repeat: no-repeat; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container .intercom-launcher-maximized .intercom-launcher-button {\n      background-image: url(https://js.intercomcdn.com/images/icon-launcher-minimized@2x.png) /* noembed */; } }\n#intercom-container .intercom-launcher-badge {\n  border-radius: 50%;\n  font-size: 12px;\n  line-height: 18px;\n  background-color: #ff3c00;\n  text-align: center;\n  color: white;\n  position: absolute;\n  width: 18px;\n  height: 18px;\n  top: 0;\n  right: -7px;\n  cursor: pointer; }\n#intercom-container .intercom-launcher-initials {\n  border-radius: 50%;\n  font-size: 22px;\n  line-height: 48px;\n  color: #fff;\n  background-color: custom-color;\n  font-weight: bold;\n  text-align: center;\n  cursor: pointer; }\n#intercom-container .intercom-launcher-preview {\n  font-size: 14px;\n  font-weight: 400;\n  color: #455A64;\n  line-height: 20px;\n  position: absolute;\n  bottom: 2px;\n  right: 60px;\n  max-width: 240px;\n  padding: 12px 14px;\n  color: #333333;\n  border-radius: 10px;\n  background: white;\n  cursor: pointer; }\n  #intercom-container .intercom-launcher-preview .intercom-comment-body {\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 20px; }\n  #intercom-container .intercom-launcher-preview p, #intercom-container .intercom-launcher-preview ul, #intercom-container .intercom-launcher-preview ol, #intercom-container .intercom-launcher-preview blockquote, #intercom-container .intercom-launcher-preview h1, #intercom-container .intercom-launcher-preview h2, #intercom-container .intercom-launcher-preview h3, #intercom-container .intercom-launcher-preview h4, #intercom-container .intercom-launcher-preview h5, #intercom-container .intercom-launcher-preview h6, #intercom-container .intercom-launcher-preview a, #intercom-container .intercom-launcher-preview .intercom-container, #intercom-container .intercom-launcher-preview code {\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 20px;\n    word-wrap: break-word;\n    margin: 20px 0; }\n    #intercom-container .intercom-launcher-preview p:first-child, #intercom-container .intercom-launcher-preview ul:first-child, #intercom-container .intercom-launcher-preview ol:first-child, #intercom-container .intercom-launcher-preview blockquote:first-child, #intercom-container .intercom-launcher-preview h1:first-child, #intercom-container .intercom-launcher-preview h2:first-child, #intercom-container .intercom-launcher-preview h3:first-child, #intercom-container .intercom-launcher-preview h4:first-child, #intercom-container .intercom-launcher-preview h5:first-child, #intercom-container .intercom-launcher-preview h6:first-child, #intercom-container .intercom-launcher-preview a:first-child, #intercom-container .intercom-launcher-preview .intercom-container:first-child, #intercom-container .intercom-launcher-preview code:first-child {\n      margin-top: 0; }\n    #intercom-container .intercom-launcher-preview p:last-child, #intercom-container .intercom-launcher-preview ul:last-child, #intercom-container .intercom-launcher-preview ol:last-child, #intercom-container .intercom-launcher-preview blockquote:last-child, #intercom-container .intercom-launcher-preview h1:last-child, #intercom-container .intercom-launcher-preview h2:last-child, #intercom-container .intercom-launcher-preview h3:last-child, #intercom-container .intercom-launcher-preview h4:last-child, #intercom-container .intercom-launcher-preview h5:last-child, #intercom-container .intercom-launcher-preview h6:last-child, #intercom-container .intercom-launcher-preview a:last-child, #intercom-container .intercom-launcher-preview .intercom-container:last-child, #intercom-container .intercom-launcher-preview code:last-child {\n      margin-bottom: 0; }\n  #intercom-container .intercom-launcher-preview h1, #intercom-container .intercom-launcher-preview h1 a {\n    font-size: 14px;\n    font-weight: 700;\n    line-height: 20px;\n    letter-spacing: normal;\n    margin: 27px 0;\n    color: inherit; }\n  #intercom-container .intercom-launcher-preview h2, #intercom-container .intercom-launcher-preview h2 a {\n    font-size: 14px;\n    line-height: 20px;\n    font-weight: bold;\n    margin: 20px 0 10px;\n    color: inherit; }\n  #intercom-container .intercom-launcher-preview ul, #intercom-container .intercom-launcher-preview ol {\n    font-size: 14px;\n    -moz-padding-start: 40px;\n    -webkit-padding-start: 40px;\n    -khtml-padding-start: 40px;\n    -o-padding-start: 40px;\n    padding-start: 40px;\n    padding-left: 30px; }\n  #intercom-container .intercom-launcher-preview [dir=ltr] ul, #intercom-container .intercom-launcher-preview [dir=ltr] ol {\n    padding-left: 30px; }\n  #intercom-container .intercom-launcher-preview [dir=rtl] ul, #intercom-container .intercom-launcher-preview [dir=rtl] ol {\n    padding-right: 30px; }\n  #intercom-container .intercom-launcher-preview ul > li {\n    list-style-type: disc; }\n  #intercom-container .intercom-launcher-preview ol > li {\n    list-style-type: decimal; }\n  #intercom-container .intercom-launcher-preview li {\n    display: list-item;\n    line-height: 20px;\n    margin-bottom: 10px;\n    font-weight: 400; }\n  #intercom-container .intercom-launcher-preview em, #intercom-container .intercom-launcher-preview i {\n    font-style: italic; }\n  #intercom-container .intercom-launcher-preview strong, #intercom-container .intercom-launcher-preview b {\n    font-weight: bold;\n    line-height: 100%; }\n  #intercom-container .intercom-launcher-preview pre {\n    font-size: 14px;\n    padding: 0 0 10px 0;\n    white-space: pre-wrap; }\n  #intercom-container .intercom-launcher-preview img {\n    display: block;\n    max-width: 100%;\n    margin: 10px 0; }\n  #intercom-container .intercom-launcher-preview p + br {\n    display: none; }\n  #intercom-container .intercom-launcher-preview a:link, #intercom-container .intercom-launcher-preview a:visited, #intercom-container .intercom-launcher-preview a:hover, #intercom-container .intercom-launcher-preview a:active {\n    text-decoration: underline; }\n  #intercom-container .intercom-launcher-preview a:link, #intercom-container .intercom-launcher-preview a:visited {\n    color: custom-color; }\n  #intercom-container .intercom-launcher-preview a:hover, #intercom-container .intercom-launcher-preview a:active {\n    color: custom-color-darker; }\n  #intercom-container .intercom-launcher-preview h2 + p, #intercom-container .intercom-launcher-preview h2 + ul, #intercom-container .intercom-launcher-preview h2 + ol, #intercom-container .intercom-launcher-preview h2 + blockquote, #intercom-container .intercom-launcher-preview h2 + .ic_button_in_content, #intercom-container .intercom-launcher-preview h2 + .ic_social_block, #intercom-container .intercom-launcher-preview h3 + p, #intercom-container .intercom-launcher-preview h3 + ul, #intercom-container .intercom-launcher-preview h3 + ol, #intercom-container .intercom-launcher-preview h3 + blockquote, #intercom-container .intercom-launcher-preview h3 + .ic_button_in_content, #intercom-container .intercom-launcher-preview h3 + .ic_social_block, #intercom-container .intercom-launcher-preview h4 + p, #intercom-container .intercom-launcher-preview h4 + ul, #intercom-container .intercom-launcher-preview h4 + ol, #intercom-container .intercom-launcher-preview h4 + blockquote, #intercom-container .intercom-launcher-preview h4 + .ic_button_in_content, #intercom-container .intercom-launcher-preview h4 + .ic_social_block, #intercom-container .intercom-launcher-preview h5 + p, #intercom-container .intercom-launcher-preview h5 + ul, #intercom-container .intercom-launcher-preview h5 + ol, #intercom-container .intercom-launcher-preview h5 + blockquote, #intercom-container .intercom-launcher-preview h5 + .ic_button_in_content, #intercom-container .intercom-launcher-preview h5 + .ic_social_block, #intercom-container .intercom-launcher-preview h6 + p, #intercom-container .intercom-launcher-preview h6 + ul, #intercom-container .intercom-launcher-preview h6 + ol, #intercom-container .intercom-launcher-preview h6 + blockquote, #intercom-container .intercom-launcher-preview h6 + .ic_button_in_content, #intercom-container .intercom-launcher-preview h6 + .ic_social_block {\n    margin-top: 0; }\n  #intercom-container .intercom-launcher-preview .intercom-h2b-twitter, #intercom-container .intercom-launcher-preview .intercom-h2b-facebook {\n    max-width: 100%; }\n  #intercom-container .intercom-launcher-preview iframe[src*="vimeo.com"], #intercom-container .intercom-launcher-preview iframe[src*="wistia.net"], #intercom-container .intercom-launcher-preview iframe[src*="youtube.com"] {\n    width: 100%;\n    height: 149px;\n    margin: 20px auto; }\n  #intercom-container .intercom-launcher-preview:before, #intercom-container .intercom-launcher-preview:after {\n    content: \'\';\n    position: absolute;\n    top: 0;\n    right: 0;\n    bottom: 0;\n    left: 0;\n    z-index: -1;\n    border-radius: 9.5px; }\n  #intercom-container .intercom-launcher-preview:before {\n    background: rgba(171, 171, 171, 0.24);\n    background-image: linear-gradient(to bottom, #eee, rgba(171, 171, 171, 0.24));\n    top: -1px;\n    right: -1px;\n    bottom: -1px;\n    left: -1px; }\n  #intercom-container .intercom-launcher-preview:after {\n    background-color: #fff; }\n  #intercom-container .intercom-launcher-preview:hover .intercom-launcher-preview-close {\n    opacity: 1; }\n#intercom-container .intercom-launcher-button, #intercom-container .intercom-launcher-preview {\n  box-shadow: 0px 6px 13px 0px rgba(0, 0, 0, 0.23); }\n#intercom-container .intercom-launcher-preview-caret:after, #intercom-container .intercom-launcher-preview-caret:before {\n  left: 100%;\n  border: solid transparent;\n  content: "";\n  height: 0;\n  width: 0;\n  position: absolute;\n  pointer-events: none; }\n#intercom-container .intercom-launcher-preview-caret:after {\n  border-width: 5px;\n  margin-top: -5px;\n  bottom: 18px;\n  border-left-color: white; }\n#intercom-container .intercom-launcher-preview-caret:before {\n  border-width: 6px;\n  margin-top: -6px;\n  bottom: 17px;\n  border-left-color: #ddd; }\n#intercom-container .intercom-launcher-preview-multi-line {\n  bottom: -8px; }\n  #intercom-container .intercom-launcher-preview-multi-line .intercom-launcher-preview-caret:before {\n    bottom: 27px; }\n  #intercom-container .intercom-launcher-preview-multi-line .intercom-launcher-preview-caret:after {\n    bottom: 28px; }\n#intercom-container .intercom-launcher-preview-body {\n  cursor: pointer; }\n  #intercom-container .intercom-launcher-preview-body a.intercom-h2b-button, #intercom-container .intercom-launcher-preview-body div.intercom-h2b-video, #intercom-container .intercom-launcher-preview-body div.intercom-h2b-facebook, #intercom-container .intercom-launcher-preview-body div.intercom-h2b-twitter, #intercom-container .intercom-launcher-preview-body img, #intercom-container .intercom-launcher-preview-body video, #intercom-container .intercom-launcher-preview-body ul, #intercom-container .intercom-launcher-preview-body ol {\n    display: none; }\n  #intercom-container .intercom-launcher-preview-body h1, #intercom-container .intercom-launcher-preview-body h2, #intercom-container .intercom-launcher-preview-body p, #intercom-container .intercom-launcher-preview-body a, #intercom-container .intercom-launcher-preview-body b, #intercom-container .intercom-launcher-preview-body i {\n    word-wrap: break-word;\n    cursor: pointer;\n    display: inline;\n    margin: 0; }\n  #intercom-container .intercom-launcher-preview-body h1, #intercom-container .intercom-launcher-preview-body h2, #intercom-container .intercom-launcher-preview-body p, #intercom-container .intercom-launcher-preview-body a, #intercom-container .intercom-launcher-preview-body i, #intercom-container .intercom-launcher-preview-body b {\n    font-weight: normal;\n    font-style: normal; }\n  #intercom-container .intercom-launcher-preview-body.intercom-launcher-preview-metadata {\n    font-style: italic; }\n#intercom-container .intercom-launcher-preview-close {\n  background-image: url(https://js.intercomcdn.com/images/icon-preview-close.png) /* noembed */;\n  background-size: 18px 18px;\n  background-repeat: no-repeat;\n  opacity: 0;\n  cursor: pointer;\n  position: absolute;\n  top: -9px;\n  left: -9px;\n  width: 18px;\n  height: 18px; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container .intercom-launcher-preview-close {\n      background-image: url(https://js.intercomcdn.com/images/icon-preview-close@2x.png) /* noembed */; } }\n@media (max-width: 480px) {\n  #intercom-container .intercom-launcher-preview {\n    max-width: 200px; } }\n#intercom-container .intercom-launcher-hovercard {\n  display: none;\n  cursor: pointer;\n  position: absolute;\n  right: -5px;\n  bottom: 64px;\n  background-color: #fafafb;\n  width: 340px;\n  border-radius: 5px;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08); }\n  #intercom-container .intercom-launcher-hovercard:after, #intercom-container .intercom-launcher-hovercard:before {\n    top: 100%;\n    right: 20px;\n    border: solid transparent;\n    content: " ";\n    height: 0;\n    width: 0;\n    position: absolute;\n    pointer-events: none; }\n  #intercom-container .intercom-launcher-hovercard:after {\n    border-color: rgba(250, 250, 251, 0);\n    border-top-color: #fafafb;\n    border-width: 8px;\n    margin-left: -5px;\n    right: 21px; }\n  #intercom-container .intercom-launcher-hovercard:before {\n    border-color: rgba(204, 204, 204, 0);\n    border-top-color: rgba(0, 0, 0, 0.14);\n    border-width: 9px;\n    margin-left: -6px; }\n#intercom-container .intercom-launcher-hovercard-welcome {\n  background-color: #fff;\n  border-radius: 5px 5px 0 0;\n  border-bottom: 1px solid #dfe0e1;\n  box-shadow: 0 1px 1px #f0f0f1;\n  padding: 26px 20px 26px 20px;\n  overflow: hidden;\n  cursor: pointer; }\n#intercom-container .intercom-launcher-hovercard-admins {\n  width: 107px;\n  position: relative;\n  float: left;\n  height: 50px;\n  cursor: pointer;\n  text-align: center; }\n  #intercom-container .intercom-launcher-hovercard-admins .intercom-admin-avatar, #intercom-container .intercom-launcher-hovercard-admins .intercom-admin-avatar img {\n    width: 46px;\n    height: 46px; }\n  #intercom-container .intercom-launcher-hovercard-admins .intercom-admin-fallback-avatar {\n    line-height: 46px;\n    font-size: 18.4px; }\n  #intercom-container .intercom-launcher-hovercard-admins .intercom-admin-avatar, #intercom-container .intercom-launcher-hovercard-admins .intercom-admin-fallback-avatar {\n    position: relative;\n    display: inline-block;\n    top: 0;\n    border: 2px solid #fff;\n    cursor: pointer;\n    margin-left: -22px;\n    z-index: 2147483002; }\n    #intercom-container .intercom-launcher-hovercard-admins .intercom-admin-avatar:first-child, #intercom-container .intercom-launcher-hovercard-admins .intercom-admin-fallback-avatar:first-child {\n      margin-left: 0;\n      z-index: 2147483003; }\n    #intercom-container .intercom-launcher-hovercard-admins .intercom-admin-avatar:last-child, #intercom-container .intercom-launcher-hovercard-admins .intercom-admin-fallback-avatar:last-child {\n      z-index: 2147483001; }\n#intercom-container .intercom-launcher-hovercard-text {\n  float: right;\n  width: 174px;\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  cursor: pointer; }\n#intercom-container .intercom-launcher-hovercard-app-name {\n  font-weight: bold;\n  font-size: 14px;\n  color: #37474f;\n  margin-bottom: 7px;\n  cursor: pointer; }\n#intercom-container .intercom-launcher-hovercard-welcome-text {\n  font-size: 12px;\n  color: #78909C;\n  line-height: 1.5;\n  cursor: pointer; }\n#intercom-container .intercom-launcher-hovercard-textarea {\n  padding: 18px 16px;\n  font-size: 16px;\n  border-radius: 0 0 5px 5px;\n  height: 42px;\n  cursor: pointer; }\n  #intercom-container .intercom-launcher-hovercard-textarea textarea {\n    width: 100%;\n    height: 42px;\n    box-sizing: border-box;\n    background-color: #fff;\n    font-weight: 400;\n    color: #455A64;\n    resize: none;\n    border: 1px solid #CFD8DC;\n    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n    font-size: 14px;\n    line-height: 20px;\n    padding: 10px 70px 5px 14px;\n    border-radius: 4px; }\n    #intercom-container .intercom-launcher-hovercard-textarea textarea::-webkit-input-placeholder {\n      color: #B0BEC5;\n      font-style: "Helvetica Neue", Helvetica, Arial, sans-serif;\n      font-size: 14px;\n      font-weight: 400;\n      line-height: 20px; }\n    #intercom-container .intercom-launcher-hovercard-textarea textarea::-moz-placeholder {\n      color: #B0BEC5;\n      font-style: "Helvetica Neue", Helvetica, Arial, sans-serif;\n      font-size: 14px;\n      font-weight: 400;\n      line-height: 20px; }\n    #intercom-container .intercom-launcher-hovercard-textarea textarea:-ms-input-placeholder {\n      color: #B0BEC5;\n      font-style: "Helvetica Neue", Helvetica, Arial, sans-serif;\n      font-size: 14px;\n      font-weight: 400;\n      line-height: 20px; }\n\n#intercom-container .intercom-messenger {\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif; }\n\n#intercom-container .intercom-sheet {\n  z-index: 2147483000;\n  visibility: hidden;\n  position: fixed;\n  height: 100%;\n  width: 368px;\n  bottom: 0;\n  right: 0; }\n#intercom-container .intercom-sheet-active {\n  visibility: visible; }\n#intercom-container .intercom-sheet-header {\n  z-index: 2147483002;\n  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.12);\n  background: white;\n  overflow: hidden;\n  position: absolute;\n  top: 0;\n  right: 0;\n  width: 100%;\n  height: 48px; }\n#intercom-container .intercom-sheet-footer {\n  z-index: 2147483002;\n  box-shadow: 0 -1px 2px 0 rgba(0, 0, 0, 0.06);\n  background: white;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 100%;\n  height: 48px;\n  text-align: center;\n  -moz-text-align-last: center;\n       text-align-last: center; }\n#intercom-container .intercom-sheet-body {\n  z-index: 2147483000;\n  background: #fafafb;\n  background: rgba(250, 250, 251, 0.98);\n  border-left: 1px solid #dadee2;\n  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.08);\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%; }\n#intercom-container .intercom-sheet-active .intercom-sheet-content {\n  overflow-y: auto; }\n#intercom-container .intercom-sheet-content {\n  z-index: 2147483001;\n  position: absolute;\n  top: 48px;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  -webkit-transform: translateZ(0); }\n#intercom-container .intercom-sheet-content-container {\n  box-sizing: border-box;\n  position: relative;\n  min-height: 100%;\n  max-width: 620px;\n  margin: 0 auto; }\n#intercom-container .intercom-sheet-header-generic-title, #intercom-container .intercom-sheet-header-title-container {\n  z-index: 2147483000;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  text-align: center;\n  -moz-text-align-last: center;\n       text-align-last: center;\n  pointer-events: none; }\n#intercom-container .intercom-sheet-header-generic-title, #intercom-container .intercom-sheet-header-title {\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-size: 15px;\n  line-height: 48px;\n  font-weight: 500;\n  color: #465C66;\n  letter-spacing: 0.2px;\n  display: inline-block;\n  max-width: 200px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n  #intercom-container .intercom-sheet-header-generic-title.intercom-sheet-header-with-presence, #intercom-container .intercom-sheet-header-title.intercom-sheet-header-with-presence {\n    line-height: 20px;\n    padding-top: 7px; }\n#intercom-container .intercom-sheet-header-generic-title {\n  display: none;\n  top: -100%;\n  max-width: 100%; }\n#intercom-container .intercom-sheet-header-show-generic .intercom-sheet-header-generic-title {\n  display: block;\n  top: 0; }\n#intercom-container .intercom-sheet-header-show-generic .intercom-sheet-header-title-container {\n  display: none;\n  top: 100%; }\n#intercom-container .intercom-last-active {\n  position: absolute;\n  z-index: 0;\n  text-align: center;\n  color: #90A4AE;\n  font-size: 12px;\n  left: 0;\n  right: 0;\n  bottom: 7px;\n  line-height: 14px; }\n#intercom-container .intercom-sheet-header-app-name {\n  font-weight: bold; }\n#intercom-container .intercom-sheet-header-button {\n  z-index: 2147483001;\n  position: relative;\n  margin: 0 20px;\n  height: 48px; }\n#intercom-container .intercom-sheet-header-button-icon {\n  height: 100%;\n  background-position: center center; }\n#intercom-container .intercom-sheet-header-conversations-button {\n  float: left; }\n  #intercom-container .intercom-sheet-header-conversations-button .intercom-sheet-header-button-icon {\n    background-image: url(https://js.intercomcdn.com/images/icon-conversations.png) /* noembed */;\n    background-size: 15px 12px;\n    background-repeat: no-repeat;\n    background-position: center;\n    width: 18px;\n    float: left;\n    opacity: 0.4; }\n    @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n      #intercom-container .intercom-sheet-header-conversations-button .intercom-sheet-header-button-icon {\n        background-image: url(https://js.intercomcdn.com/images/icon-conversations@2x.png) /* noembed */; } }\n  #intercom-container .intercom-sheet-header-conversations-button .intercom-sheet-header-button-icon:hover {\n    opacity: 1;\n    transition: opacity 200ms linear; }\n#intercom-container .intercom-sheet-header-close-button {\n  float: right;\n  margin-left: 15px; }\n  #intercom-container .intercom-sheet-header-close-button .intercom-sheet-header-button-icon {\n    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAYAAAA71pVKAAAAq0lEQVR42o2RMQoCMRBFcwQ776C11upOekHEnaC47sQbWomIlWfRSm+wZiBFIAzfgYEw/PeKfLdYdyNiuSz5OHV/TLM9TTSvnPMsVx/ikPadBQh8aZ6C3Fyz62bp8SkFEOT4XQWZ670SaBCCeWwBBm0Bcb+xQSwYEFgLOO5L2LdyAEj9ObpGC7gOavuz0QLu0WoBgqhGCEJBOtwBWAly/qG1jInlWYJIoHnlfhcTzX2HEVUjAAAAAElFTkSuQmCC") /* embed */;\n    background-size: 13px 13px;\n    background-repeat: no-repeat;\n    width: 16px;\n    opacity: 0.4; }\n    @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n      #intercom-container .intercom-sheet-header-close-button .intercom-sheet-header-button-icon {\n        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAMAAAAM7l6QAAAAUVBMVEUAAAAAAAAAVVUzTU0uRl1EWGRCWWFFWGNDWWNEWWNDWWNFWWNEWmNFWWNEWWREWmNEWWREWWNEWWNFWWREWmNEWWNFWmNFWmREWWRFWmRFWmTQYCLkAAAAGnRSTlMAAgMKC0BCXV+am6Cio6SlprS3vb6/wfX2/eBzOYoAAACDSURBVHja3dFJDsJADETRYgozYQqQvv9BaYNQqfWdC+CNF29V+pJWu7mSm207hT5Lb7ceyqv7aAmnlvBLfeHQuKsWw8+pj6XsqTYOhUNlh8IbhTdKt6ZuhUPhVjY6ffmMPt7r/VQ4Kgz2rODf9NXeSj9qPU73HTcKn+gbWv2e971VfQPHpCEx8fOtQAAAAABJRU5ErkJggg==") /* embed */; } }\n  #intercom-container .intercom-sheet-header-close-button .intercom-sheet-header-button-icon:hover {\n    opacity: 1;\n    transition: opacity 200ms linear; }\n#intercom-container .intercom-sheet-header-minimize-button {\n  float: right;\n  margin-right: 0; }\n  #intercom-container .intercom-sheet-header-minimize-button .intercom-sheet-header-button-icon {\n    background-image: url(https://js.intercomcdn.com/images/icon-minimize.png) /* noembed */;\n    background-size: 15px 15px;\n    background-repeat: no-repeat;\n    width: 16px;\n    opacity: 0.4; }\n    @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n      #intercom-container .intercom-sheet-header-minimize-button .intercom-sheet-header-button-icon {\n        background-image: url(https://js.intercomcdn.com/images/icon-minimize@2x.png) /* noembed */; } }\n  #intercom-container .intercom-sheet-header-minimize-button .intercom-sheet-header-button-icon:hover {\n    opacity: 1;\n    transition: opacity 200ms linear; }\n#intercom-container .intercom-sheet-loading .intercom-sheet-spinner {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  margin-left: -14px;\n  margin-top: 14px; }\n#intercom-container .intercom-sheet-minimized {\n  opacity: 0;\n  visibility: hidden; }\n#intercom-container .intercom-sheet-maximized {\n  width: 100%; }\n@media (max-width: 460px) {\n  #intercom-container .intercom-sheet {\n    width: 100%; } }\n@media (-ms-high-contrast: none), screen\\0 {\n  #intercom-container .intercom-sheet {\n    width: 370px; }\n  #intercom-container .intercom-sheet-maximized {\n    width: 100%; } }\n\n#intercom-container .intercom-conversation-parts-container {\n  padding: 16px; }\n#intercom-container .intercom-conversation-part {\n  padding-bottom: 16px; }\n  #intercom-container .intercom-conversation-part:before, #intercom-container .intercom-conversation-part:after {\n    content: " ";\n    display: table; }\n  #intercom-container .intercom-conversation-part:after {\n    clear: both; }\n#intercom-container .intercom-conversation-part-unread .intercom-comment-by-admin .intercom-comment-timestamp {\n  color: #93979f; }\n#intercom-container .intercom-conversation-part-unread .intercom-comment-by-admin .intercom-comment-readstate {\n  border-radius: 50%;\n  background-color: custom-color;\n  width: 7px;\n  height: 7px;\n  margin-top: 6px;\n  overflow: auto; }\n#intercom-container .intercom-conversation-part-failed .intercom-comment-body-container {\n  opacity: 0.6; }\n#intercom-container .intercom-conversation-part-failed .intercom-comment-state, #intercom-container .intercom-conversation-part-failed .intercom-comment-body {\n  cursor: pointer; }\n#intercom-container .intercom-conversation-part-failed .intercom-comment-metadata {\n  color: #c00; }\n#intercom-container .intercom-sheet-loading .intercom-conversation-parts, #intercom-container .intercom-sheet-loading .intercom-powered-by-container {\n  opacity: 0; }\n#intercom-container .intercom-conversation-preview {\n  pointer-events: none; }\n  #intercom-container .intercom-conversation-preview .intercom-sheet-header, #intercom-container .intercom-conversation-preview .intercom-sheet-body, #intercom-container .intercom-conversation-preview .intercom-composer {\n    opacity: 0; }\n  #intercom-container .intercom-conversation-preview .intercom-sheet-content {\n    overflow-y: hidden; }\n  #intercom-container .intercom-conversation-preview .intercom-small-announcement {\n    box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.08);\n    pointer-events: auto; }\n#intercom-container .intercom-conversation-part-grouped-first, #intercom-container .intercom-conversation-part-grouped {\n  padding-bottom: 2px; }\n  #intercom-container .intercom-conversation-part-grouped-first .intercom-comment-metadata, #intercom-container .intercom-conversation-part-grouped-first .intercom-comment-readstate, #intercom-container .intercom-conversation-part-grouped .intercom-comment-metadata, #intercom-container .intercom-conversation-part-grouped .intercom-comment-readstate {\n    display: none; }\n#intercom-container .intercom-conversation-part-grouped .intercom-comment-avatar, #intercom-container .intercom-conversation-part-grouped .intercom-comment-caret, #intercom-container .intercom-conversation-part-grouped-last .intercom-comment-avatar, #intercom-container .intercom-conversation-part-grouped-last .intercom-comment-caret {\n  display: none; }\n\n#intercom-container .intercom-conversations-item {\n  display: block;\n  padding-top: 17px;\n  padding-left: 17px;\n  text-decoration: none; }\n  #intercom-container .intercom-conversations-item, #intercom-container .intercom-conversations-item * {\n    cursor: pointer; }\n  #intercom-container .intercom-conversations-item:hover {\n    background-color: rgba(0, 0, 0, 0.02); }\n#intercom-container .intercom-conversations-item-user-avatar, #intercom-container .intercom-conversations-item-admin-avatar {\n  border-radius: 50%;\n  float: left;\n  margin-top: 5px;\n  display: inline-block;\n  width: 42px;\n  height: 42px; }\n#intercom-container .intercom-conversations-item-admin-avatar {\n  color: #fff;\n  line-height: 42px;\n  text-align: center;\n  font-size: 18px;\n  font-weight: bold; }\n#intercom-container .intercom-conversations-item-admin-avatar-no-image {\n  background-color: custom-color; }\n#intercom-container .intercom-conversations-item-user-avatar {\n  background-color: custom-color;\n  background-image: url(https://js.intercomcdn.com/images/icon-user-avatar.svg);\n  background-repeat: no-repeat;\n  background-position: center center;\n  background-size: 18px; }\n#intercom-container .intercom-default-admin-avatar {\n  background-color: custom-color;\n  font-size: 13px;\n  font-weight: bold;\n  text-align: center;\n  color: #fff;\n  width: 28px;\n  height: 28px;\n  line-height: 28px; }\n#intercom-container .intercom-conversations-item-body-container {\n  margin-left: 55px;\n  padding-right: 17px;\n  border-bottom: 1px solid #e7e7e7;\n  height: 80px; }\n#intercom-container .intercom-conversations-item-header {\n  margin-bottom: 5px; }\n#intercom-container .intercom-conversations-item-title-container {\n  margin: 0 50px 0 0; }\n#intercom-container .intercom-conversations-item-title {\n  color: #60686e;\n  color: rgba(96, 104, 110, 0.8);\n  font-size: 15px;\n  line-height: 22px;\n  font-weight: 500;\n  display: block;\n  width: 100%;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n#intercom-container .intercom-conversations-item-timestamp {\n  float: right;\n  font-size: 12px;\n  line-height: 20px;\n  color: #aaaaaa;\n  width: 50px;\n  text-align: right; }\n#intercom-container .intercom-conversations-item-summary {\n  color: #60686e;\n  color: rgba(96, 104, 110, 0.8);\n  font-size: 14px;\n  font-weight: 400;\n  line-height: 19px;\n  height: 40px;\n  overflow: hidden;\n  position: relative;\n  padding-right: 15px;\n  word-break: break-word; }\n  #intercom-container .intercom-conversations-item-summary.intercom-conversations-item-summary-metadata {\n    font-style: italic; }\n#intercom-container .intercom-conversations-new-conversation-button {\n  margin: 8px;\n  font-weight: 500;\n  padding: 0 18px; }\n  #intercom-container .intercom-conversations-new-conversation-button i {\n    background: url(https://js.intercomcdn.com/images/icon-compose.svg) 0 0/15px 15px no-repeat;\n    display: inline-block;\n    width: 15px;\n    height: 15px;\n    margin: 0 8px -2px 0; }\n#intercom-container .intercom-conversations-item-unread .intercom-conversations-item-header span {\n  color: #3d4347;\n  font-weight: 500;\n  white-space: nowrap; }\n#intercom-container .intercom-conversations-item-unread .intercom-conversations-item-summary {\n  color: #3d4347; }\n#intercom-container .intercom-conversations-item-unread .intercom-conversations-item-readstate {\n  border-radius: 50%;\n  background-color: custom-color;\n  width: 7px;\n  height: 7px;\n  position: absolute;\n  bottom: 27px;\n  right: 0; }\n#intercom-container .intercom-no-conversations {\n  position: absolute;\n  top: 50%;\n  left: 0;\n  right: 0;\n  margin: -38px auto 0;\n  text-align: center;\n  color: #e4e5e7;\n  display: none; }\n  #intercom-container .intercom-no-conversations .intercom-no-conversations-icon {\n    background-image: url(https://js.intercomcdn.com/images/icon-no-conversations.png) /* noembed */;\n    background-size: 79px 59px;\n    background-repeat: no-repeat;\n    display: block;\n    width: 79px;\n    height: 59px;\n    margin: 0 auto 10px auto; }\n    @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n      #intercom-container .intercom-no-conversations .intercom-no-conversations-icon {\n        background-image: url(https://js.intercomcdn.com/images/icon-no-conversations@2x.png) /* noembed */; } }\n#intercom-container.intercom-learn .intercom-no-conversations .intercom-no-conversations-icon {\n  height: 46px;\n  background-image: url(https://js.intercomcdn.com/images/empty-inbox.png) /* noembed */;\n  background-size: 79px 46px;\n  background-repeat: no-repeat; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container.intercom-learn .intercom-no-conversations .intercom-no-conversations-icon {\n      background-image: url(https://js.intercomcdn.com/images/empty-inbox@2x.png) /* noembed */; } }\n#intercom-container .intercom-conversations-empty .intercom-no-conversations {\n  display: block; }\n#intercom-container .intercom-new-message-enabled .intercom-conversations-content {\n  bottom: 48px; }\n#intercom-container .intercom-conversations-fetching .intercom-conversations-spinner {\n  position: relative;\n  left: 50%;\n  margin-left: -14px;\n  margin-top: 40px;\n  margin-bottom: 40px; }\n\n#intercom-container .intercom-attachments {\n  border-top: 1px solid #e4e5e7;\n  padding: 11px 14px; }\n#intercom-container .intercom-attachment {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  width: 100%;\n  font-size: 14px; }\n#intercom-container .intercom-comment-by-user .intercom-attachments {\n  border-top: 1px solid custom-color-dark; }\n\n#intercom-container .intercom-comment {\n  line-height: 20px;\n  position: relative;\n  clear: both;\n  max-width: 272px; }\n#intercom-container .intercom-comment-by-user {\n  float: right; }\n#intercom-container .intercom-comment-by-admin {\n  float: left;\n  padding-left: 38px; }\n#intercom-container .intercom-comment-is-typing-icon {\n  display: none; }\n#intercom-container .intercom-comment-avatar {\n  border-radius: 50%;\n  width: 28px;\n  height: 28px;\n  position: absolute;\n  left: 0;\n  top: 9px; }\n#intercom-container .intercom-comment-body-container {\n  font-size: 14px;\n  font-weight: 400;\n  color: #455A64;\n  line-height: 20px;\n  border-radius: 9px;\n  border-width: 1px;\n  border-style: solid;\n  position: relative;\n  max-width: 100%; }\n  #intercom-container .intercom-comment-body-container .intercom-comment-body {\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 20px; }\n  #intercom-container .intercom-comment-body-container p, #intercom-container .intercom-comment-body-container ul, #intercom-container .intercom-comment-body-container ol, #intercom-container .intercom-comment-body-container blockquote, #intercom-container .intercom-comment-body-container h1, #intercom-container .intercom-comment-body-container h2, #intercom-container .intercom-comment-body-container h3, #intercom-container .intercom-comment-body-container h4, #intercom-container .intercom-comment-body-container h5, #intercom-container .intercom-comment-body-container h6, #intercom-container .intercom-comment-body-container a, #intercom-container .intercom-comment-body-container .intercom-container, #intercom-container .intercom-comment-body-container code {\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 20px;\n    word-wrap: break-word;\n    margin: 20px 0; }\n    #intercom-container .intercom-comment-body-container p:first-child, #intercom-container .intercom-comment-body-container ul:first-child, #intercom-container .intercom-comment-body-container ol:first-child, #intercom-container .intercom-comment-body-container blockquote:first-child, #intercom-container .intercom-comment-body-container h1:first-child, #intercom-container .intercom-comment-body-container h2:first-child, #intercom-container .intercom-comment-body-container h3:first-child, #intercom-container .intercom-comment-body-container h4:first-child, #intercom-container .intercom-comment-body-container h5:first-child, #intercom-container .intercom-comment-body-container h6:first-child, #intercom-container .intercom-comment-body-container a:first-child, #intercom-container .intercom-comment-body-container .intercom-container:first-child, #intercom-container .intercom-comment-body-container code:first-child {\n      margin-top: 0; }\n    #intercom-container .intercom-comment-body-container p:last-child, #intercom-container .intercom-comment-body-container ul:last-child, #intercom-container .intercom-comment-body-container ol:last-child, #intercom-container .intercom-comment-body-container blockquote:last-child, #intercom-container .intercom-comment-body-container h1:last-child, #intercom-container .intercom-comment-body-container h2:last-child, #intercom-container .intercom-comment-body-container h3:last-child, #intercom-container .intercom-comment-body-container h4:last-child, #intercom-container .intercom-comment-body-container h5:last-child, #intercom-container .intercom-comment-body-container h6:last-child, #intercom-container .intercom-comment-body-container a:last-child, #intercom-container .intercom-comment-body-container .intercom-container:last-child, #intercom-container .intercom-comment-body-container code:last-child {\n      margin-bottom: 0; }\n  #intercom-container .intercom-comment-body-container h1, #intercom-container .intercom-comment-body-container h1 a {\n    font-size: 14px;\n    font-weight: 700;\n    line-height: 20px;\n    letter-spacing: normal;\n    margin: 27px 0;\n    color: inherit; }\n  #intercom-container .intercom-comment-body-container h2, #intercom-container .intercom-comment-body-container h2 a {\n    font-size: 14px;\n    line-height: 20px;\n    font-weight: bold;\n    margin: 20px 0 10px;\n    color: inherit; }\n  #intercom-container .intercom-comment-body-container ul, #intercom-container .intercom-comment-body-container ol {\n    font-size: 14px;\n    -moz-padding-start: 40px;\n    -webkit-padding-start: 40px;\n    -khtml-padding-start: 40px;\n    -o-padding-start: 40px;\n    padding-start: 40px;\n    padding-left: 30px; }\n  #intercom-container .intercom-comment-body-container [dir=ltr] ul, #intercom-container .intercom-comment-body-container [dir=ltr] ol {\n    padding-left: 30px; }\n  #intercom-container .intercom-comment-body-container [dir=rtl] ul, #intercom-container .intercom-comment-body-container [dir=rtl] ol {\n    padding-right: 30px; }\n  #intercom-container .intercom-comment-body-container ul > li {\n    list-style-type: disc; }\n  #intercom-container .intercom-comment-body-container ol > li {\n    list-style-type: decimal; }\n  #intercom-container .intercom-comment-body-container li {\n    display: list-item;\n    line-height: 20px;\n    margin-bottom: 10px;\n    font-weight: 400; }\n  #intercom-container .intercom-comment-body-container em, #intercom-container .intercom-comment-body-container i {\n    font-style: italic; }\n  #intercom-container .intercom-comment-body-container strong, #intercom-container .intercom-comment-body-container b {\n    font-weight: bold;\n    line-height: 100%; }\n  #intercom-container .intercom-comment-body-container pre {\n    font-size: 14px;\n    padding: 0 0 10px 0;\n    white-space: pre-wrap; }\n  #intercom-container .intercom-comment-body-container img {\n    display: block;\n    max-width: 100%;\n    margin: 10px 0; }\n  #intercom-container .intercom-comment-body-container p + br {\n    display: none; }\n  #intercom-container .intercom-comment-body-container a:link, #intercom-container .intercom-comment-body-container a:visited, #intercom-container .intercom-comment-body-container a:hover, #intercom-container .intercom-comment-body-container a:active {\n    text-decoration: underline; }\n  #intercom-container .intercom-comment-body-container a:link, #intercom-container .intercom-comment-body-container a:visited {\n    color: custom-color; }\n  #intercom-container .intercom-comment-body-container a:hover, #intercom-container .intercom-comment-body-container a:active {\n    color: custom-color-darker; }\n  #intercom-container .intercom-comment-body-container h2 + p, #intercom-container .intercom-comment-body-container h2 + ul, #intercom-container .intercom-comment-body-container h2 + ol, #intercom-container .intercom-comment-body-container h2 + blockquote, #intercom-container .intercom-comment-body-container h2 + .ic_button_in_content, #intercom-container .intercom-comment-body-container h2 + .ic_social_block, #intercom-container .intercom-comment-body-container h3 + p, #intercom-container .intercom-comment-body-container h3 + ul, #intercom-container .intercom-comment-body-container h3 + ol, #intercom-container .intercom-comment-body-container h3 + blockquote, #intercom-container .intercom-comment-body-container h3 + .ic_button_in_content, #intercom-container .intercom-comment-body-container h3 + .ic_social_block, #intercom-container .intercom-comment-body-container h4 + p, #intercom-container .intercom-comment-body-container h4 + ul, #intercom-container .intercom-comment-body-container h4 + ol, #intercom-container .intercom-comment-body-container h4 + blockquote, #intercom-container .intercom-comment-body-container h4 + .ic_button_in_content, #intercom-container .intercom-comment-body-container h4 + .ic_social_block, #intercom-container .intercom-comment-body-container h5 + p, #intercom-container .intercom-comment-body-container h5 + ul, #intercom-container .intercom-comment-body-container h5 + ol, #intercom-container .intercom-comment-body-container h5 + blockquote, #intercom-container .intercom-comment-body-container h5 + .ic_button_in_content, #intercom-container .intercom-comment-body-container h5 + .ic_social_block, #intercom-container .intercom-comment-body-container h6 + p, #intercom-container .intercom-comment-body-container h6 + ul, #intercom-container .intercom-comment-body-container h6 + ol, #intercom-container .intercom-comment-body-container h6 + blockquote, #intercom-container .intercom-comment-body-container h6 + .ic_button_in_content, #intercom-container .intercom-comment-body-container h6 + .ic_social_block {\n    margin-top: 0; }\n  #intercom-container .intercom-comment-body-container .intercom-h2b-twitter, #intercom-container .intercom-comment-body-container .intercom-h2b-facebook {\n    max-width: 100%; }\n  #intercom-container .intercom-comment-body-container iframe[src*="vimeo.com"], #intercom-container .intercom-comment-body-container iframe[src*="wistia.net"], #intercom-container .intercom-comment-body-container iframe[src*="youtube.com"] {\n    width: 100%;\n    height: 149px;\n    margin: 20px auto; }\n#intercom-container .intercom-comment .intercom-lwr-composer {\n  border-radius: 0 0 4px 4px; }\n#intercom-container .intercom-comment-body {\n  padding: 12px 17px; }\n  #intercom-container .intercom-comment-body p {\n    margin: 1em 0 0; }\n    #intercom-container .intercom-comment-body p:first-child {\n      margin-top: 0; }\n  #intercom-container .intercom-comment-body pre span {\n    color: inherit !important;\n    background-color: inherit !important;\n    font-weight: inherit !important;\n    word-wrap: break-word; }\n#intercom-container .intercom-comment-metadata-container {\n  padding: 2px 2px 0; }\n#intercom-container .intercom-comment-metadata {\n  font-size: 12px;\n  line-height: 20px;\n  color: #B0BEC5;\n  float: left; }\n#intercom-container .intercom-comment-by-admin .intercom-comment-metadata {\n  margin-right: 6px; }\n#intercom-container .intercom-comment-caret:after, #intercom-container .intercom-comment-caret:before {\n  top: 19px;\n  border: solid transparent;\n  content: "";\n  height: 0;\n  width: 0;\n  position: absolute;\n  pointer-events: none; }\n#intercom-container .intercom-comment-caret:after {\n  border-width: 3px;\n  margin-top: 1px; }\n#intercom-container .intercom-comment-caret:before {\n  border-width: 4px; }\n#intercom-container .intercom-comment-by-user {\n  text-align: right; }\n  #intercom-container .intercom-comment-by-user .intercom-comment-body-container {\n    display: inline-block;\n    background-color: custom-color;\n    color: white; }\n    #intercom-container .intercom-comment-by-user .intercom-comment-body-container a, #intercom-container .intercom-comment-by-user .intercom-comment-body-container a:link, #intercom-container .intercom-comment-by-user .intercom-comment-body-container a:visited, #intercom-container .intercom-comment-by-user .intercom-comment-body-container a:hover, #intercom-container .intercom-comment-by-user .intercom-comment-body-container a:active {\n      color: white; }\n  #intercom-container .intercom-comment-by-user .intercom-comment-metadata {\n    float: right; }\n  #intercom-container .intercom-comment-by-user .intercom-comment-caret:before, #intercom-container .intercom-comment-by-user .intercom-comment-caret:after {\n    left: 100%; }\n  #intercom-container .intercom-comment-by-user .intercom-comment-caret:after {\n    border-width: 4px;\n    margin-top: -1px;\n    border-left-color: custom-color; }\n#intercom-container .intercom-comment-by-admin .intercom-comment-body-container {\n  box-shadow: 0 1px 2px 0 rgba(234, 236, 238, 0.8);\n  background-color: white;\n  border-color: #dadee2; }\n#intercom-container .intercom-comment-by-admin .intercom-comment-caret:after, #intercom-container .intercom-comment-by-admin .intercom-comment-caret:before {\n  right: 100%; }\n#intercom-container .intercom-comment-by-admin .intercom-comment-caret:after {\n  border-right-color: white; }\n#intercom-container .intercom-comment-by-admin .intercom-comment-caret:before {\n  border-right-color: #dadee2; }\n#intercom-container .intercom-upload-comment.intercom-upload-is-uploading .intercom-comment-body-container {\n  opacity: 0.6; }\n  #intercom-container .intercom-upload-comment.intercom-upload-is-uploading .intercom-comment-body-container a, #intercom-container .intercom-upload-comment.intercom-upload-is-uploading .intercom-comment-body-container a:link, #intercom-container .intercom-upload-comment.intercom-upload-is-uploading .intercom-comment-body-container a:visited, #intercom-container .intercom-upload-comment.intercom-upload-is-uploading .intercom-comment-body-container a:hover, #intercom-container .intercom-upload-comment.intercom-upload-is-uploading .intercom-comment-body-container a:active {\n    text-decoration: none;\n    cursor: default; }\n#intercom-container .intercom-upload-comment .intercom-upload-body {\n  padding-left: 50px; }\n  #intercom-container .intercom-upload-comment .intercom-upload-body:before {\n    content: \' \';\n    position: absolute;\n    left: 0;\n    top: 8px;\n    bottom: 8px;\n    width: 37px;\n    border-right: 1px solid #fff;\n    border-right: 1px solid rgba(255, 255, 255, 0.3);\n    background-image: url(https://js.intercomcdn.com/images/icon-upload-white.png) /* noembed */;\n    background-size: 16px 15px;\n    background-repeat: no-repeat;\n    background-position: center;\n    background-repeat: no-repeat; }\n    @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n      #intercom-container .intercom-upload-comment .intercom-upload-body:before {\n        background-image: url(https://js.intercomcdn.com/images/icon-upload-white@2x.png) /* noembed */; } }\n#intercom-container .intercom-upload-comment.intercom-upload-image {\n  max-width: 266px; }\n  #intercom-container .intercom-upload-comment.intercom-upload-image .intercom-comment-body-container {\n    background-color: transparent; }\n  #intercom-container .intercom-upload-comment.intercom-upload-image .intercom-comment-caret {\n    display: none; }\n  #intercom-container .intercom-upload-comment.intercom-upload-image .intercom-upload-body {\n    padding: 0; }\n    #intercom-container .intercom-upload-comment.intercom-upload-image .intercom-upload-body:before {\n      display: none; }\n    #intercom-container .intercom-upload-comment.intercom-upload-image .intercom-upload-body img {\n      margin: 0;\n      border-radius: 4px; }\n#intercom-container .intercom-upload-comment .intercom-attachment-progress-bar {\n  border-radius: 4px;\n  position: relative;\n  display: inline-block;\n  width: 50px;\n  height: 6px;\n  border: 1px solid #ccc;\n  vertical-align: middle;\n  background-color: #fff;\n  margin: 0 5px; }\n#intercom-container .intercom-upload-comment .intercom-attachment-progress-percentage {\n  transition: width 0.4s;\n  width: 0%;\n  border-radius: 3px;\n  background-color: custom-color;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0; }\n#intercom-container .intercom-conversation-preview .intercom-comment-metadata {\n  display: none; }\n\n#intercom-container .intercom-auto-response {\n  display: none;\n  margin-bottom: 16px;\n  padding: 16px;\n  border-width: 1px 0 1px 0;\n  border-style: solid;\n  border-top: 1px solid #e4e5e7;\n  border-bottom: 1px solid #e4e5e7;\n  border-image: linear-gradient(to right, #edf0f2, #E5E5E5 18%, #E5E5E5 82%, #edf0f2) 1; }\n#intercom-container .intercom-auto-response-active {\n  display: block; }\n#intercom-container .intercom-auto-response p {\n  font-size: 14px;\n  font-weight: 400;\n  color: #455A64;\n  line-height: 20px;\n  font-size: 13px;\n  color: #90A4AE;\n  line-height: 18px;\n  text-align: center;\n  padding: 5px 0; }\n  #intercom-container .intercom-auto-response p .intercom-comment-body {\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 20px; }\n  #intercom-container .intercom-auto-response p p, #intercom-container .intercom-auto-response p ul, #intercom-container .intercom-auto-response p ol, #intercom-container .intercom-auto-response p blockquote, #intercom-container .intercom-auto-response p h1, #intercom-container .intercom-auto-response p h2, #intercom-container .intercom-auto-response p h3, #intercom-container .intercom-auto-response p h4, #intercom-container .intercom-auto-response p h5, #intercom-container .intercom-auto-response p h6, #intercom-container .intercom-auto-response p a, #intercom-container .intercom-auto-response p .intercom-container, #intercom-container .intercom-auto-response p code {\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 20px;\n    word-wrap: break-word;\n    margin: 20px 0; }\n    #intercom-container .intercom-auto-response p p:first-child, #intercom-container .intercom-auto-response p ul:first-child, #intercom-container .intercom-auto-response p ol:first-child, #intercom-container .intercom-auto-response p blockquote:first-child, #intercom-container .intercom-auto-response p h1:first-child, #intercom-container .intercom-auto-response p h2:first-child, #intercom-container .intercom-auto-response p h3:first-child, #intercom-container .intercom-auto-response p h4:first-child, #intercom-container .intercom-auto-response p h5:first-child, #intercom-container .intercom-auto-response p h6:first-child, #intercom-container .intercom-auto-response p a:first-child, #intercom-container .intercom-auto-response p .intercom-container:first-child, #intercom-container .intercom-auto-response p code:first-child {\n      margin-top: 0; }\n    #intercom-container .intercom-auto-response p p:last-child, #intercom-container .intercom-auto-response p ul:last-child, #intercom-container .intercom-auto-response p ol:last-child, #intercom-container .intercom-auto-response p blockquote:last-child, #intercom-container .intercom-auto-response p h1:last-child, #intercom-container .intercom-auto-response p h2:last-child, #intercom-container .intercom-auto-response p h3:last-child, #intercom-container .intercom-auto-response p h4:last-child, #intercom-container .intercom-auto-response p h5:last-child, #intercom-container .intercom-auto-response p h6:last-child, #intercom-container .intercom-auto-response p a:last-child, #intercom-container .intercom-auto-response p .intercom-container:last-child, #intercom-container .intercom-auto-response p code:last-child {\n      margin-bottom: 0; }\n  #intercom-container .intercom-auto-response p h1, #intercom-container .intercom-auto-response p h1 a {\n    font-size: 14px;\n    font-weight: 700;\n    line-height: 20px;\n    letter-spacing: normal;\n    margin: 27px 0;\n    color: inherit; }\n  #intercom-container .intercom-auto-response p h2, #intercom-container .intercom-auto-response p h2 a {\n    font-size: 14px;\n    line-height: 20px;\n    font-weight: bold;\n    margin: 20px 0 10px;\n    color: inherit; }\n  #intercom-container .intercom-auto-response p ul, #intercom-container .intercom-auto-response p ol {\n    font-size: 14px;\n    -moz-padding-start: 40px;\n    -webkit-padding-start: 40px;\n    -khtml-padding-start: 40px;\n    -o-padding-start: 40px;\n    padding-start: 40px;\n    padding-left: 30px; }\n  #intercom-container .intercom-auto-response p [dir=ltr] ul, #intercom-container .intercom-auto-response p [dir=ltr] ol {\n    padding-left: 30px; }\n  #intercom-container .intercom-auto-response p [dir=rtl] ul, #intercom-container .intercom-auto-response p [dir=rtl] ol {\n    padding-right: 30px; }\n  #intercom-container .intercom-auto-response p ul > li {\n    list-style-type: disc; }\n  #intercom-container .intercom-auto-response p ol > li {\n    list-style-type: decimal; }\n  #intercom-container .intercom-auto-response p li {\n    display: list-item;\n    line-height: 20px;\n    margin-bottom: 10px;\n    font-weight: 400; }\n  #intercom-container .intercom-auto-response p em, #intercom-container .intercom-auto-response p i {\n    font-style: italic; }\n  #intercom-container .intercom-auto-response p strong, #intercom-container .intercom-auto-response p b {\n    font-weight: bold;\n    line-height: 100%; }\n  #intercom-container .intercom-auto-response p pre {\n    font-size: 14px;\n    padding: 0 0 10px 0;\n    white-space: pre-wrap; }\n  #intercom-container .intercom-auto-response p img {\n    display: block;\n    max-width: 100%;\n    margin: 10px 0; }\n  #intercom-container .intercom-auto-response p p + br {\n    display: none; }\n  #intercom-container .intercom-auto-response p a:link, #intercom-container .intercom-auto-response p a:visited, #intercom-container .intercom-auto-response p a:hover, #intercom-container .intercom-auto-response p a:active {\n    text-decoration: underline; }\n  #intercom-container .intercom-auto-response p a:link, #intercom-container .intercom-auto-response p a:visited {\n    color: custom-color; }\n  #intercom-container .intercom-auto-response p a:hover, #intercom-container .intercom-auto-response p a:active {\n    color: custom-color-darker; }\n  #intercom-container .intercom-auto-response p h2 + p, #intercom-container .intercom-auto-response p h2 + ul, #intercom-container .intercom-auto-response p h2 + ol, #intercom-container .intercom-auto-response p h2 + blockquote, #intercom-container .intercom-auto-response p h2 + .ic_button_in_content, #intercom-container .intercom-auto-response p h2 + .ic_social_block, #intercom-container .intercom-auto-response p h3 + p, #intercom-container .intercom-auto-response p h3 + ul, #intercom-container .intercom-auto-response p h3 + ol, #intercom-container .intercom-auto-response p h3 + blockquote, #intercom-container .intercom-auto-response p h3 + .ic_button_in_content, #intercom-container .intercom-auto-response p h3 + .ic_social_block, #intercom-container .intercom-auto-response p h4 + p, #intercom-container .intercom-auto-response p h4 + ul, #intercom-container .intercom-auto-response p h4 + ol, #intercom-container .intercom-auto-response p h4 + blockquote, #intercom-container .intercom-auto-response p h4 + .ic_button_in_content, #intercom-container .intercom-auto-response p h4 + .ic_social_block, #intercom-container .intercom-auto-response p h5 + p, #intercom-container .intercom-auto-response p h5 + ul, #intercom-container .intercom-auto-response p h5 + ol, #intercom-container .intercom-auto-response p h5 + blockquote, #intercom-container .intercom-auto-response p h5 + .ic_button_in_content, #intercom-container .intercom-auto-response p h5 + .ic_social_block, #intercom-container .intercom-auto-response p h6 + p, #intercom-container .intercom-auto-response p h6 + ul, #intercom-container .intercom-auto-response p h6 + ol, #intercom-container .intercom-auto-response p h6 + blockquote, #intercom-container .intercom-auto-response p h6 + .ic_button_in_content, #intercom-container .intercom-auto-response p h6 + .ic_social_block {\n    margin-top: 0; }\n  #intercom-container .intercom-auto-response p .intercom-h2b-twitter, #intercom-container .intercom-auto-response p .intercom-h2b-facebook {\n    max-width: 100%; }\n  #intercom-container .intercom-auto-response p iframe[src*="vimeo.com"], #intercom-container .intercom-auto-response p iframe[src*="wistia.net"], #intercom-container .intercom-auto-response p iframe[src*="youtube.com"] {\n    width: 100%;\n    height: 149px;\n    margin: 20px auto; }\n  #intercom-container .intercom-auto-response p a:link, #intercom-container .intercom-auto-response p a:visited {\n    color: #90A4AE; }\n  #intercom-container .intercom-auto-response p a:hover, #intercom-container .intercom-auto-response p a:active {\n    color: #90A4AE; }\n\n#intercom-container .intercom-announcement {\n  overflow: hidden; }\n#intercom-container .intercom-announcement-body-container {\n  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.07);\n  font-size: 16px;\n  font-weight: 400;\n  color: #455A64;\n  line-height: 23px;\n  /* ALIGNMENT STYLES */\n  border-radius: 5px;\n  border: 1px solid #e4e4e4;\n  background-color: white; }\n  #intercom-container .intercom-announcement-body-container .intercom-comment-body {\n    font-size: 16px;\n    font-weight: 400;\n    line-height: 23px; }\n  #intercom-container .intercom-announcement-body-container p, #intercom-container .intercom-announcement-body-container ul, #intercom-container .intercom-announcement-body-container ol, #intercom-container .intercom-announcement-body-container blockquote, #intercom-container .intercom-announcement-body-container h1, #intercom-container .intercom-announcement-body-container h2, #intercom-container .intercom-announcement-body-container h3, #intercom-container .intercom-announcement-body-container h4, #intercom-container .intercom-announcement-body-container h5, #intercom-container .intercom-announcement-body-container h6, #intercom-container .intercom-announcement-body-container a, #intercom-container .intercom-announcement-body-container .intercom-container, #intercom-container .intercom-announcement-body-container code {\n    font-size: 16px;\n    font-weight: 400;\n    line-height: 23px;\n    word-wrap: break-word;\n    margin: 20px 0; }\n    #intercom-container .intercom-announcement-body-container p:first-child, #intercom-container .intercom-announcement-body-container ul:first-child, #intercom-container .intercom-announcement-body-container ol:first-child, #intercom-container .intercom-announcement-body-container blockquote:first-child, #intercom-container .intercom-announcement-body-container h1:first-child, #intercom-container .intercom-announcement-body-container h2:first-child, #intercom-container .intercom-announcement-body-container h3:first-child, #intercom-container .intercom-announcement-body-container h4:first-child, #intercom-container .intercom-announcement-body-container h5:first-child, #intercom-container .intercom-announcement-body-container h6:first-child, #intercom-container .intercom-announcement-body-container a:first-child, #intercom-container .intercom-announcement-body-container .intercom-container:first-child, #intercom-container .intercom-announcement-body-container code:first-child {\n      margin-top: 0; }\n    #intercom-container .intercom-announcement-body-container p:last-child, #intercom-container .intercom-announcement-body-container ul:last-child, #intercom-container .intercom-announcement-body-container ol:last-child, #intercom-container .intercom-announcement-body-container blockquote:last-child, #intercom-container .intercom-announcement-body-container h1:last-child, #intercom-container .intercom-announcement-body-container h2:last-child, #intercom-container .intercom-announcement-body-container h3:last-child, #intercom-container .intercom-announcement-body-container h4:last-child, #intercom-container .intercom-announcement-body-container h5:last-child, #intercom-container .intercom-announcement-body-container h6:last-child, #intercom-container .intercom-announcement-body-container a:last-child, #intercom-container .intercom-announcement-body-container .intercom-container:last-child, #intercom-container .intercom-announcement-body-container code:last-child {\n      margin-bottom: 0; }\n  #intercom-container .intercom-announcement-body-container h1, #intercom-container .intercom-announcement-body-container h1 a {\n    font-size: 37px;\n    font-weight: 300;\n    line-height: 48px;\n    letter-spacing: 0.35px;\n    margin: 27px 0;\n    color: custom-color; }\n  #intercom-container .intercom-announcement-body-container h1:first-child {\n    text-align: center;\n    -moz-text-align-last: center;\n         text-align-last: center; }\n  #intercom-container .intercom-announcement-body-container h2, #intercom-container .intercom-announcement-body-container h2 a {\n    font-size: 18px;\n    line-height: 27px;\n    font-weight: 400;\n    margin: 20px 0 10px;\n    color: custom-color; }\n  #intercom-container .intercom-announcement-body-container ul, #intercom-container .intercom-announcement-body-container ol {\n    font-size: 16px;\n    -moz-padding-start: 40px;\n    -webkit-padding-start: 40px;\n    -khtml-padding-start: 40px;\n    -o-padding-start: 40px;\n    padding-start: 40px;\n    padding-left: 40px; }\n  #intercom-container .intercom-announcement-body-container [dir=ltr] ul, #intercom-container .intercom-announcement-body-container [dir=ltr] ol {\n    padding-left: 40px; }\n  #intercom-container .intercom-announcement-body-container [dir=rtl] ul, #intercom-container .intercom-announcement-body-container [dir=rtl] ol {\n    padding-right: 40px; }\n  #intercom-container .intercom-announcement-body-container ul > li {\n    list-style-type: disc; }\n  #intercom-container .intercom-announcement-body-container ol > li {\n    list-style-type: decimal; }\n  #intercom-container .intercom-announcement-body-container li {\n    display: list-item;\n    line-height: 26px;\n    margin-bottom: 10px;\n    font-weight: 400; }\n  #intercom-container .intercom-announcement-body-container em, #intercom-container .intercom-announcement-body-container i {\n    font-style: italic; }\n  #intercom-container .intercom-announcement-body-container strong, #intercom-container .intercom-announcement-body-container b {\n    font-weight: bold;\n    line-height: 100%; }\n  #intercom-container .intercom-announcement-body-container pre {\n    font-size: 16px;\n    padding: 0 0 10px 0;\n    white-space: pre-wrap; }\n  #intercom-container .intercom-announcement-body-container img {\n    display: block;\n    max-width: 100%;\n    margin: 10px 0; }\n  #intercom-container .intercom-announcement-body-container p + br {\n    display: none; }\n  #intercom-container .intercom-announcement-body-container a:link, #intercom-container .intercom-announcement-body-container a:visited, #intercom-container .intercom-announcement-body-container a:hover, #intercom-container .intercom-announcement-body-container a:active {\n    text-decoration: underline; }\n  #intercom-container .intercom-announcement-body-container a:link, #intercom-container .intercom-announcement-body-container a:visited {\n    color: custom-color; }\n  #intercom-container .intercom-announcement-body-container a:hover, #intercom-container .intercom-announcement-body-container a:active {\n    color: custom-color-darker; }\n  #intercom-container .intercom-announcement-body-container h2 + p, #intercom-container .intercom-announcement-body-container h2 + ul, #intercom-container .intercom-announcement-body-container h2 + ol, #intercom-container .intercom-announcement-body-container h2 + blockquote, #intercom-container .intercom-announcement-body-container h2 + .ic_button_in_content, #intercom-container .intercom-announcement-body-container h2 + .ic_social_block, #intercom-container .intercom-announcement-body-container h3 + p, #intercom-container .intercom-announcement-body-container h3 + ul, #intercom-container .intercom-announcement-body-container h3 + ol, #intercom-container .intercom-announcement-body-container h3 + blockquote, #intercom-container .intercom-announcement-body-container h3 + .ic_button_in_content, #intercom-container .intercom-announcement-body-container h3 + .ic_social_block, #intercom-container .intercom-announcement-body-container h4 + p, #intercom-container .intercom-announcement-body-container h4 + ul, #intercom-container .intercom-announcement-body-container h4 + ol, #intercom-container .intercom-announcement-body-container h4 + blockquote, #intercom-container .intercom-announcement-body-container h4 + .ic_button_in_content, #intercom-container .intercom-announcement-body-container h4 + .ic_social_block, #intercom-container .intercom-announcement-body-container h5 + p, #intercom-container .intercom-announcement-body-container h5 + ul, #intercom-container .intercom-announcement-body-container h5 + ol, #intercom-container .intercom-announcement-body-container h5 + blockquote, #intercom-container .intercom-announcement-body-container h5 + .ic_button_in_content, #intercom-container .intercom-announcement-body-container h5 + .ic_social_block, #intercom-container .intercom-announcement-body-container h6 + p, #intercom-container .intercom-announcement-body-container h6 + ul, #intercom-container .intercom-announcement-body-container h6 + ol, #intercom-container .intercom-announcement-body-container h6 + blockquote, #intercom-container .intercom-announcement-body-container h6 + .ic_button_in_content, #intercom-container .intercom-announcement-body-container h6 + .ic_social_block {\n    margin-top: 0; }\n  #intercom-container .intercom-announcement-body-container .intercom-h2b-twitter, #intercom-container .intercom-announcement-body-container .intercom-h2b-facebook {\n    max-width: 100%; }\n  #intercom-container .intercom-announcement-body-container iframe[src*="vimeo.com"], #intercom-container .intercom-announcement-body-container iframe[src*="wistia.net"], #intercom-container .intercom-announcement-body-container iframe[src*="youtube.com"] {\n    width: 100%;\n    height: 272px;\n    margin: 20px auto; }\n  #intercom-container .intercom-announcement-body-container a.intercom-h2b-button {\n    text-decoration: none;\n    padding: 6px 18px;\n    font-weight: 500;\n    display: table;\n    margin: 40px auto;\n    font-size: 15px;\n    line-height: 31px;\n    color: white; }\n  #intercom-container .intercom-announcement-body-container .intercom-align-right {\n    text-align: right !important; }\n    #intercom-container .intercom-announcement-body-container .intercom-align-right img, #intercom-container .intercom-announcement-body-container .intercom-align-right .intercom-h2b-button {\n      margin-right: 0 !important; }\n  #intercom-container .intercom-announcement-body-container .intercom-align-center {\n    text-align: center !important; }\n  #intercom-container .intercom-announcement-body-container .intercom-align-left {\n    text-align: left !important; }\n    #intercom-container .intercom-announcement-body-container .intercom-align-left img, #intercom-container .intercom-announcement-body-container .intercom-align-left .intercom-h2b-button {\n      margin-left: 0 !important; }\n  #intercom-container .intercom-announcement-body-container img {\n    margin: 10px auto 10px; }\n#intercom-container .intercom-announcement .intercom-lwr-composer {\n  border-radius: 0 0 5px 5px; }\n#intercom-container .intercom-announcement-avatar-container {\n  height: 30px; }\n#intercom-container .intercom-announcement-avatar {\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n  border-radius: 50%;\n  border: 3px solid white;\n  position: absolute;\n  width: 60px;\n  height: 60px;\n  left: 50%;\n  margin-left: -30px; }\n#intercom-container .intercom-announcement-body {\n  padding: 50px; }\n#intercom-container .intercom-conversation-announcement .intercom-comment {\n  max-width: 400px; }\n\n#intercom-container .intercom-small-announcement {\n  z-index: 2147483000;\n  overflow: hidden; }\n#intercom-container .intercom-small-announcement-body-container {\n  box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.04);\n  font-size: 15px;\n  font-weight: 400;\n  color: #455A64;\n  line-height: 23px;\n  /* ALIGNMENT STYLES */\n  border: 1px solid #e4e4e4;\n  border-radius: 5px;\n  background-color: white;\n  position: relative; }\n  #intercom-container .intercom-small-announcement-body-container .intercom-comment-body {\n    font-size: 15px;\n    font-weight: 400;\n    line-height: 23px; }\n  #intercom-container .intercom-small-announcement-body-container p, #intercom-container .intercom-small-announcement-body-container ul, #intercom-container .intercom-small-announcement-body-container ol, #intercom-container .intercom-small-announcement-body-container blockquote, #intercom-container .intercom-small-announcement-body-container h1, #intercom-container .intercom-small-announcement-body-container h2, #intercom-container .intercom-small-announcement-body-container h3, #intercom-container .intercom-small-announcement-body-container h4, #intercom-container .intercom-small-announcement-body-container h5, #intercom-container .intercom-small-announcement-body-container h6, #intercom-container .intercom-small-announcement-body-container a, #intercom-container .intercom-small-announcement-body-container .intercom-container, #intercom-container .intercom-small-announcement-body-container code {\n    font-size: 15px;\n    font-weight: 400;\n    line-height: 23px;\n    word-wrap: break-word;\n    margin: 20px 0; }\n    #intercom-container .intercom-small-announcement-body-container p:first-child, #intercom-container .intercom-small-announcement-body-container ul:first-child, #intercom-container .intercom-small-announcement-body-container ol:first-child, #intercom-container .intercom-small-announcement-body-container blockquote:first-child, #intercom-container .intercom-small-announcement-body-container h1:first-child, #intercom-container .intercom-small-announcement-body-container h2:first-child, #intercom-container .intercom-small-announcement-body-container h3:first-child, #intercom-container .intercom-small-announcement-body-container h4:first-child, #intercom-container .intercom-small-announcement-body-container h5:first-child, #intercom-container .intercom-small-announcement-body-container h6:first-child, #intercom-container .intercom-small-announcement-body-container a:first-child, #intercom-container .intercom-small-announcement-body-container .intercom-container:first-child, #intercom-container .intercom-small-announcement-body-container code:first-child {\n      margin-top: 0; }\n    #intercom-container .intercom-small-announcement-body-container p:last-child, #intercom-container .intercom-small-announcement-body-container ul:last-child, #intercom-container .intercom-small-announcement-body-container ol:last-child, #intercom-container .intercom-small-announcement-body-container blockquote:last-child, #intercom-container .intercom-small-announcement-body-container h1:last-child, #intercom-container .intercom-small-announcement-body-container h2:last-child, #intercom-container .intercom-small-announcement-body-container h3:last-child, #intercom-container .intercom-small-announcement-body-container h4:last-child, #intercom-container .intercom-small-announcement-body-container h5:last-child, #intercom-container .intercom-small-announcement-body-container h6:last-child, #intercom-container .intercom-small-announcement-body-container a:last-child, #intercom-container .intercom-small-announcement-body-container .intercom-container:last-child, #intercom-container .intercom-small-announcement-body-container code:last-child {\n      margin-bottom: 0; }\n  #intercom-container .intercom-small-announcement-body-container h1, #intercom-container .intercom-small-announcement-body-container h1 a {\n    font-size: 22px;\n    font-weight: 300;\n    line-height: 28px;\n    letter-spacing: 0.3px;\n    margin: 27px 0;\n    color: custom-color; }\n  #intercom-container .intercom-small-announcement-body-container h1:first-child {\n    text-align: center;\n    -moz-text-align-last: center;\n         text-align-last: center; }\n  #intercom-container .intercom-small-announcement-body-container h2, #intercom-container .intercom-small-announcement-body-container h2 a {\n    font-size: 15px;\n    line-height: 24px;\n    font-weight: bold;\n    margin: 20px 0 10px;\n    color: #455A64; }\n  #intercom-container .intercom-small-announcement-body-container ul, #intercom-container .intercom-small-announcement-body-container ol {\n    font-size: 15px;\n    -moz-padding-start: 40px;\n    -webkit-padding-start: 40px;\n    -khtml-padding-start: 40px;\n    -o-padding-start: 40px;\n    padding-start: 40px;\n    padding-left: 30px; }\n  #intercom-container .intercom-small-announcement-body-container [dir=ltr] ul, #intercom-container .intercom-small-announcement-body-container [dir=ltr] ol {\n    padding-left: 30px; }\n  #intercom-container .intercom-small-announcement-body-container [dir=rtl] ul, #intercom-container .intercom-small-announcement-body-container [dir=rtl] ol {\n    padding-right: 30px; }\n  #intercom-container .intercom-small-announcement-body-container ul > li {\n    list-style-type: disc; }\n  #intercom-container .intercom-small-announcement-body-container ol > li {\n    list-style-type: decimal; }\n  #intercom-container .intercom-small-announcement-body-container li {\n    display: list-item;\n    line-height: 22px;\n    margin-bottom: 10px;\n    font-weight: 400; }\n  #intercom-container .intercom-small-announcement-body-container em, #intercom-container .intercom-small-announcement-body-container i {\n    font-style: italic; }\n  #intercom-container .intercom-small-announcement-body-container strong, #intercom-container .intercom-small-announcement-body-container b {\n    font-weight: bold;\n    line-height: 100%; }\n  #intercom-container .intercom-small-announcement-body-container pre {\n    font-size: 15px;\n    padding: 0 0 10px 0;\n    white-space: pre-wrap; }\n  #intercom-container .intercom-small-announcement-body-container img {\n    display: block;\n    max-width: 100%;\n    margin: 10px 0; }\n  #intercom-container .intercom-small-announcement-body-container p + br {\n    display: none; }\n  #intercom-container .intercom-small-announcement-body-container a:link, #intercom-container .intercom-small-announcement-body-container a:visited, #intercom-container .intercom-small-announcement-body-container a:hover, #intercom-container .intercom-small-announcement-body-container a:active {\n    text-decoration: underline; }\n  #intercom-container .intercom-small-announcement-body-container a:link, #intercom-container .intercom-small-announcement-body-container a:visited {\n    color: custom-color; }\n  #intercom-container .intercom-small-announcement-body-container a:hover, #intercom-container .intercom-small-announcement-body-container a:active {\n    color: custom-color-darker; }\n  #intercom-container .intercom-small-announcement-body-container h2 + p, #intercom-container .intercom-small-announcement-body-container h2 + ul, #intercom-container .intercom-small-announcement-body-container h2 + ol, #intercom-container .intercom-small-announcement-body-container h2 + blockquote, #intercom-container .intercom-small-announcement-body-container h2 + .ic_button_in_content, #intercom-container .intercom-small-announcement-body-container h2 + .ic_social_block, #intercom-container .intercom-small-announcement-body-container h3 + p, #intercom-container .intercom-small-announcement-body-container h3 + ul, #intercom-container .intercom-small-announcement-body-container h3 + ol, #intercom-container .intercom-small-announcement-body-container h3 + blockquote, #intercom-container .intercom-small-announcement-body-container h3 + .ic_button_in_content, #intercom-container .intercom-small-announcement-body-container h3 + .ic_social_block, #intercom-container .intercom-small-announcement-body-container h4 + p, #intercom-container .intercom-small-announcement-body-container h4 + ul, #intercom-container .intercom-small-announcement-body-container h4 + ol, #intercom-container .intercom-small-announcement-body-container h4 + blockquote, #intercom-container .intercom-small-announcement-body-container h4 + .ic_button_in_content, #intercom-container .intercom-small-announcement-body-container h4 + .ic_social_block, #intercom-container .intercom-small-announcement-body-container h5 + p, #intercom-container .intercom-small-announcement-body-container h5 + ul, #intercom-container .intercom-small-announcement-body-container h5 + ol, #intercom-container .intercom-small-announcement-body-container h5 + blockquote, #intercom-container .intercom-small-announcement-body-container h5 + .ic_button_in_content, #intercom-container .intercom-small-announcement-body-container h5 + .ic_social_block, #intercom-container .intercom-small-announcement-body-container h6 + p, #intercom-container .intercom-small-announcement-body-container h6 + ul, #intercom-container .intercom-small-announcement-body-container h6 + ol, #intercom-container .intercom-small-announcement-body-container h6 + blockquote, #intercom-container .intercom-small-announcement-body-container h6 + .ic_button_in_content, #intercom-container .intercom-small-announcement-body-container h6 + .ic_social_block {\n    margin-top: 0; }\n  #intercom-container .intercom-small-announcement-body-container .intercom-h2b-twitter, #intercom-container .intercom-small-announcement-body-container .intercom-h2b-facebook {\n    max-width: 100%; }\n  #intercom-container .intercom-small-announcement-body-container iframe[src*="vimeo.com"], #intercom-container .intercom-small-announcement-body-container iframe[src*="wistia.net"], #intercom-container .intercom-small-announcement-body-container iframe[src*="youtube.com"] {\n    width: 100%;\n    height: 162px;\n    margin: 20px auto; }\n  #intercom-container .intercom-small-announcement-body-container a.intercom-h2b-button {\n    text-decoration: none;\n    padding: 6px 18px;\n    font-weight: 500;\n    display: table;\n    margin: 20px auto;\n    font-size: 15px;\n    line-height: 31px;\n    color: white; }\n  #intercom-container .intercom-small-announcement-body-container .intercom-align-right {\n    text-align: right !important; }\n    #intercom-container .intercom-small-announcement-body-container .intercom-align-right img, #intercom-container .intercom-small-announcement-body-container .intercom-align-right .intercom-h2b-button {\n      margin-right: 0 !important; }\n  #intercom-container .intercom-small-announcement-body-container .intercom-align-center {\n    text-align: center !important; }\n  #intercom-container .intercom-small-announcement-body-container .intercom-align-left {\n    text-align: left !important; }\n    #intercom-container .intercom-small-announcement-body-container .intercom-align-left img, #intercom-container .intercom-small-announcement-body-container .intercom-align-left .intercom-h2b-button {\n      margin-left: 0 !important; }\n  #intercom-container .intercom-small-announcement-body-container img {\n    margin: 10px auto 10px; }\n#intercom-container .intercom-small-announcement .intercom-lwr-composer {\n  border-radius: 0 0 5px 5px; }\n#intercom-container .intercom-small-announcement-avatar-container {\n  height: 20px; }\n#intercom-container .intercom-small-announcement-avatar {\n  z-index: 2147483001;\n  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);\n  border-radius: 50%;\n  border: 2px solid white;\n  position: absolute;\n  width: 40px;\n  height: 40px;\n  left: 50%;\n  margin-left: -22px; }\n#intercom-container .intercom-small-announcement-body {\n  padding: 26px 23px; }\n#intercom-container .intercom-conversation-preview .intercom-small-announcement-body-container {\n  box-shadow: 0 1px 10px 0 rgba(0, 0, 0, 0.08);\n  max-height: 320px; }\n  #intercom-container .intercom-conversation-preview .intercom-small-announcement-body-container:after {\n    z-index: 2147483002;\n    background: linear-gradient(rgba(255, 255, 255, 0), #ffffff 47px);\n    border-radius: 0 0 5px 5px;\n    content: "";\n    position: absolute;\n    top: 240px;\n    height: 81px;\n    width: 100%; }\n\n#intercom-container .intercom-new-anonymous-user-disabled {\n  opacity: 0.5; }\n#intercom-container .intercom-new-anonymous-user-input-container {\n  position: relative;\n  margin: 0 auto;\n  padding: 5px 0;\n  width: 240px; }\n#intercom-container .intercom-new-anonymous-user, #intercom-container .intercom-new-anonymous-user p {\n  -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n  -webkit-transform: translateZ(0);\n          transform: translateZ(0); }\n#intercom-container .intercom-new-anonymous-user input[type="email"] {\n  appearance: none;\n  box-sizing: border-box;\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  font-size: 15px;\n  line-height: 32px;\n  color: #60686e;\n  height: 34px;\n  width: 100%;\n  padding: 0 42px 0 8px;\n  border: 1px solid #e4e5e7;\n  border-radius: 2px;\n  background-color: white; }\n  #intercom-container .intercom-new-anonymous-user input[type="email"]::-webkit-input-placeholder {\n    color: #aeb4b9;\n    font-style: "Helvetica Neue", Helvetica, Arial, sans-serif;\n    font-size: 15px;\n    font-weight: 400;\n    line-height: 32px; }\n  #intercom-container .intercom-new-anonymous-user input[type="email"]::-moz-placeholder {\n    color: #aeb4b9;\n    font-style: "Helvetica Neue", Helvetica, Arial, sans-serif;\n    font-size: 15px;\n    font-weight: 400;\n    line-height: 32px; }\n  #intercom-container .intercom-new-anonymous-user input[type="email"]:-ms-input-placeholder {\n    color: #aeb4b9;\n    font-style: "Helvetica Neue", Helvetica, Arial, sans-serif;\n    font-size: 15px;\n    font-weight: 400;\n    line-height: 32px; }\n  #intercom-container .intercom-new-anonymous-user input[type="email"].intercom-new-anonymous-user-email-invalid {\n    border-color: #d76060;\n    background-color: #fcedee; }\n#intercom-container .intercom-new-anonymous-user input[type="submit"] {\n  background: custom-color;\n  background-image: url(https://js.intercomcdn.com/images/icon-tick.svg), linear-gradient(to bottom, custom-color-light, custom-color);\n  background-repeat: no-repeat;\n  background-position: center;\n  position: absolute;\n  padding: 0;\n  margin: 0;\n  top: 9px;\n  right: 4px;\n  width: 34px;\n  height: 24px; }\n  #intercom-container .intercom-new-anonymous-user input[type="submit"]:hover {\n    background: custom-color-dark;\n    background-image: url(https://js.intercomcdn.com/images/icon-tick.svg), linear-gradient(to bottom, custom-color, custom-color-dark);\n    background-repeat: no-repeat;\n    background-position: center; }\n  #intercom-container .intercom-new-anonymous-user input[type="submit"]:disabled {\n    background: #acbbc2;\n    background-image: url(https://js.intercomcdn.com/images/icon-tick.svg), linear-gradient(to bottom, #b6c5cb, #acbbc2);\n    background-repeat: no-repeat;\n    background-position: center; }\n\n#intercom-container .intercom-composer {\n  z-index: 2147483001;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  width: 336px;\n  margin: 0 auto;\n  padding: 16px; }\n  #intercom-container .intercom-composer.intercom-composer-inactive {\n    display: none; }\n#intercom-container .intercom-powered-by-enabled .intercom-composer {\n  padding: 8px 6px 0; }\n#intercom-container .intercom-conversation-announcement .intercom-composer {\n  width: 616px; }\n#intercom-container .intercom-composer-upload-error {\n  display: none;\n  padding-bottom: 10px;\n  text-align: center;\n  color: #c00;\n  font-size: 13px; }\n#intercom-container .intercom-composer-textarea-container {\n  min-height: 32px; }\n#intercom-container .intercom-composer-disabled .intercom-composer-textarea-container {\n  opacity: .5; }\n#intercom-container .intercom-composer-textarea {\n  position: relative;\n  overflow: hidden;\n  border-radius: 4px;\n  border: 1px solid #CFD8DC; }\n  #intercom-container .intercom-composer-textarea textarea, #intercom-container .intercom-composer-textarea pre {\n    box-sizing: border-box;\n    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n    font-size: 14px;\n    line-height: 20px;\n    min-height: 40px;\n    max-height: 200px;\n    width: 100%;\n    height: 100%;\n    padding: 10px 70px 5px 14px;\n    border-radius: 4px; }\n  #intercom-container .intercom-composer-textarea textarea {\n    background: #fff;\n    position: absolute;\n    top: 0;\n    left: 0;\n    font-weight: 400;\n    color: #455A64;\n    resize: none;\n    border: none; }\n    #intercom-container .intercom-composer-textarea textarea::-webkit-input-placeholder {\n      color: #B0BEC5;\n      font-style: "Helvetica Neue", Helvetica, Arial, sans-serif;\n      font-size: 14px;\n      font-weight: 400;\n      line-height: 20px; }\n    #intercom-container .intercom-composer-textarea textarea::-moz-placeholder {\n      color: #B0BEC5;\n      font-style: "Helvetica Neue", Helvetica, Arial, sans-serif;\n      font-size: 14px;\n      font-weight: 400;\n      line-height: 20px; }\n    #intercom-container .intercom-composer-textarea textarea:-ms-input-placeholder {\n      color: #B0BEC5;\n      font-style: "Helvetica Neue", Helvetica, Arial, sans-serif;\n      font-size: 14px;\n      font-weight: 400;\n      line-height: 20px; }\n    #intercom-container .intercom-composer-textarea textarea:focus, #intercom-container .intercom-composer-textarea textarea:active {\n      box-shadow: inset 0 2px 1px rgba(0, 0, 0, 0.06); }\n  #intercom-container .intercom-composer-textarea textarea, #intercom-container .intercom-composer-textarea pre > span {\n    white-space: pre;\n    white-space: pre-wrap;\n    word-wrap: break-word; }\n  #intercom-container .intercom-composer-textarea pre {\n    margin: 0; }\n    #intercom-container .intercom-composer-textarea pre > span {\n      visibility: hidden; }\n  #intercom-container .intercom-composer-textarea.intercom-composer-focused {\n    border-color: #74BEFF;\n    box-shadow: 0px 0px 4px 0px rgba(75, 171, 255, 0.38); }\n#intercom-container .intercom-composer-send-button {\n  border-radius: 4px;\n  font-size: 13px;\n  margin-left: 8px;\n  height: 40px;\n  float: right;\n  display: none; }\n#intercom-container .intercom-composer-upload-button {\n  z-index: 2147483001;\n  opacity: 0.4;\n  background-image: url(https://js.intercomcdn.com/images/icon-upload.png) /* noembed */;\n  background-size: 15px 14px;\n  background-repeat: no-repeat;\n  background-position: center;\n  display: none;\n  height: 15px;\n  width: 14px;\n  position: absolute;\n  cursor: pointer;\n  top: 7px;\n  right: 40px;\n  padding: 5px; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container .intercom-composer-upload-button {\n      background-image: url(https://js.intercomcdn.com/images/icon-upload@2x.png) /* noembed */; } }\n  #intercom-container .intercom-composer-upload-button:hover {\n    opacity: .8;\n    transition: opacity 200ms linear; }\n#intercom-container .intercom-composer-emoji-button {\n  z-index: 2147483001;\n  opacity: 0.4;\n  background-image: url(https://js.intercomcdn.com/images/icon-emoji.png) /* noembed */;\n  background-size: 15px 15px;\n  background-repeat: no-repeat;\n  display: none;\n  height: 15px;\n  width: 15px;\n  position: absolute;\n  top: 7px;\n  right: 12px;\n  padding: 5px;\n  background-position: center;\n  cursor: pointer; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container .intercom-composer-emoji-button {\n      background-image: url(https://js.intercomcdn.com/images/icon-emoji@2x.png) /* noembed */; } }\n  #intercom-container .intercom-composer-emoji-button:hover, #intercom-container .intercom-composer-emoji-button.intercom-composer-emoji-button-active {\n    opacity: .8;\n    transition: opacity 200ms linear; }\n#intercom-container .intercom-conversation-announcement .intercom-composer {\n  border: 1px solid #dadee2;\n  border-bottom: none;\n  border-radius: 4px 4px 0 0; }\n#intercom-container .intercom-composer-press-enter-to-send {\n  display: none;\n  text-align: right;\n  width: 100%;\n  box-sizing: border-box;\n  line-height: 22px;\n  color: #b6c2c9;\n  font-size: 13px; }\n#intercom-container .intercom-powered-by-enabled .intercom-composer-press-enter-to-send {\n  position: absolute;\n  padding-bottom: 2px;\n  bottom: 0;\n  left: 8px;\n  right: 8px;\n  width: auto; }\n\n#intercom-container .intercom-emoji-selector {\n  z-index: 2147483001;\n  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);\n  background-color: #ffffff;\n  border-radius: 3px;\n  border: 1px #D0D4D8 solid;\n  position: absolute;\n  bottom: calc(100% - 13px);\n  right: 10px;\n  margin: 0px 0px 16px 0px;\n  display: none;\n  font-size: 22px; }\n  #intercom-container .intercom-emoji-selector:after, #intercom-container .intercom-emoji-selector:before {\n    top: 100%;\n    right: 26px;\n    border: solid transparent;\n    content: " ";\n    height: 0;\n    width: 0;\n    position: absolute;\n    pointer-events: none; }\n  #intercom-container .intercom-emoji-selector:after {\n    border-color: rgba(240, 240, 240, 0);\n    border-top-color: #ffffff;\n    border-width: 7px;\n    margin-right: -12px; }\n  #intercom-container .intercom-emoji-selector:before {\n    border-color: rgba(170, 170, 170, 0);\n    border-top-color: #aaaaaa;\n    border-width: 8px;\n    margin-right: -13px; }\n#intercom-container .intercom-emoji-selector-panel-small {\n  background-color: #FFFFFF;\n  width: 144px;\n  line-height: 0;\n  bottom: 0px;\n  border-radius: 3px; }\n  #intercom-container .intercom-emoji-selector-panel-small .intercom-emoji-image {\n    background-image: url(https://js.intercomcdn.com/images/emoji-spritemap-16.png) /* noembed */;\n    background-size: 464px 464px;\n    background-repeat: no-repeat;\n    border-radius: 3px;\n    border: 10px solid;\n    color: #FFFFFF;\n    background-color: #FFFFFF;\n    border-color: #FFFFFF;\n    cursor: pointer; }\n    @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n      #intercom-container .intercom-emoji-selector-panel-small .intercom-emoji-image {\n        background-image: url(https://js.intercomcdn.com/images/emoji-spritemap-32.png) /* noembed */; } }\n    #intercom-container .intercom-emoji-selector-panel-small .intercom-emoji-image:hover {\n      background-color: #EDEDED;\n      border-color: #EDEDED;\n      color: #EDEDED; }\n#intercom-container .intercom-emoji-selector-panel-large {\n  box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.1);\n  background-color: #FFFFFF;\n  height: 220px;\n  width: 322px;\n  overflow-y: auto;\n  display: none;\n  border-radius: 0px 0px 3px 3px; }\n  #intercom-container .intercom-emoji-selector-panel-large.active {\n    display: block; }\n  #intercom-container .intercom-emoji-selector-panel-large .intercom-emoji-icon {\n    color: #60686e;\n    margin: 5px 5px 5px 5px;\n    width: 30px;\n    line-height: 30px;\n    display: inline-table;\n    text-align: center;\n    cursor: pointer; }\n    #intercom-container .intercom-emoji-selector-panel-large .intercom-emoji-icon:hover {\n      background-color: #EDEDED; }\n#intercom-container .intercom-large-emoji-panel-top-mask {\n  background: linear-gradient(#ffffff, rgba(255, 255, 255, 0) 20px);\n  height: 20px;\n  width: 100%;\n  position: absolute;\n  top: 35px;\n  left: 0;\n  content: "";\n  pointer-events: none;\n  display: none; }\n#intercom-container .intercom-large-emoji-panel-bottom-mask {\n  background: linear-gradient(rgba(255, 255, 255, 0), #ffffff 20px);\n  height: 20px;\n  width: 100%;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  content: "";\n  border-radius: 0 0 3px 3px;\n  pointer-events: none;\n  display: block; }\n#intercom-container .intercom-emoji-selector-panel-header {\n  background-color: #FAFAFB;\n  height: 35px;\n  width: 322px;\n  text-align: center;\n  border-radius: 3px; }\n  #intercom-container .intercom-emoji-selector-panel-header .intercom-emoji-group-icon {\n    z-index: 2147483001;\n    position: relative;\n    color: #60686e;\n    line-height: 30px;\n    width: 45px;\n    margin-top: 5px;\n    text-align: center;\n    display: inline-block;\n    border-radius: 3px 3px 0px 0px;\n    cursor: pointer; }\n    #intercom-container .intercom-emoji-selector-panel-header .intercom-emoji-group-icon:hover {\n      background-color: #EDEDED; }\n    #intercom-container .intercom-emoji-selector-panel-header .intercom-emoji-group-icon.active {\n      z-index: 2147483002;\n      background-color: #FFFFFF;\n      box-shadow: 0 -1px 3px 0 rgba(0, 0, 0, 0.1);\n      border-bottom: none; }\n\n#intercom-container .intercom-lwr-composer {\n  width: 100%;\n  height: 54px;\n  border-top: 1px solid #e4e5e7;\n  display: none;\n  overflow: hidden;\n  min-width: 120px; }\n#intercom-container .intercom-lwr-composer-active {\n  display: block; }\n#intercom-container .intercom-lwr-composer-options:before, #intercom-container .intercom-lwr-composer-options:after {\n  content: " ";\n  display: table; }\n#intercom-container .intercom-lwr-composer-options:after {\n  clear: both; }\n#intercom-container .intercom-lwr-composer-option {\n  background-color: #fdfdfd;\n  position: relative;\n  float: left;\n  height: 54px; }\n#intercom-container .intercom-lwr-composer-enabled .intercom-lwr-composer-option {\n  cursor: pointer; }\n  #intercom-container .intercom-lwr-composer-enabled .intercom-lwr-composer-option svg {\n    cursor: pointer; }\n#intercom-container .intercom-lwr-composer-enabled .intercom-lwr-composer-option:hover {\n  background-color: #f7f7f7; }\n#intercom-container .intercom-lwr-composer-option svg {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 16px;\n  height: 16px;\n  margin-left: -8px;\n  margin-top: -8px;\n  background-color: transparent; }\n#intercom-container .intercom-lwr-composer-options-thumbs .intercom-lwr-composer-option {\n  width: 50%; }\n#intercom-container .intercom-lwr-composer-options-emotions .intercom-lwr-composer-option {\n  width: 33.33%; }\n#intercom-container .intercom-lwr-composer-option-selected .intercom-lwr-composer-icon {\n  fill: custom-color; }\n#intercom-container .intercom-lwr-composer-option .intercom-lwr-option-background {\n  fill: #fdfdfd; }\n#intercom-container .intercom-lwr-composer-enabled .intercom-lwr-composer-option:hover .intercom-lwr-option-background {\n  fill: #f7f7f7; }\n\n#intercom-container .intercom-powered-by {\n  width: 100%;\n  color: #B0BEC5;\n  text-align: center;\n  clear: both;\n  font-weight: 500;\n  line-height: 22px;\n  padding: 7px; }\n  #intercom-container .intercom-powered-by span {\n    font-size: 13px;\n    text-decoration: none; }\n  #intercom-container .intercom-powered-by u {\n    text-decoration: underline; }\n  #intercom-container .intercom-powered-by a:hover, #intercom-container .intercom-powered-by a:active {\n    color: #B0BEC5; }\n    #intercom-container .intercom-powered-by a:hover u, #intercom-container .intercom-powered-by a:active u {\n      color: #B0BEC5; }\n\n#intercom-container .intercom-upload-remove {\n  background-image: url(https://js.intercomcdn.com/images/icon-upload-remove.png) /* noembed */;\n  background-size: 14px 14px;\n  background-repeat: no-repeat;\n  opacity: .8;\n  display: inline-block;\n  vertical-align: middle;\n  cursor: pointer;\n  width: 14px;\n  height: 14px;\n  right: -22px;\n  top: 2px; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container .intercom-upload-remove {\n      background-image: url(https://js.intercomcdn.com/images/icon-upload-remove@2x.png) /* noembed */; } }\n  #intercom-container .intercom-upload-remove:hover {\n    opacity: 1; }\n\n#intercom-container .intercom-unread-counter {\n  border-radius: 50%;\n  border: 2px solid white;\n  font-size: 11px;\n  line-height: 16px;\n  background-color: custom-color;\n  text-align: center;\n  color: white;\n  position: absolute;\n  width: 16px;\n  height: 16px;\n  top: 11px;\n  left: 11px;\n  cursor: pointer;\n  display: none; }\n  #intercom-container .intercom-unread-counter.intercom-unread-counter-active {\n    display: block; }\n\n#intercom-container .intercom-is-typing:before, #intercom-container .intercom-is-typing:after {\n  content: " ";\n  display: table; }\n#intercom-container .intercom-is-typing:after {\n  clear: both; }\n#intercom-container .intercom-is-typing-icon {\n  background-image: url(https://js.intercomcdn.com/images/icon-is-typing.gif) /* noembed */;\n  background-size: 38px 18px;\n  background-repeat: no-repeat;\n  height: 18px;\n  cursor: default; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container .intercom-is-typing-icon {\n      background-image: url(https://js.intercomcdn.com/images/icon-is-typing@2x.gif) /* noembed */; } }\n#intercom-container .intercom-is-typing .intercom-comment-body {\n  min-width: 38px;\n  padding-left: 12px; }\n\n#intercom-container.intercom-ie8 .intercom-sheet-content {\n  clip: rect(-9999px, 9999px, 9999px, -9999px); }\n#intercom-container.intercom-ie8 .intercom-sheet-loading, #intercom-container.intercom-ie8 .intercom-conversations, #intercom-container.intercom-ie8 .intercom-conversation {\n  border-left: 1px solid #dadee2; }\n#intercom-container.intercom-ie8 .intercom-app-profile, #intercom-container.intercom-ie8 .intercom-sheet-header {\n  border-bottom: 1px solid #dadee2; }\n#intercom-container.intercom-ie8 .intercom-composer, #intercom-container.intercom-ie8 .intercom-sheet-footer {\n  border-top: 1px solid #dadee2; }\n#intercom-container.intercom-ie8 .intercom-launcher.intercom-launcher-with-notification .intercom-launcher-button-with-avatar, #intercom-container.intercom-ie8 .intercom-launcher.intercom-launcher-with-badge .intercom-launcher-button-with-avatar {\n  display: none; }\n#intercom-container.intercom-ie8 .intercom-launcher.intercom-launcher-with-notification .intercom-launcher-button-without-avatar, #intercom-container.intercom-ie8 .intercom-launcher.intercom-launcher-with-badge .intercom-launcher-button-without-avatar {\n  visibility: visible; }\n#intercom-container.intercom-ie8 .intercom-launcher.intercom-launcher-with-notification .intercom-launcher-badge, #intercom-container.intercom-ie8 .intercom-launcher.intercom-launcher-with-badge .intercom-launcher-badge {\n  right: 0; }\n#intercom-container.intercom-ie8 .intercom-lwr-composer-option-selected.intercom-lwr-composer-option, #intercom-container.intercom-ie8 .intercom-lwr-composer-enabled .intercom-lwr-composer-option:hover {\n  background-color: #f7f7f7; }\n#intercom-container.intercom-ie8 .intercom-comment {\n  display: block;\n  float: none;\n  max-width: 100%;\n  width: 100%;\n  box-sizing: border-box; }\n#intercom-container.intercom-ie8 .intercom-comment-by-user .intercom-comment-body-container, #intercom-container.intercom-ie8 .intercom-comment-by-admin .intercom-comment-body-container {\n  max-width: 272px;\n  float: right;\n  clear: both; }\n#intercom-container.intercom-ie8 .intercom-comment-metadata-container {\n  clear: both; }\n#intercom-container.intercom-ie8 .intercom-comment-by-admin .intercom-comment-body-container {\n  float: left; }\n#intercom-container.intercom-ie8 .intercom-lwr-composer-option svg {\n  display: none; }\n#intercom-container.intercom-ie8 .intercom-lwr-composer-option .intercom-lwr-icon {\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  width: 18px;\n  height: 18px;\n  margin-left: -9px;\n  margin-top: -9px;\n  background-repeat: no-repeat; }\n#intercom-container.intercom-ie8 .intercom-lwr-composer-option.intercom-lwr-composer-option-thumbs-up .intercom-lwr-icon {\n  background-image: url(https://js.intercomcdn.com/images/icon-thumbs-up.png); }\n#intercom-container.intercom-ie8 .intercom-lwr-composer-option.intercom-lwr-composer-option-thumbs-down .intercom-lwr-icon {\n  background-image: url(https://js.intercomcdn.com/images/icon-thumbs-down.png); }\n#intercom-container.intercom-ie8 .intercom-lwr-composer-option.intercom-lwr-composer-option-happy .intercom-lwr-icon {\n  background-image: url(https://js.intercomcdn.com/images/icon-emotion-happy.png); }\n#intercom-container.intercom-ie8 .intercom-lwr-composer-option.intercom-lwr-composer-option-neutral .intercom-lwr-icon {\n  background-image: url(https://js.intercomcdn.com/images/icon-emotion-neutral.png); }\n#intercom-container.intercom-ie8 .intercom-lwr-composer-option.intercom-lwr-composer-option-sad .intercom-lwr-icon {\n  background-image: url(https://js.intercomcdn.com/images/icon-emotion-sad.png); }\n#intercom-container.intercom-ie8 .intercom-autoresponse-icon {\n  border: none;\n  background-color: #fafafa; }\n  #intercom-container.intercom-ie8 .intercom-autoresponse-icon i {\n    background: url(https://js.intercomcdn.com/images/icon-info.png);\n    width: 32px;\n    height: 32px;\n    margin: 2px; }\n#intercom-container.intercom-ie8 .intercom-conversations-new-conversation-button i {\n  background-image: url(https://js.intercomcdn.com/images/icon-compose.png);\n  height: 14px; }\n#intercom-container.intercom-ie8 .intercom-conversations-item-user-avatar {\n  background-image: url(https://js.intercomcdn.com/images/icon-user-avatar.png); }\n\n@-webkit-keyframes intercom-launcher-show-avatar {\n  0% {\n    -webkit-transform: scale(0);\n            transform: scale(0); }\n\n  80% {\n    -webkit-transform: scale(1.2);\n            transform: scale(1.2); }\n\n  100% {\n    -webkit-transform: scale(1);\n            transform: scale(1); } }\n\n@-keyframes intercom-launcher-show-avatar {\n  0% {\n    -webkit-transform: scale(0);\n        -ms-transform: scale(0);\n            transform: scale(0); }\n\n  80% {\n    -webkit-transform: scale(1.2);\n        -ms-transform: scale(1.2);\n            transform: scale(1.2); }\n\n  100% {\n    -webkit-transform: scale(1);\n        -ms-transform: scale(1);\n            transform: scale(1); } }\n\n@-webkit-keyframes intercom-launcher-hide-and-show-avatar {\n  0% {\n    -webkit-transform: scale(1);\n            transform: scale(1); }\n\n  50% {\n    -webkit-transform: scale(0);\n            transform: scale(0); }\n\n  80% {\n    -webkit-transform: scale(1.2);\n            transform: scale(1.2); }\n\n  100% {\n    -webkit-transform: scale(1);\n            transform: scale(1); } }\n\n@-keyframes intercom-launcher-hide-and-show-avatar {\n  0% {\n    -webkit-transform: scale(1);\n        -ms-transform: scale(1);\n            transform: scale(1); }\n\n  50% {\n    -webkit-transform: scale(0);\n        -ms-transform: scale(0);\n            transform: scale(0); }\n\n  80% {\n    -webkit-transform: scale(1.2);\n        -ms-transform: scale(1.2);\n            transform: scale(1.2); }\n\n  100% {\n    -webkit-transform: scale(1);\n        -ms-transform: scale(1);\n            transform: scale(1); } }\n\n@-webkit-keyframes intercom-launcher-show-badge {\n  0% {\n    opacity: 0;\n    -webkit-transform: scale(0);\n            transform: scale(0); }\n\n  50% {\n    opacity: 0; }\n\n  75% {\n    opacity: 1;\n    -webkit-transform: scale(1.1);\n            transform: scale(1.1); }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1);\n            transform: scale(1); } }\n\n@-keyframes intercom-launcher-show-badge {\n  0% {\n    opacity: 0;\n    -webkit-transform: scale(0);\n        -ms-transform: scale(0);\n            transform: scale(0); }\n\n  50% {\n    opacity: 0; }\n\n  75% {\n    opacity: 1;\n    -webkit-transform: scale(1.1);\n        -ms-transform: scale(1.1);\n            transform: scale(1.1); }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: scale(1);\n        -ms-transform: scale(1);\n            transform: scale(1); } }\n\n@-webkit-keyframes intercom-launcher-show-preview {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate(10px, 0);\n            transform: translate(10px, 0); }\n\n  50% {\n    -webkit-transform: translate(-5px, 0) scale(1.05);\n            transform: translate(-5px, 0) scale(1.05); }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: translate(0, 0) scale(1);\n            transform: translate(0, 0) scale(1); } }\n\n@-keyframes intercom-launcher-show-preview {\n  0% {\n    opacity: 0;\n    -webkit-transform: translate(10px, 0);\n        -ms-transform: translate(10px, 0);\n            transform: translate(10px, 0); }\n\n  50% {\n    -webkit-transform: translate(-5px, 0) scale(1.05);\n        -ms-transform: translate(-5px, 0) scale(1.05);\n            transform: translate(-5px, 0) scale(1.05); }\n\n  100% {\n    opacity: 1;\n    -webkit-transform: translate(0, 0) scale(1);\n        -ms-transform: translate(0, 0) scale(1);\n            transform: translate(0, 0) scale(1); } }\n\n@-webkit-keyframes intercom-launcher-update-preview {\n  0% {\n    opacity: 1;\n    -webkit-transform: translate(0, 0) scale(1);\n            transform: translate(0, 0) scale(1); }\n\n  50% {\n    -webkit-transform: translate(-5px, 0) scale(.95);\n            transform: translate(-5px, 0) scale(.95); }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translate(10px, 0) scale(0);\n            transform: translate(10px, 0) scale(0); } }\n\n@-keyframes intercom-launcher-update-preview {\n  0% {\n    opacity: 1;\n    -webkit-transform: translate(0, 0) scale(1);\n        -ms-transform: translate(0, 0) scale(1);\n            transform: translate(0, 0) scale(1); }\n\n  50% {\n    -webkit-transform: translate(-5px, 0) scale(.95);\n        -ms-transform: translate(-5px, 0) scale(.95);\n            transform: translate(-5px, 0) scale(.95); }\n\n  100% {\n    opacity: 0;\n    -webkit-transform: translate(10px, 0) scale(0);\n        -ms-transform: translate(10px, 0) scale(0);\n            transform: translate(10px, 0) scale(0); } }\n\n@-webkit-keyframes intercom-launcher-minimize {\n  0% {\n    -webkit-transform: scale(1);\n            transform: scale(1); }\n\n  100% {\n    -webkit-transform: scale(0);\n            transform: scale(0); } }\n\n@-keyframes intercom-launcher-minimize {\n  0% {\n    -webkit-transform: scale(1);\n        -ms-transform: scale(1);\n            transform: scale(1); }\n\n  100% {\n    -webkit-transform: scale(0);\n        -ms-transform: scale(0);\n            transform: scale(0); } }\n\n@-webkit-keyframes intercom-launcher-maximize {\n  0% {\n    -webkit-transform: scale(0);\n            transform: scale(0); }\n\n  100% {\n    -webkit-transform: scale(1);\n            transform: scale(1); } }\n\n@-keyframes intercom-launcher-maximize {\n  0% {\n    -webkit-transform: scale(0);\n        -ms-transform: scale(0);\n            transform: scale(0); }\n\n  100% {\n    -webkit-transform: scale(1);\n        -ms-transform: scale(1);\n            transform: scale(1); } }\n\n#intercom-container .intercom-launcher.intercom-launcher-minimized {\n  transition: opacity, .1s; }\n#intercom-container .intercom-launcher.intercom-launcher-minimized .intercom-launcher-button {\n  -webkit-animation: intercom-launcher-minimize .1s linear 0s both;\n          animation: intercom-launcher-minimize .1s linear 0s both;\n  transition: background-image 0s linear .1s; }\n#intercom-container .intercom-launcher.intercom-launcher-maximized .intercom-launcher-button {\n  -webkit-animation: intercom-launcher-maximize .1s linear 0s both;\n          animation: intercom-launcher-maximize .1s linear 0s both; }\n#intercom-container .intercom-launcher.intercom-launcher-with-updated-avatar .intercom-launcher-button {\n  -webkit-animation: intercom-launcher-show-avatar .15s ease-out 1s both;\n          animation: intercom-launcher-show-avatar .15s ease-out 1s both; }\n#intercom-container .intercom-launcher-maximized.intercom-launcher-with-updated-avatar .intercom-launcher-button, #intercom-container .intercom-launcher-enabled.intercom-launcher-with-updated-avatar .intercom-launcher-button {\n  -webkit-animation: intercom-launcher-hide-and-show-avatar .3s ease-out 1s both;\n          animation: intercom-launcher-hide-and-show-avatar .3s ease-out 1s both;\n  transition: background-image 0s linear 1.15s, background-size 0s linear 1.15s, border-width 0s linear 1.15s; }\n#intercom-container .intercom-launcher.intercom-launcher-with-badge .intercom-launcher-badge {\n  -webkit-animation: intercom-launcher-show-badge .3s ease-out 1.5s both;\n          animation: intercom-launcher-show-badge .3s ease-out 1.5s both; }\n#intercom-container .intercom-launcher.intercom-launcher-with-updated-avatar.intercom-launcher-with-initials .intercom-launcher-initials, #intercom-container .intercom-launcher-enabled.intercom-launcher-with-updated-avatar.intercom-launcher-with-initials .intercom-launcher-initials {\n  -webkit-animation: intercom-launcher-show-avatar .3s ease-out 1s both;\n          animation: intercom-launcher-show-avatar .3s ease-out 1s both; }\n#intercom-container .intercom-launcher.intercom-launcher-with-preview .intercom-launcher-preview {\n  -webkit-animation: intercom-launcher-show-preview .3s ease-in-out 1.5s both;\n          animation: intercom-launcher-show-preview .3s ease-in-out 1.5s both; }\n#intercom-container .intercom-launcher.intercom-launcher-with-preview .intercom-launcher-update-preview {\n  -webkit-animation: intercom-launcher-update-preview .3s ease-out 1s both;\n          animation: intercom-launcher-update-preview .3s ease-out 1s both; }\n#intercom-container .intercom-launcher.intercom-launcher-with-preview .intercom-launcher-preview-close {\n  transition: opacity .1s ease-in; }\n\n#intercom-container .intercom-conversation-parts {\n  transition: opacity .2s; }\n#intercom-container .intercom-sheet-loading .intercom-conversation-parts {\n  transition: none; }\n#intercom-container .intercom-conversation-preview .intercom-sheet-header {\n  transition: none; }\n\n@-webkit-keyframes intercom-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg); }\n\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n@-keyframes intercom-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n        -ms-transform: rotate(0deg);\n            transform: rotate(0deg); }\n\n  100% {\n    -webkit-transform: rotate(360deg);\n        -ms-transform: rotate(360deg);\n            transform: rotate(360deg); } }\n\n#intercom-container .intercom-sheet-loading .intercom-sheet-spinner, #intercom-container .intercom-conversations-fetching .intercom-conversations-spinner {\n  -webkit-animation: intercom-spin 1s infinite linear;\n          animation: intercom-spin 1s infinite linear; }\n\n@-webkit-keyframes intercom-lwr-composer-option-bounce {\n  0% {\n    -webkit-transform: scale(1);\n            transform: scale(1); }\n\n  50% {\n    -webkit-transform: scale(1.5);\n            transform: scale(1.5); }\n\n  100% {\n    -webkit-transform: scale(1);\n            transform: scale(1); } }\n\n@-keyframes intercom-lwr-composer-option-bounce {\n  0% {\n    -webkit-transform: scale(1);\n        -ms-transform: scale(1);\n            transform: scale(1); }\n\n  50% {\n    -webkit-transform: scale(1.5);\n        -ms-transform: scale(1.5);\n            transform: scale(1.5); }\n\n  100% {\n    -webkit-transform: scale(1);\n        -ms-transform: scale(1);\n            transform: scale(1); } }\n\n#intercom-container .intercom-lwr-composer-option-pop svg {\n  -webkit-animation: intercom-lwr-composer-option-bounce .2s ease-in 0 both;\n          animation: intercom-lwr-composer-option-bounce .2s ease-in 0 both; }\n\n#intercom-container .intercom-announcement a.intercom-h2b-button, #intercom-container .intercom-small-announcement a.intercom-h2b-button {\n  transition: background-color 0.05s linear; }\n  #intercom-container .intercom-announcement a.intercom-h2b-button:hover, #intercom-container .intercom-small-announcement a.intercom-h2b-button:hover {\n    transition: background-color 0.05s linear; }\n\n#intercom-container .intercom-conversations-new-conversation-button, #intercom-container .intercom-announcement-body-container a.intercom-h2b-button, #intercom-container .intercom-small-announcement-body-container a.intercom-h2b-button, #intercom-container .intercom-new-anonymous-user input[type="submit"], #intercom-container .intercom-composer-send-button {\n  transition: background-color 100ms linear; }\n\n#intercom-container .intercom-sheet {\n  -webkit-transform: scale(1);\n      -ms-transform: scale(1);\n          transform: scale(1);\n  -webkit-transform-origin: bottom right;\n      -ms-transform-origin: bottom right;\n          transform-origin: bottom right;\n  transition: -webkit-transform 250ms ease-in-out, opacity 100ms linear 150ms;\n  transition: transform 250ms ease-in-out, opacity 100ms linear 150ms; }\n#intercom-container .intercom-sheet-minimized {\n  -webkit-transform: scale(0);\n      -ms-transform: scale(0);\n          transform: scale(0);\n  transition: -webkit-transform 250ms ease-in-out, opacity 100ms linear, visibility 0s linear 250ms;\n  transition: transform 250ms ease-in-out, opacity 100ms linear, visibility 0s linear 250ms; }\n\n#intercom-container .intercom-conversation-embed .intercom-embed-no-header {\n  top: 0;\n  padding-top: 0; }\n#intercom-container .intercom-conversation-embed .intercom-sheet-content {\n  overflow: auto;\n  z-index: 1; }\n#intercom-container .intercom-conversation-embed .intercom-sheet-header, #intercom-container .intercom-conversation-embed .intercom-sheet-body, #intercom-container .intercom-conversation-embed .intercom-sheet-content, #intercom-container .intercom-conversation-embed .intercom-sheet-footer {\n  position: absolute;\n  width: 100%; }\n#intercom-container .intercom-conversation-embed .intercom-small-announcement-avatar, #intercom-container .intercom-conversation-embed .intercom-sheet-header {\n  z-index: 1; }\n#intercom-container .intercom-conversation-embed .intercom-small-announcement, #intercom-container .intercom-conversation-embed .intercom-sheet-body {\n  z-index: initial; }\n#intercom-container .intercom-conversation-embed .intercom-sheet-body {\n  border: none;\n  z-index: 0; }\n#intercom-container .intercom-conversation-embed .intercom-comment-timestamp {\n  display: none; }\n#intercom-container .intercom-conversation-embed .intercom-composer {\n  z-index: 0; }\n\n#intercom-container #intercom-embedded-launcher {\n  z-index: 2147483000;\n  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;\n  height: 48px;\n  width: 48px;\n  position: relative; }\n#intercom-container #intercom-embedded-launcher.intercom-launcher-with-preview {\n  width: 340px; }\n\n#intercom-container .intercom-emoji-sub-icon {\n  background-image: url(https://js.intercomcdn.com/images/emoji-spritemap-16.png) /* noembed */;\n  background-size: 464px 464px;\n  background-repeat: no-repeat;\n  position: relative;\n  top: 2px;\n  margin: 1px; }\n  @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n    #intercom-container .intercom-emoji-sub-icon {\n      background-image: url(https://js.intercomcdn.com/images/emoji-spritemap-32.png) /* noembed */; } }\n\n#intercom-container .intercom-sticker-comment-body {\n  padding: 0; }\n#intercom-container .intercom-sticker-user-comment {\n  float: right; }\n  #intercom-container .intercom-sticker-user-comment .intercom-sticker-comment-body {\n    float: right; }\n  #intercom-container .intercom-sticker-user-comment .intercom-comment-metadata {\n    float: right; }\n#intercom-container .intercom-sticker-admin-comment {\n  padding-left: 38px; }\n#intercom-container .intercom-sticker-image {\n  width: 96px;\n  height: 96px;\n  min-width: 96px;\n  min-height: 96px; }\n#intercom-container .intercom-sticker-native {\n  font-size: 96px;\n  line-height: 1.1; }\n\n#intercom-container {\n  /* Invisible bounding box for controls area down the bottom of the video. */\n  /* Shading for .intercom-video-reply-controls.\n     Implemented as a child element, rather than putting these styles on .intercom-video-reply-controls,\n     so the shading\'s opacity can be changed without affecting the controls\' opacity. */\n  /* Controls bar is the horizontal slice within the controls area\n     which contains the row of buttons: used to vertically position the\n     button row where we want it. */\n  /* Play/pause button in the bottom-left.\n     Zero-opacity, only becoming visible when the video is being hovered over. */\n  /* Mute/unmute button in the bottom-right.\n     When in "unmuted" state, it\'s zero-opacity-except-on-hover, like the\n     play/pause button.\n     When in "muted" state however, it\'s always visible.\n  */\n  /* Video progress bar.\n     Like the buttons, this is zero-opacity-except-on-hover.\n     The full/empty region shading is implemented with a background gradient,\n     set in javascript. */ }\n  #intercom-container .intercom-interblocks-video-reply {\n    display: block;\n    width: 100%;\n    border-radius: 4px;\n    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.8);\n    z-index: 0;\n    background-color: black; }\n  #intercom-container .intercom-video-reply {\n    position: relative;\n    /* All controls become visible when the video is hovered over. */ }\n    #intercom-container .intercom-video-reply:hover div {\n      opacity: 1.0;\n      transition: opacity 0.4s ease; }\n  #intercom-container .intercom-video-reply-controls {\n    position: absolute;\n    bottom: 0px;\n    height: 64px;\n    width: 100%;\n    z-index: 1; }\n  #intercom-container .intercom-video-reply-controls-shading {\n    position: absolute;\n    opacity: 0.0;\n    background-image: linear-gradient(transparent, rgba(0, 0, 0, 0.7));\n    height: 100%;\n    width: 100%; }\n  #intercom-container .intercom-video-reply-controls-bar {\n    position: absolute;\n    width: 100%;\n    height: 40px;\n    bottom: 0px; }\n  #intercom-container .intercom-video-reply-controls-playpausebutton {\n    position: absolute;\n    width: 39px;\n    left: 0px;\n    height: 100%;\n    opacity: 0.0;\n    background-position: center;\n    cursor: pointer; }\n    #intercom-container .intercom-video-reply-controls-playpausebutton.intercom-paused {\n      background-image: url(https://js.intercomcdn.com/images/video-play.png) /* noembed */;\n      background-size: 11px 12px;\n      background-repeat: no-repeat; }\n      @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n        #intercom-container .intercom-video-reply-controls-playpausebutton.intercom-paused {\n          background-image: url(https://js.intercomcdn.com/images/video-play@2x.png) /* noembed */; } }\n    #intercom-container .intercom-video-reply-controls-playpausebutton.intercom-unpaused {\n      background-image: url(https://js.intercomcdn.com/images/video-pause.png) /* noembed */;\n      background-size: 10px 12px;\n      background-repeat: no-repeat; }\n      @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n        #intercom-container .intercom-video-reply-controls-playpausebutton.intercom-unpaused {\n          background-image: url(https://js.intercomcdn.com/images/video-pause@2x.png) /* noembed */; } }\n  #intercom-container .intercom-video-reply-controls-mutebutton {\n    position: absolute;\n    width: 45px;\n    height: 100%;\n    right: 0px;\n    background-position: center;\n    cursor: pointer; }\n    #intercom-container .intercom-video-reply-controls-mutebutton.intercom-muted {\n      opacity: 1.0;\n      background-image: url(https://js.intercomcdn.com/images/video-muted.png) /* noembed */;\n      background-size: 19px 18px;\n      background-repeat: no-repeat; }\n      @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n        #intercom-container .intercom-video-reply-controls-mutebutton.intercom-muted {\n          background-image: url(https://js.intercomcdn.com/images/video-muted@2x.png) /* noembed */; } }\n    #intercom-container .intercom-video-reply-controls-mutebutton.intercom-unmuted {\n      opacity: 0.0;\n      background-image: url(https://js.intercomcdn.com/images/video-unmuted.png) /* noembed */;\n      background-size: 19px 18px;\n      background-repeat: no-repeat; }\n      @media (min--moz-device-pixel-ratio: 1.3), (-webkit-min-device-pixel-ratio: 1.3), (min-device-pixel-ratio: 1.3), (min-resolution: 1.3dppx) {\n        #intercom-container .intercom-video-reply-controls-mutebutton.intercom-unmuted {\n          background-image: url(https://js.intercomcdn.com/images/video-unmuted@2x.png) /* noembed */; } }\n  #intercom-container .intercom-video-reply-controls-progressbar {\n    position: absolute;\n    height: 2px;\n    width: 180px;\n    bottom: 19px;\n    left: 39px;\n    opacity: 0.0;\n    border-radius: 1px;\n    background: rgba(255, 255, 255, 0.5); }\n\n#intercom-container .intercom-image-only-comment-body {\n  padding: 0;\n  margin: 10px 0; }\n  #intercom-container .intercom-image-only-comment-body img {\n    border-radius: 4px; }\n#intercom-container .intercom-image-only-user-comment {\n  float: right; }\n  #intercom-container .intercom-image-only-user-comment .intercom-comment-metadata {\n    float: right; }\n#intercom-container .intercom-image-only-admin-comment {\n  padding-left: 38px; }\n\n@-webkit-keyframes fade-in {\n  0% {\n    opacity: 0; }\n\n  25% {\n    opacity: 0; }\n\n  50% {\n    opacity: 0; }\n\n  75% {\n    opacity: 0; }\n\n  100% {\n    opacity: 1; } }\n\n@keyframes fade-in {\n  0% {\n    opacity: 0; }\n\n  25% {\n    opacity: 0; }\n\n  50% {\n    opacity: 0; }\n\n  75% {\n    opacity: 0; }\n\n  100% {\n    opacity: 1; } }\n\n.intercom-installation-overlay {\n  z-index: 2147482999;\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(53, 53, 53, 0.9);\n  text-align: center;\n  -webkit-animation-name: fade-in;\n          animation-name: fade-in;\n  -webkit-animation-duration: 0.75s;\n          animation-duration: 0.75s; }\n\n.intercom-installation-content {\n  position: relative;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n      -ms-transform: translateY(-50%);\n          transform: translateY(-50%);\n  color: #ffffff;\n  font-size: 16px;\n  font-family: Helvetica, sans-serif;\n  font-weight: bold;\n  text-align: inherit; }\n\n.intercom-installation-icon {\n  width: 50px;\n  height: 50px;\n  background: #65CC93;\n  border-radius: 50%;\n  display: inline-block;\n  background-size: 25px 21px;\n  background-position: center center;\n  background-repeat: no-repeat;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAqCAYAAADxughHAAAAAXNSR0IArs4c6QAAAutJREFUaAXVmUloVEEQhidGXCBeogdxQQTxIrgggqgREQRFEQRB0ZOQQ0RB8OAhag6e3fCsghdvLkcFMV7FswsibicVJe5LRCdfQx5pXup1V/VMXjoNP9Ov+q+q/0+GTE2n0Zgiq9lsHgaXQMcUkTxeJuL3g3/Arctg2nhW5hFE7wDDwF/XeZieufQxeYjdBH74Drz9LfYzxtiZ7hC5Cnz2hEvbOwRnZ2qh0UDcMvBOUi7EHhDrys4MohaCV8Cy7mZlBOVzwWOLA7g/weZsjCCmCzwElvUX8q6cTMxE0D2LA7j/wcGcTHQi6KbRhKMfzclEB4KuJpg4lY0JJwQD5xJMXMzNxMkEE9fIyWdoRExfgonb5OQzXyHGn2S1fgYhzsrmLYUYaZKNmXkEYU6yCZK7k5OFROptBFWTLEfiekJ0nlBOFyJ5KXgLzugywizquEl2CFjWG8iLwpUDpyQvAa9BsQYC9OgRRSyTbNHzPZvl0eJVBJIXg5dFNe+1vyonFCc/ZZL9Qt6aUN3g2WjTF5748vZEsEDpkORukDLJ9pRK6R9puAA8B7F1XFOVIqmT7E5NfZFD0/ngWcyBd35MLDQahDc5kyyNBz2R2u0RyQzJbpK9oS3i8cR6Uo/KGMVWgA9eUc3WfRfoKxcldkWTXOKcLtdJfqbwSvCx1CD26Mz0Fk3Zn40lCOcXivy2vdJkNfgkNAuFnJlDoD9EqjibuEmWhmuB9RO4uMqs0CuG3STb2bbfglSIButA7GJMVKcM3odXzyRLo/Xgq1KYhdbaJCv95GMx1G0A3ywqI9ynnKdPsjHBoXMa94DvEYGa49Ym2ZBI7RkqtwDr9wjfXGuTrFaohoeqrcBdTVqX+6ORPslqxFk5CNoGfhmcOOPpk6xVoIWPsO3gt8KMu5NNn2QtolK5TiD4EzDjPu0PpNavNQ+hu8FwhZnWJ9k63WBiD3BvIX+1b5Kt2cxeXBRmztfZu+29MLIPuP99T+qd7AgPy3DCIsoWuwAAAABJRU5ErkJggg==); }\n\n.intercom-installation-heading {\n  font-size: 30px;\n  font-weight: bold;\n  text-align: inherit;\n  margin: 20px 0; }\n\n.intercom-installation-message {\n  font-weight: bold;\n  text-align: inherit;\n  margin: 10px 0; }\n  .intercom-installation-message:before {\n    content: \'—\';\n    margin-right: 5px; }\n\n.intercom-installation-button {\n  margin-top: 20px;\n  padding: 1.3em 2.2em;\n  border: 1px solid #ffffff;\n  border-radius: 20%/50%;\n  background: none;\n  font-size: 12px;\n  color: #ffffff;\n  text-transform: uppercase;\n  cursor: pointer;\n  outline: 0; }\n  .intercom-installation-button:hover {\n    color: #ddd;\n    border-color: #ddd; }\n\n.intercom-installation-arrow {\n  position: absolute;\n  right: 85px;\n  bottom: 32px;\n  width: 40px;\n  height: 40px;\n  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAAAXNSR0IArs4c6QAABeJJREFUeAHtnG2oFFUYx+9qaUFvlr1qpJZJL3YDKygSK7EXjajECK5ElERCkBVGUMQNevlSVB/6VJTUhwpKqChCUlIyRE0uJdKrKBFo9iJadhPz9vvv3VmOszN7Zs7uzM7unAeee87MOc/znOfnmd2ZOWftGxkZmYge2+fFicAYrE5G+52svVGfAJ6IzvIs3AgI4AkeoBs8WQUzcLa7i3JbBgDP44vkonKjcMteAINv4NvcXJTbSgAP1BDcWm4UbtkL4P6a6Swu4+lubsprZQIUhQfKi8Ixc2bdlWgg+6gc7+iqlGaagX8ZmQve3caxr9oIMONOC6ZfrfyJcpzNzrcbBAC2NwTxQaPZV20EgLcxBHAPx3pG9mIhoM9AyfejRf3vRGqP1Y98JZZAHEAZLGMWzoi19A1VAs0AHkOPFUAc61lZCABpChonj1rMfbMIQG9nDMFhzl/oKUUTCC5hta6N7tI3nvPvAdE/oUQAMgF+HtEenLqAyltArAQnfBkiAJxzUZsMhsz8oUkAetstBA/Tvsi08XWDAHCetQBU80F0vmHmqwEBwMwUoQTyD32uDex8aRAAzNYEANVlP3qVYVrKqvktHAB4O6hYyuNoXwXEBZZ+5WoGyDRUXxZJ5RAdl5SLkiVbgHyUlJ7Rb9DitjzNQJljgElTfZ/O/j2ipgogNqUhZ/TVkkBhNisxlns6MvUJfKcBJW31XwwKsUTKOIbQ53KHSNCx6A60FVmDcUcX64kvgJInOwHxrtHYLf3VTfcT6NG5J0BA4gYAlcTyXMdAwAq6WZHbILpBvyHXBBoBKo18P1oIOFtR2yhr8XV1XiCJZc5ApaF73Hvzil+NQ0C9UG23fIzDy7NOhBhhgMrjP3Qg69h1/wTT04le7WchG3C6GM1kNwR+owAqDz1BLawnmXWFYMsVNUPZje9n0BntzAV/cQCVil7N3dzOeLG+CDQGXYfmId8QZBCdGTughA34aAZQuejKmpfQXUO3VGscBJqKh69RvYnJS34k0Br0C3R9pVLZniYwYx6if7/FRrt0b8L3Oku/huZUAGXNgPTm5dUGT/md2EWo9eg2VHCrSvK/Um+QhABlp5261+NnQ4OTJidSA5QvBrWSomib0gVgD6pSex6Dci71CWgS2UunuUDckqSz+rgC1CWsWXCJnPSY/E4+1wBxa5K8nADKMbPwHIpN6Kk67jHZTT5zgPidLa+oV/o2m2o7zndSuR09mMiguzqdznBXM0mm2YbtDFCOgahvxvttQbq0fRLjFsSzm42/JYByDMQ3KJY1C9LFbVMYuyCeGZdDywDlGIgvUzwUF6TLz09n/J8BMfKzvi0ABQiIL1E8rHoPirb3aQm34XaobQAFDYgvUjyCjui4x+RS8vkUiPp9dV2cb2PqHiIqBLmD0yvQ4JegEb269pS+OG9ksvytDDIBKMdAvIziA/QsHfeY6Nl8ARCH23oJm5BwvpnjK9CvzPM9Ur+OPKpbYDIDKFBA/IVC/53AazruITlELm8qn8wu4TAsLmntKRTI2HuqsE1Bjw8zrgEmxzsaX6Yz0ARAwE84vhh91zzfZXXdXSwJ4HVs7MzGRWjczypoKqws7Ri0cGAQjUe1zvJHYXEdObBiPiQwxgno82hWq35HYnA7ejw8AQp3TF6TUa3KaXWuSPJ04WA1GxDkxqED6JcFoPhCs7EWvg2A/ehT6JYOwHyl8IDSDBCAk9D70A/RrL94XidGonvkRJ3SJJpXXxKcTCwtvGthS6pXTvql/UloK+vWekRbzL2ebpjLKcDV5tBTUP3+71s0qayk41HlpBaTNUBsWzsCuNotlnqDU26PcjH5FeX0agaykMs29QqjBzi65+YW4A27/GuWHeBGoM0H3gEXeLIpM8Ah8teree2hcZayAtwGsXnA+9OZXM2wjAB/IHftwPqtVXiyLxvAHeQseNpj6CUJAeM+8GfqU5PY+D4GgRrAXZTnG6d9NSkBwGlfi9ZivLgQAN4ZLnbeJicC/wMLmKUehkIagAAAAABJRU5ErkJggg==);\n  background-repeat: no-repeat;\n  background-size: 40px 40px; }\n\n#intercom-container .intercom-sheet-loading .intercom-app-profile-container {\n  visibility: hidden; }\n#intercom-container .intercom-app-profile-container {\n  padding: 16px 16px 0; }\n#intercom-container .intercom-app-profile {\n  padding: 20px 12px 26px 12px;\n  background-color: #fff;\n  overflow: hidden;\n  box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.2);\n  border-radius: 5px; }\n#intercom-container .intercom-app-profile-team {\n  text-align: center;\n  color: #455a64;\n  font-weight: 500;\n  font-size: 15px;\n  line-height: 1.8; }\n#intercom-container .intercom-app-profile-last-active .intercom-last-active {\n  position: relative;\n  bottom: auto;\n  color: #90A4AE; }\n#intercom-container .intercom-active-admins {\n  text-align: center;\n  color: #364850;\n  padding-top: 24px; }\n#intercom-container .intercom-active-admin {\n  display: inline-block; }\n#intercom-container .intercom-admin-avatar, #intercom-container .intercom-admin-avatar img {\n  width: 48px;\n  height: 48px; }\n#intercom-container .intercom-admin-fallback-avatar {\n  line-height: 48px;\n  font-size: 19.2px; }\n#intercom-container .intercom-active-admin-name {\n  font-size: 12px;\n  color: #90A4AE;\n  text-align: center;\n  padding-top: 7px;\n  width: 80px;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n#intercom-container .intercom-app-profile-text {\n  padding: 14px 30px 0px;\n  text-align: center;\n  font-size: 14px;\n  font-weight: 400;\n  color: #455A64;\n  line-height: 20px;\n  font-size: 13px;\n  color: #78909C;\n  line-height: 19px; }\n  #intercom-container .intercom-app-profile-text .intercom-comment-body {\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 20px; }\n  #intercom-container .intercom-app-profile-text p, #intercom-container .intercom-app-profile-text ul, #intercom-container .intercom-app-profile-text ol, #intercom-container .intercom-app-profile-text blockquote, #intercom-container .intercom-app-profile-text h1, #intercom-container .intercom-app-profile-text h2, #intercom-container .intercom-app-profile-text h3, #intercom-container .intercom-app-profile-text h4, #intercom-container .intercom-app-profile-text h5, #intercom-container .intercom-app-profile-text h6, #intercom-container .intercom-app-profile-text a, #intercom-container .intercom-app-profile-text .intercom-container, #intercom-container .intercom-app-profile-text code {\n    font-size: 14px;\n    font-weight: 400;\n    line-height: 20px;\n    word-wrap: break-word;\n    margin: 20px 0; }\n    #intercom-container .intercom-app-profile-text p:first-child, #intercom-container .intercom-app-profile-text ul:first-child, #intercom-container .intercom-app-profile-text ol:first-child, #intercom-container .intercom-app-profile-text blockquote:first-child, #intercom-container .intercom-app-profile-text h1:first-child, #intercom-container .intercom-app-profile-text h2:first-child, #intercom-container .intercom-app-profile-text h3:first-child, #intercom-container .intercom-app-profile-text h4:first-child, #intercom-container .intercom-app-profile-text h5:first-child, #intercom-container .intercom-app-profile-text h6:first-child, #intercom-container .intercom-app-profile-text a:first-child, #intercom-container .intercom-app-profile-text .intercom-container:first-child, #intercom-container .intercom-app-profile-text code:first-child {\n      margin-top: 0; }\n    #intercom-container .intercom-app-profile-text p:last-child, #intercom-container .intercom-app-profile-text ul:last-child, #intercom-container .intercom-app-profile-text ol:last-child, #intercom-container .intercom-app-profile-text blockquote:last-child, #intercom-container .intercom-app-profile-text h1:last-child, #intercom-container .intercom-app-profile-text h2:last-child, #intercom-container .intercom-app-profile-text h3:last-child, #intercom-container .intercom-app-profile-text h4:last-child, #intercom-container .intercom-app-profile-text h5:last-child, #intercom-container .intercom-app-profile-text h6:last-child, #intercom-container .intercom-app-profile-text a:last-child, #intercom-container .intercom-app-profile-text .intercom-container:last-child, #intercom-container .intercom-app-profile-text code:last-child {\n      margin-bottom: 0; }\n  #intercom-container .intercom-app-profile-text h1, #intercom-container .intercom-app-profile-text h1 a {\n    font-size: 14px;\n    font-weight: 700;\n    line-height: 20px;\n    letter-spacing: normal;\n    margin: 27px 0;\n    color: inherit; }\n  #intercom-container .intercom-app-profile-text h2, #intercom-container .intercom-app-profile-text h2 a {\n    font-size: 14px;\n    line-height: 20px;\n    font-weight: bold;\n    margin: 20px 0 10px;\n    color: inherit; }\n  #intercom-container .intercom-app-profile-text ul, #intercom-container .intercom-app-profile-text ol {\n    font-size: 14px;\n    -moz-padding-start: 40px;\n    -webkit-padding-start: 40px;\n    -khtml-padding-start: 40px;\n    -o-padding-start: 40px;\n    padding-start: 40px;\n    padding-left: 30px; }\n  #intercom-container .intercom-app-profile-text [dir=ltr] ul, #intercom-container .intercom-app-profile-text [dir=ltr] ol {\n    padding-left: 30px; }\n  #intercom-container .intercom-app-profile-text [dir=rtl] ul, #intercom-container .intercom-app-profile-text [dir=rtl] ol {\n    padding-right: 30px; }\n  #intercom-container .intercom-app-profile-text ul > li {\n    list-style-type: disc; }\n  #intercom-container .intercom-app-profile-text ol > li {\n    list-style-type: decimal; }\n  #intercom-container .intercom-app-profile-text li {\n    display: list-item;\n    line-height: 20px;\n    margin-bottom: 10px;\n    font-weight: 400; }\n  #intercom-container .intercom-app-profile-text em, #intercom-container .intercom-app-profile-text i {\n    font-style: italic; }\n  #intercom-container .intercom-app-profile-text strong, #intercom-container .intercom-app-profile-text b {\n    font-weight: bold;\n    line-height: 100%; }\n  #intercom-container .intercom-app-profile-text pre {\n    font-size: 14px;\n    padding: 0 0 10px 0;\n    white-space: pre-wrap; }\n  #intercom-container .intercom-app-profile-text img {\n    display: block;\n    max-width: 100%;\n    margin: 10px 0; }\n  #intercom-container .intercom-app-profile-text p + br {\n    display: none; }\n  #intercom-container .intercom-app-profile-text a:link, #intercom-container .intercom-app-profile-text a:visited, #intercom-container .intercom-app-profile-text a:hover, #intercom-container .intercom-app-profile-text a:active {\n    text-decoration: underline; }\n  #intercom-container .intercom-app-profile-text a:link, #intercom-container .intercom-app-profile-text a:visited {\n    color: custom-color; }\n  #intercom-container .intercom-app-profile-text a:hover, #intercom-container .intercom-app-profile-text a:active {\n    color: custom-color-darker; }\n  #intercom-container .intercom-app-profile-text h2 + p, #intercom-container .intercom-app-profile-text h2 + ul, #intercom-container .intercom-app-profile-text h2 + ol, #intercom-container .intercom-app-profile-text h2 + blockquote, #intercom-container .intercom-app-profile-text h2 + .ic_button_in_content, #intercom-container .intercom-app-profile-text h2 + .ic_social_block, #intercom-container .intercom-app-profile-text h3 + p, #intercom-container .intercom-app-profile-text h3 + ul, #intercom-container .intercom-app-profile-text h3 + ol, #intercom-container .intercom-app-profile-text h3 + blockquote, #intercom-container .intercom-app-profile-text h3 + .ic_button_in_content, #intercom-container .intercom-app-profile-text h3 + .ic_social_block, #intercom-container .intercom-app-profile-text h4 + p, #intercom-container .intercom-app-profile-text h4 + ul, #intercom-container .intercom-app-profile-text h4 + ol, #intercom-container .intercom-app-profile-text h4 + blockquote, #intercom-container .intercom-app-profile-text h4 + .ic_button_in_content, #intercom-container .intercom-app-profile-text h4 + .ic_social_block, #intercom-container .intercom-app-profile-text h5 + p, #intercom-container .intercom-app-profile-text h5 + ul, #intercom-container .intercom-app-profile-text h5 + ol, #intercom-container .intercom-app-profile-text h5 + blockquote, #intercom-container .intercom-app-profile-text h5 + .ic_button_in_content, #intercom-container .intercom-app-profile-text h5 + .ic_social_block, #intercom-container .intercom-app-profile-text h6 + p, #intercom-container .intercom-app-profile-text h6 + ul, #intercom-container .intercom-app-profile-text h6 + ol, #intercom-container .intercom-app-profile-text h6 + blockquote, #intercom-container .intercom-app-profile-text h6 + .ic_button_in_content, #intercom-container .intercom-app-profile-text h6 + .ic_social_block {\n    margin-top: 0; }\n  #intercom-container .intercom-app-profile-text .intercom-h2b-twitter, #intercom-container .intercom-app-profile-text .intercom-h2b-facebook {\n    max-width: 100%; }\n  #intercom-container .intercom-app-profile-text iframe[src*="vimeo.com"], #intercom-container .intercom-app-profile-text iframe[src*="wistia.net"], #intercom-container .intercom-app-profile-text iframe[src*="youtube.com"] {\n    width: 100%;\n    height: 149px;\n    margin: 20px auto; }\n  #intercom-container .intercom-app-profile-text p {\n    text-align: center;\n    font-size: 13px;\n    color: #78909C;\n    line-height: 19px; }\n    #intercom-container .intercom-app-profile-text p a:link, #intercom-container .intercom-app-profile-text p a:visited {\n      color: #78909C; }\n\n#intercom-container .intercom-image-viewable {\n  cursor: -webkit-zoom-in;\n  cursor: zoom-in; }\n\n#intercom-container .intercom-zoomed-image {\n  z-index: 2147483004;\n  position: fixed;\n  cursor: -webkit-zoom-out;\n  cursor: zoom-out;\n  transition: all 300ms ease; }\n#intercom-container .intercom-zoomed-image-placeholder {\n  background-color: #e4e5e7;\n  border-radius: 4px; }\n\n#intercom-container .intercom-image-viewer-overlay {\n  z-index: 2147483003;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background: black;\n  cursor: -webkit-zoom-out;\n  cursor: zoom-out;\n  opacity: 0; }\n\n#intercom-container .intercom-admin-avatar {\n  overflow: hidden;\n  text-align: center;\n  background-color: #fff; }\n  #intercom-container .intercom-admin-avatar, #intercom-container .intercom-admin-avatar img {\n    margin: 0 auto;\n    border-radius: 50%; }\n#intercom-container .intercom-admin-fallback-avatar {\n  color: #fff;\n  text-align: center;\n  font-weight: 500;\n  background-color: custom-color; }\n'
}), define("sync", ["features", "underscore", "jquery", "models/conversation", "models/part", "models/upload", "models/user", "collections/conversations"], function(a, b, c, d, e, f, g, h) {
    "use strict";
    return function(a, c) {
        return function(i, j, k) {
            if (j.constructor === d && "read" === i)
                return a.getConversation(j.id).then(k.success).fail(k.error);
            if (j.constructor === d && "update" === i)
                return a.markConversationAsRead(j.toJSON()).then(k.success).fail(k.error);
            if (j.constructor === d && "create" === i)
                return a.createConversation(j.toJSON()).then(b.bind(c.syncCreateConversation, c)).then(k.success).fail(k.error);
            if (j.constructor === h && "read" === i)
                return a.getConversations({page: j.pages}).then(k.success).fail(k.error);
            if (j.constructor === e && "create" === i)
                return a.createComment(j.toJSON()).then(b.bind(c.syncCreateComment, c)).then(k.success).fail(k.error);
            if (j.constructor === f && "create" === i)
                return a.createUpload(j.toJSON()).then(k.success).fail(k.error);
            if (j.constructor === f && "update" === i)
                return a.updateUpload(j.toJSON()).then(k.success).fail(k.error);
            if (j.constructor === g) {
                var l = c.getMetrics();
                return c.resetMetrics(), a.createOrUpdateUser(l).then(k.success).fail(k.error)
            }
        }
    }
}), define("template", ["underscore", "i18n", "time"], function(a, b, c) {
    "use strict";
    function d(d) {
        var e = require("templates/" + d);
        return function(d) {
            return e.call(this, a.extend({}, d, {t: b.translate,relativeTime: c.relativeTimeInWords}))
        }
    }
    return {load: d}
}), define("templates/admin-avatar", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += "", __p += hasAvatar ? '<img src="' + (null == (__t = avatarUri) ? "" : _.escape(__t)) + '" alt="' + (null == (__t = adminFirstName) ? "" : _.escape(__t)) + '">' : "" + (null == (__t = adminFirstInitial) ? "" : _.escape(__t)), __p += "\n";
        return __p
    }
}), define("templates/announcement", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += "", part.adminAvatar() && (__p += '\n  <div class="intercom-announcement-avatar-container">\n    <img src="' + (null == (__t = part.adminAvatar()) ? "" : _.escape(__t)) + '" class="intercom-announcement-avatar" />\n  </div>\n'), __p += '\n<div class="intercom-announcement">\n  <div class="intercom-announcement-body-container">\n    <div class="intercom-announcement-body intercom-embed-body">\n      ' + (null == (__t = partBody) ? "" : __t) + '\n    </div>\n    <div class="intercom-attachments">\n      ', part.uploads.each(function(a) {
                __p += '\n        <div class="intercom-attachment">\n          <a href="' + (null == (__t = a.url()) ? "" : _.escape(__t)) + '" target="_blank">' + (null == (__t = a.name()) ? "" : _.escape(__t)) + "</a>\n        </div>\n      "
            }), __p += '\n    </div>\n    <div class="intercom-lwr-composer-container"></div>\n  </div>\n</div>\n';
        return __p
    }
}), define("templates/app-hovercard", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-launcher-hovercard-welcome">\n  <div class="intercom-launcher-hovercard-admins"></div>\n  <div class="intercom-launcher-hovercard-text">\n    <div class="intercom-launcher-hovercard-app-name">' + (null == (__t = appName) ? "" : _.escape(__t)) + '</div>\n    <div class="intercom-launcher-hovercard-welcome-text"></div>\n  </div>\n</div>\n<div class="intercom-launcher-hovercard-textarea">\n  <textarea placeholder="' + (null == (__t = t("new-conversation-placeholder")) ? "" : __t) + '"></textarea>\n</div>\n';
        return __p
    }
}), define("templates/app-profile-admin", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-active-admin">\n  ' + (null == (__t = adminAvatar) ? "" : __t) + "\n  ", firstName && (__p += '\n    <div class="intercom-active-admin-name">\n      ' + (null == (__t = firstName) ? "" : _.escape(__t)) + "\n    </div>\n  "), __p += "\n</div>\n";
        return __p
    }
}), define("templates/app-profile", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-app-profile-team-and-activity">\n  <div class="intercom-app-profile-team">' + (null == (__t = appName) ? "" : _.escape(__t)) + '</div>\n  <div class="intercom-app-profile-last-active"></div>\n</div>\n<div class="intercom-active-admins"></div>\n<div class="intercom-app-profile-text">\n  <p>' + (null == (__t = message) ? "" : __t) + "</p>\n</div>\n";
        return __p
    }
}), define("templates/auto-response", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-auto-response-text">\n  ', medianResponseTimeEnabled ? (__p += "\n    " + (null == (__t = medianResponseTimeBodyHTML) ? "" : __t) + "\n    ", haveEmail && (__p += "\n      <p>" + (null == (__t = t("median-reply-autoresponse-with-email", {email: email})) ? "" : _.escape(__t)) + "</p>\n    "), __p += "\n  ") : (__p += "\n    ", customAutoResponseEnabled ? (__p += "\n      ", customAutoResponse && (__p += "\n        <p>" + (null == (__t = customAutoResponse) ? "" : _.escape(__t)) + "</p>\n      "), __p += "\n      ", haveEmail && (__p += "\n        <p>" + (null == (__t = t("check-back-or-email", {email: email})) ? "" : _.escape(__t)) + "</p>\n      "), __p += "\n    ") : (__p += "\n      ", __p += haveEmail ? "\n        <p>" + (null == (__t = t("team-will-reply-asap")) ? "" : _.escape(__t)) + "</p>\n        <p>" + (null == (__t = t("check-back-or-email", {email: email})) ? "" : _.escape(__t)) + "</p>\n      " : "\n        <p>" + (null == (__t = t("message-autoresponse")) ? "" : _.escape(__t)) + "</p>\n      ", __p += "\n    "), __p += "\n  "), __p += "\n</div>\n";
        return __p
    }
}), define("templates/comment-metadata", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-comment-metadata">\n  <span class="intercom-comment-state">\n    ' + (null == (__t = commentState) ? "" : __t) + '\n  </span>\n</div>\n<div class="intercom-comment-readstate"></div>\n';
        return __p
    }
}), define("templates/comment", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-comment ' + (null == (__t = part.byUser() ? "intercom-comment-by-user" : "intercom-comment-by-admin") ? "" : _.escape(__t)) + '">\n  ', part.byAdmin() && (__p += "\n    ", __p += part.adminAvatar() ? '\n      <img src="' + (null == (__t = part.adminAvatar()) ? "" : _.escape(__t)) + '" class="intercom-comment-avatar">\n    ' : '\n      <div class="intercom-comment-avatar intercom-default-admin-avatar">' + (null == (__t = part.adminInitials()) ? "" : _.escape(__t)) + "</div>\n    ", __p += "\n  "), __p += '\n  <div class="intercom-comment-body-container">\n    <div class="intercom-comment-body intercom-embed-body">\n      ' + (null == (__t = partBody) ? "" : __t) + '\n    </div>\n    <div class="intercom-attachments">\n      ', part.uploads.each(function(a) {
                __p += '\n        <div class="intercom-attachment">\n          <a href="' + (null == (__t = a.url()) ? "" : _.escape(__t)) + '" target="_blank">' + (null == (__t = a.name()) ? "" : _.escape(__t)) + "</a>\n        </div>\n      "
            }), __p += '\n    </div>\n    <div class="intercom-comment-caret"></div>\n    <div class="intercom-lwr-composer-container"></div>\n  </div>\n  <div class="intercom-comment-metadata-container">\n  </div>\n</div>\n';
        return __p
    }
}), define("templates/composer", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-composer-upload-error">' + (null == (__t = t("max-upload-size", {number: 40})) ? "" : _.escape(__t)) + '</div>\n<div class="intercom-composer-textarea-container">\n  <input type="submit" class="intercom-composer-send-button" value="' + (null == (__t = t("send")) ? "" : _.escape(__t)) + '"></input>\n  <input style="display:none" type="file">\n  <div class="intercom-composer-emoji-selector-container"></div>\n  <div class="intercom-composer-textarea">\n    <strong class="intercom-composer-upload-button" title="' + (null == (__t = t("send-attachment")) ? "" : _.escape(__t)) + '"></strong>\n    <strong class="intercom-composer-emoji-button" title="' + (null == (__t = t("insert-emoji")) ? "" : _.escape(__t)) + '"></strong>\n    <pre><span></span><br></pre>\n    <textarea></textarea>\n  </div>\n</div>\n<div class="intercom-composer-press-enter-to-send">' + (null == (__t = t("press-enter-to-send")) ? "" : _.escape(__t)) + "</div>\n";
        return __p
    }
}), define("templates/conversation-item", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += "", conversation.lastAdmin() ? (__p += "\n  ", __p += conversation.lastAdminAvatar() ? '\n    <img src="' + (null == (__t = conversation.lastAdminAvatar()) ? "" : _.escape(__t)) + '" class="intercom-conversations-item-admin-avatar" />\n  ' : '\n    <div class="intercom-conversations-item-admin-avatar intercom-conversations-item-admin-avatar-no-image">' + (null == (__t = conversation.lastAdminInitials()) ? "" : _.escape(__t)) + "</div>\n  ", __p += "\n") : __p += '\n    <div class="intercom-conversations-item-user-avatar"></div>\n', __p += '\n<div class="intercom-conversations-item-body-container">\n  <div class="intercom-conversations-item-body">\n    <div class="intercom-conversations-item-header">\n      <div class="intercom-conversations-item-timestamp"></div>\n      <div class="intercom-conversations-item-title-container">\n        <div class="intercom-conversations-item-title">\n          ', __p += conversation.lastAdmin() ? "\n            " + (null == (__t = conversation.lastAdminName()) ? "" : _.escape(__t)) + "\n          " : "\n            " + (null == (__t = t("you")) ? "" : _.escape(__t)) + "\n          ", __p += '\n        </div>\n      </div>\n    </div>\n    <div class="intercom-conversations-item-summary">\n      <div class="intercom-conversations-item-readstate"></div>\n      ' + (null == (__t = preview) ? "" : __t) + "\n    </div>\n  </div>\n</div>\n";
        return __p
    }
}), define("templates/conversation-title", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += "", __p += adminName ? "\n  " + (null == (__t = adminFirstName) ? "" : _.escape(__t)) + "\n" : "\n  " + (null == (__t = appName) ? "" : _.escape(__t)) + "\n", __p += "\n";
        return __p
    }
}), define("templates/conversation", [], function() {
    return function(obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-sheet-header">\n  <a class="intercom-sheet-header-button intercom-sheet-header-conversations-button" href="#">\n    <div class="intercom-sheet-header-button-icon"></div>\n    <div class="intercom-unread-counter"></div>\n  </a>\n  <div class="intercom-sheet-header-title-container">\n    <b class="intercom-sheet-header-title"></b>\n  </div>\n  <div class="intercom-sheet-header-generic-title"></div>\n  <a class="intercom-sheet-header-button intercom-sheet-header-close-button" href="#">\n    <div class="intercom-sheet-header-button-icon"></div>\n  </a>\n  <a class="intercom-sheet-header-button intercom-sheet-header-minimize-button" href="#">\n    <div class="intercom-sheet-header-button-icon"></div>\n  </a>\n</div>\n<div class="intercom-sheet-body">\n  <div class="intercom-sheet-spinner"></div>\n</div>\n<div class="intercom-sheet-content">\n  <div class="intercom-sheet-content-container">\n    <div class="intercom-app-profile-container"></div>\n    <div class="intercom-conversation-parts-container">\n      <div class="intercom-conversation-parts"></div>\n    </div>\n  </div>\n</div>\n<div class="intercom-composer-container">\n</div>\n';
        return __p
    }
}), define("templates/conversations", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-sheet-header">\n  <div class="intercom-sheet-header-title-container">\n    <b class="intercom-sheet-header-title">' + (null == (__t = appName) ? "" : _.escape(__t)) + '</b>\n  </div>\n  <a class="intercom-sheet-header-button intercom-sheet-header-close-button" href="#">\n    <div class="intercom-sheet-header-button-icon"></div>\n  </a>\n</div>\n<div class="intercom-sheet-body">\n  <div class="intercom-sheet-spinner"></div>\n</div>\n<div class="intercom-sheet-content intercom-conversations-content">\n  <div class="intercom-sheet-content-container">\n    <div class="intercom-conversations-items"></div>\n    <div class="intercom-conversations-spinner"></div>\n  </div>\n  <div class="intercom-no-conversations">\n    <div class="intercom-no-conversations-icon"></div>\n    ' + (null == (__t = t("no-conversations")) ? "" : _.escape(__t)) + "\n  </div>\n</div>\n", inboundMessagingEnabled && (__p += '\n  <div class="intercom-sheet-footer intercom-conversations-footer">\n    <a class="intercom-conversations-new-conversation-button" href="#"><i></i>' + (null == (__t = t("new-message")) ? "" : _.escape(__t)) + "</a>\n  </div>\n"), __p += "\n";
        return __p
    }
}), define("templates/embed/conversation", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += "", (adminName || appName) && (__p += '\n<div class="intercom-sheet-header">\n  <div class="intercom-sheet-header-title-container">\n    <b class="intercom-sheet-header-title">\n      ', __p += adminName ? "\n        " + (null == (__t = adminName) ? "" : _.escape(__t)) + " from " + (null == (__t = appName) ? "" : _.escape(__t)) + "\n      " : "\n        " + (null == (__t = appName) ? "" : _.escape(__t)) + "\n      ", __p += "\n    </b>\n  </div>\n</div>\n"), __p += '\n<div class="intercom-sheet-body"></div>\n<div class="intercom-sheet-content">\n  <div class="intercom-sheet-content-container">\n    <div class="intercom-app-profile-container"></div>\n    <div class="intercom-conversation-parts-container">\n      <div class="intercom-conversation-parts"></div>\n    </div>\n  </div>\n</div>\n<div class="intercom-composer-container">\n</div>\n';
        return __p
    }
}), define("templates/embed/launcher", [], function() {
    return function(obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += "<div class='intercom-launcher-button'></div>\n<div class='intercom-launcher-badge'></div>\n<div class='intercom-launcher-preview'>\n  <div class='intercom-launcher-preview-body'></div>\n  <div class='intercom-launcher-preview-caret'></div>\n  <div class='intercom-launcher-preview-close'></div>\n</div>\n";
        return __p
    }
}), define("templates/icon-emotion-happy", [], function() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n  <g class="intercom-lwr-composer-icon" fill="#aaaaaa">\n    <path d="M9,2 C12.9,2 16,5.1 16,9 C16,12.9 12.9,16 9,16 C5.1,16 2,12.9 2,9 C2,5.1 5.1,2 9,2 L9,2 Z M9,0 C4,0 0,4 0,9 C0,14 4,18 9,18 C14,18 18,14 18,9 C18,4 14,0 9,0 L9,0 L9,0 Z"></path>\n    <circle cx="9" cy="10" r="4"></circle>\n    <rect class="intercom-lwr-option-background" x="5" y="6" width="8" height="4" fill="#aaaaaa"></rect>\n    <circle cx="6.5" cy="6.5" r="1.5"></circle>\n    <circle cx="11.5" cy="6.5" r="1.5"></circle>\n  </g>\n</svg>\n'
}), define("templates/icon-emotion-neutral", [], function() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n  <g class="intercom-lwr-composer-icon" fill="#aaaaaa">\n    <path d="M9,2 C12.9,2 16,5.1 16,9 C16,12.9 12.9,16 9,16 C5.1,16 2,12.9 2,9 C2,5.1 5.1,2 9,2 L9,2 Z M9,0 C4,0 0,4 0,9 C0,14 4,18 9,18 C14,18 18,14 18,9 C18,4 14,0 9,0 L9,0 L9,0 Z"></path>\n    <circle cx="6.5" cy="6.5" r="1.5"></circle>\n    <circle cx="11.5" cy="6.5" r="1.5"></circle>\n    <path d="M13,12 C13,12.6 12.6,13 12,13 L6,13 C5.4,13 5,12.6 5,12 L5,12 C5,11.4 5.4,11 6,11 L12,11 C12.6,11 13,11.4 13,12 L13,12 L13,12 Z"></path>\n  </g>\n</svg>\n'
}), define("templates/icon-emotion-sad", [], function() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n  <g class="intercom-lwr-composer-icon" fill="#aaaaaa">\n    <g transform="translate(5.000000, 9.000000)">\n      <path d="M4,2 C5.1,2 6,2.9 6,4 C6,5.1 5.1,6 4,6 C2.9,6 2,5.1 2,4 C2,2.9 2.9,2 4,2 L4,2 Z M4,0 C1.8,0 0,1.8 0,4 C0,6.2 1.8,8 4,8 C6.2,8 8,6.2 8,4 C8,1.8 6.2,0 4,0 L4,0 L4,0 Z"></path>\n    </g>\n    <rect class="intercom-lwr-option-background" x="5" y="13" width="8" height="4" fill="#aaaaaa"></rect>\n    <path d="M9,2 C12.9,2 16,5.1 16,9 C16,12.9 12.9,16 9,16 C5.1,16 2,12.9 2,9 C2,5.1 5.1,2 9,2 L9,2 Z M9,0 C4,0 0,4 0,9 C0,14 4,18 9,18 C14,18 18,14 18,9 C18,4 14,0 9,0 L9,0 L9,0 Z"></path>\n    <circle cx="6.5" cy="6.5" r="1.5"></circle>\n    <circle cx="11.5" cy="6.5" r="1.5"></circle>\n  </g>\n</svg>\n'
}), define("templates/icon-thumbs-down", [], function() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg width="15px" height="14px" viewBox="0 0 15 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n  <g class="intercom-lwr-composer-icon" fill="#aaaaaa">\n    <path d="M3.59655172,9.23508772 L3.59655172,8.59649123 L3.59655172,1.00701754 L3.59655172,0.392982456 L2.96896552,0.392982456 L0.531034483,0.392982456 L-0.0965517241,0.392982456 L-0.0965517241,1.03157895 L-0.0965517241,8.59649123 L-0.0965517241,9.23508772 L0.531034483,9.23508772 L2.99310345,9.23508772 L3.59655172,9.23508772 L3.59655172,9.23508772 Z"></path>\n    <path d="M9.06206897,13.9754386 C10.0517241,13.9754386 11.0896552,12.9192982 11.0896552,11.2 C11.0896552,10.5122807 10.8965517,9.8 10.6551724,9.23508772 L13.0689655,9.23508772 C14.0586207,9.23508772 14.8551724,8.4245614 14.8551724,7.41754386 C14.8551724,7.0245614 14.7344828,6.65614035 14.5172414,6.36140351 C14.637931,6.11578947 14.7103448,5.82105263 14.7103448,5.52631579 C14.7103448,4.93684211 14.4448276,4.42105263 14.0103448,4.10175439 C14.0344828,3.97894737 14.0586207,3.83157895 14.0586207,3.68421053 C14.0586207,3.11929825 13.7931034,2.60350877 13.3827586,2.25964912 C13.4310345,2.1122807 13.4310345,1.96491228 13.4310345,1.81754386 C13.4310345,0.810526316 12.6344828,8.8817842e-16 11.6448276,8.8817842e-16 L11.5,8.8817842e-16 L10.462069,8.8817842e-16 L8.86896552,8.8817842e-16 L8.43448276,8.8817842e-16 L8.26551724,8.8817842e-16 C7.22758621,8.8817842e-16 6.50344828,0.368421053 6.35862069,0.442105263 L4.47586207,1.4 L4.06551724,1.59649123 L4.06551724,2.06315789 L4.06551724,7.76140351 L4.06551724,8.12982456 L4.35517241,8.35087719 C4.35517241,8.35087719 5.36896552,9.13684211 6.45517241,10.1684211 C7.54137931,11.1754386 7.54137931,11.4947368 7.54137931,11.9122807 C7.54137931,13.4350877 8.36206897,13.9754386 9.06206897,13.9754386 L9.06206897,13.9754386 L9.06206897,13.9754386 Z"></path>\n  </g>\n</svg>\n'
}), define("templates/icon-thumbs-up", [], function() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg width="15px" height="14px" viewBox="0 0 15 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n  <g class="intercom-lwr-composer-icon" fill="#aaaaaa">\n    <path d="M3.59655172,4.76491228 L2.96896552,4.76491228 L0.531034483,4.76491228 L-0.0965517241,4.76491228 L-0.0965517241,5.40350877 L-0.0965517241,12.9929825 L-0.0965517241,13.6315789 L0.531034483,13.6315789 L2.99310345,13.6315789 L3.62068966,13.6315789 L3.62068966,12.9929825 L3.62068966,5.40350877 L3.62068966,4.76491228 L3.59655172,4.76491228 L3.59655172,4.76491228 Z"></path>\n    <path d="M9.06206897,0.0245614035 C8.36206897,0.0245614035 7.56551724,0.564912281 7.56551724,2.1122807 C7.56551724,2.52982456 7.56551724,2.84912281 6.47931034,3.85614035 C5.39310345,4.86315789 4.37931034,5.64912281 4.35517241,5.64912281 L4.06551724,5.87017544 L4.06551724,6.23859649 L4.06551724,11.9368421 L4.06551724,12.4035088 L4.47586207,12.6 L6.35862069,13.5578947 C6.50344828,13.6315789 7.22758621,14 8.26551724,14 L8.43448276,14 L8.86896552,14 L10.462069,14 L11.5,14 L11.6448276,14 C12.6344828,14 13.4310345,13.1894737 13.4310345,12.1824561 C13.4310345,12.0350877 13.4068966,11.8877193 13.3827586,11.7403509 C13.7931034,11.3964912 14.0586207,10.8807018 14.0586207,10.3157895 C14.0586207,10.1684211 14.0344828,10.045614 14.0103448,9.89824561 C14.4448276,9.57894737 14.7103448,9.03859649 14.7103448,8.47368421 C14.7103448,8.17894737 14.637931,7.88421053 14.5172414,7.63859649 C14.7344828,7.34385965 14.8551724,6.9754386 14.8551724,6.58245614 C14.8551724,5.5754386 14.0586207,4.76491228 13.0689655,4.76491228 L10.6551724,4.76491228 C10.8965517,4.2 11.0896552,3.5122807 11.0896552,2.8 C11.0896552,1.08070175 10.0275862,0.0245614035 9.06206897,0.0245614035 L9.06206897,0.0245614035 L9.06206897,0.0245614035 Z"></path>\n  </g>\n</svg>\n'
}), define("templates/icon-tick", [], function() {
    return '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<svg width="13px" height="10px" viewBox="0 0 13 10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\n  <g transform="translate(0.000000, -3.000000)" fill="white">\n    <path d="M0.151084779,9.14637515 C-0.0507822562,8.93484281 -0.0502405736,8.5883902 0.151987583,8.37723526 L1.45166461,7.01878627 C1.65389277,6.80725393 1.98504138,6.80725393 2.18745009,7.01840887 L4.29820648,9.21940193 C4.5006152,9.43055687 4.83140268,9.43017947 5.03345028,9.21864713 L10.8178978,3.15931173 C11.0199454,2.94777939 11.351094,2.94664719 11.5540444,3.15742473 L12.8472212,4.49926815 C13.0501716,4.71004569 13.0510745,5.0553661 12.8490269,5.26708714 L5.83441823,12.6152414 C5.63237063,12.8267737 5.23315058,13 4.94714219,13 L4.34117996,13 C4.05517157,13 3.65631264,12.8263963 3.45444561,12.614864 L0.151084779,9.14637515"></path>\n  </g>\n</svg>\n'
}), define("templates/image-only-part", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-comment ' + (null == (__t = isAdminPart ? "intercom-image-only-admin-comment" : "intercom-image-only-user-comment") ? "" : _.escape(__t)) + '">\n  ', isAdminPart && adminAvatar && (__p += '\n    <img src="' + (null == (__t = adminAvatar) ? "" : _.escape(__t)) + '" class="intercom-comment-avatar">\n  '), __p += '\n  <div class="intercom-comment-body-container">\n    <div class="intercom-comment-body intercom-image-only-comment-body">\n      ' + (null == (__t = partBody) ? "" : __t) + '\n    </div>\n  </div>\n  <div class="intercom-comment-metadata-container">\n  </div>\n</div>\n';
        return __p
    }
}), define("templates/image-viewer", [], function() {
    return function(obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-image-viewer-overlay"></div>\n';
        return __p
    }
}), define("templates/is-typing", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-comment intercom-comment-by-admin">\n  ', __p += adminAvatar ? '\n    <img src="' + (null == (__t = adminAvatar) ? "" : _.escape(__t)) + '" class="intercom-comment-avatar">\n  ' : '\n    <div class="intercom-comment-avatar intercom-default-admin-avatar">' + (null == (__t = adminInitials) ? "" : _.escape(__t)) + "</div>\n  ", __p += '\n  <div class="intercom-comment-body-container">\n    <div class="intercom-comment-body">\n      <div class="intercom-is-typing-icon"></div>\n    </div>\n    <div class="intercom-comment-caret"></div>\n  </div>\n</div>\n';
        return __p
    }
}), define("templates/last-active", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<span class="relative-time-in-text">' + (null == (__t = lastActive) ? "" : _.escape(__t)) + "</span>\n";
        return __p
    }
}), define("templates/launcher", [], function() {
    return function(obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-launcher-button">\n  <div class="intercom-launcher-initials"></div>\n</div>\n<div class="intercom-launcher-badge"></div>\n<div class="intercom-launcher-preview">\n  <div class="intercom-launcher-preview-body"></div>\n  <div class="intercom-launcher-preview-caret"></div>\n  <div class="intercom-launcher-preview-close"></div>\n</div>\n';
        return __p
    }
}), define("templates/loading", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-sheet-header">\n  <div class="intercom-sheet-header-title-container">\n    <b class="intercom-sheet-header-title">' + (null == (__t = appName) ? "" : _.escape(__t)) + '</b>\n  </div>\n  <a class="intercom-sheet-header-button intercom-sheet-header-close-button" href="#">\n    <div class="intercom-sheet-header-button-icon"></div>\n  </a>\n</div>\n<div class="intercom-sheet-body">\n  <div class="intercom-sheet-spinner"></div>\n</div>\n<div class="intercom-sheet-content">\n</div>\n';
        return __p
    }
}), define("templates/lwr-emotions-composer", [], function() {
    return function(obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-lwr-composer-options intercom-lwr-composer-options-emotions">\n  <div class="intercom-lwr-composer-option intercom-lwr-composer-option-happy" data-option="happy">\n    <div class="intercom-lwr-icon"></div>\n  </div>\n  <div class="intercom-lwr-composer-option intercom-lwr-composer-option-neutral" data-option="neutral">\n    <div class="intercom-lwr-icon"></div>\n  </div>\n  <div class="intercom-lwr-composer-option intercom-lwr-composer-option-sad" data-option="sad">\n    <div class="intercom-lwr-icon"></div>\n  </div>\n</div>\n';
        return __p
    }
}), define("templates/lwr-thumbs-composer", [], function() {
    return function(obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-lwr-composer-options intercom-lwr-composer-options-thumbs">\n  <div class="intercom-lwr-composer-option intercom-lwr-composer-option-thumbs-up" data-option="thumbs_up">\n    <div class="intercom-lwr-icon"></div>\n  </div>\n  <div class="intercom-lwr-composer-option intercom-lwr-composer-option-thumbs-down" data-option="thumbs_down">\n    <div class="intercom-lwr-icon"></div>\n  </div>\n</div>\n';
        return __p
    }
}), define("templates/new-anonymous-user", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += "", __p += haveEmail ? "\n  <p>" + (null == (__t = t("anonymous-email-response", {email: email})) ? "" : _.escape(__t)) + "</p>\n" : "\n  <p>" + (null == (__t = t(emailCollectorText)) ? "" : _.escape(__t)) + '</p>\n  <div class="intercom-new-anonymous-user-input-container">\n    <input type="email" name="email" autocapitalize="off" placeholder="' + (null == (__t = t("your-email")) ? "" : _.escape(__t)) + '" formnovalidate="true"/>\n    <input type="submit" value="" />\n  </div>\n', __p += "\n";
        return __p
    }
}), define("templates/powered-by", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<a href="https://www.intercom.io?utm_source=web-app&amp;utm_medium=' + (null == (__t = trackingType) ? "" : _.escape(__t)) + '&amp;utm_campaign=powered-by-intercom" target="_blank">\n  <i></i>\n  <span>We run on <u>Intercom</u></span>\n</a>\n';
        return __p
    }
}), define("templates/small-announcement", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += "", part.adminAvatar() && (__p += '\n  <div class="intercom-small-announcement-avatar-container">\n    <img src="' + (null == (__t = part.adminAvatar()) ? "" : _.escape(__t)) + '" class="intercom-small-announcement-avatar" />\n  </div>\n'), __p += '\n<div class="intercom-small-announcement">\n  <div class="intercom-small-announcement-body-container">\n    <div class=" intercom-small-announcement-body intercom-embed-body">\n      ' + (null == (__t = partBody) ? "" : __t) + '\n    </div>\n    <div class="intercom-attachments">\n      ', part.uploads.each(function(a) {
                __p += '\n        <div class="intercom-attachment">\n          <a href="' + (null == (__t = a.url()) ? "" : _.escape(__t)) + '" target="_blank">' + (null == (__t = a.name()) ? "" : _.escape(__t)) + "</a>\n        </div>\n      "
            }), __p += '\n    </div>\n    <div class="intercom-lwr-composer-container"></div>\n  </div>\n</div>\n';
        return __p
    }
}), define("templates/sticker-part", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-comment ' + (null == (__t = isAdminPart ? "intercom-sticker-admin-comment" : "intercom-sticker-user-comment") ? "" : _.escape(__t)) + '">\n  ', isAdminPart && adminAvatar && (__p += '\n    <img src="' + (null == (__t = adminAvatar) ? "" : _.escape(__t)) + '" class="intercom-comment-avatar">\n  '), __p += '\n  <div class="intercom-comment-body-container">\n    <div class="intercom-comment-body intercom-sticker-comment-body">\n      ', __p += nativeStickerSupport ? '\n        <div class="intercom-sticker-native" title="' + (null == (__t = stickerIdentifier) ? "" : _.escape(__t)) + '">\n          ' + (null == (__t = unicodeSticker) ? "" : _.escape(__t)) + "\n        </div>\n      " : '\n        <div title="' + (null == (__t = stickerIdentifier) ? "" : _.escape(__t)) + '">\n          <img alt="' + (null == (__t = stickerIdentifier) ? "" : _.escape(__t)) + '" src="' + (null == (__t = stickerUrl) ? "" : _.escape(__t)) + '" class="intercom-sticker-image" style="cursor:default;">\n        </div>\n      ', __p += '\n    </div>\n  </div>\n  <div class="intercom-comment-metadata-container">\n  </div>\n</div>\n';
        return __p
    }
}), define("templates/upload-part", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-comment intercom-comment-by-user intercom-upload-comment ', upload.isImage() && (__p += "intercom-upload-image"), __p += " " + (null == (__t = showSending ? "intercom-upload-is-uploading" : "") ? "" : _.escape(__t)) + '">\n  <div class="intercom-comment-body-container">\n    <div class="intercom-comment-body intercom-upload-body">\n      ', upload.isImage() ? (__p += "\n        ", __p += upload.hasDimensions() ? '\n          <img src="' + (null == (__t = upload.url()) ? "" : _.escape(__t)) + '" style="width: ' + (null == (__t = upload.width()) ? "" : _.escape(__t)) + "px; height: " + (null == (__t = upload.height()) ? "" : _.escape(__t)) + 'px;" alt="' + (null == (__t = upload.name()) ? "" : _.escape(__t)) + '">\n        ' : '\n          <img src="' + (null == (__t = upload.url()) ? "" : _.escape(__t)) + '" alt="' + (null == (__t = upload.name()) ? "" : _.escape(__t)) + '">\n        ', __p += "\n      ") : __p += '\n        <a href="' + (null == (__t = upload.url()) ? "" : _.escape(__t)) + '" target="_blank">' + (null == (__t = upload.name()) ? "" : _.escape(__t)) + "</a>\n      ", __p += '\n    </div>\n    <div class="intercom-comment-caret"></div>\n  </div>\n  <div class="intercom-comment-metadata-container">\n    <div class="intercom-comment-metadata">\n      <span class="intercom-comment-state">\n        ', showFailed && (__p += "\n          " + (null == (__t = t("failed")) ? "" : _.escape(__t)) + "\n        "), __p += "\n        ", showSending && (__p += "\n          " + (null == (__t = t("uploading")) ? "" : _.escape(__t)) + '\n          <div class="intercom-attachment-progress-bar">\n            <div class="intercom-attachment-progress-percentage"></div>\n          </div>\n          <span class="intercom-upload-remove"></span>\n        '), __p += "\n      </span>\n    </div>\n  </div>\n</div>\n";
        return __p
    }
}), define("templates/video-reply-part", [], function() {
    return function(obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with (obj || {})
            __p += '<div class="intercom-comment ' + (null == (__t = part.byUser() ? "intercom-comment-by-user" : "intercom-comment-by-admin") ? "" : _.escape(__t)) + '">\n  ', part.byAdmin() && part.adminAvatar() && (__p += '\n    <img src="' + (null == (__t = part.adminAvatar()) ? "" : _.escape(__t)) + '" class="intercom-comment-avatar">\n  '), __p += '\n  <div class="intercom-video-reply">\n    ' + (null == (__t = partBody) ? "" : __t) + '\n    <div class="intercom-video-reply-controls">\n      <div class="intercom-video-reply-controls-shading"></div>\n      <div class="intercom-video-reply-controls-bar">\n        <div class="intercom-video-reply-controls-playpausebutton"></div>\n        <div class="intercom-video-reply-controls-progressbar"></div>\n        <div class="intercom-video-reply-controls-mutebutton"></div>\n      </div>\n    </div>\n  </div>\n  <div class="intercom-comment-metadata-container">\n  </div>\n</div>\n';
        return __p
    }
}), define("throttler", function() {
    "use strict";
    function a(a, c) {
        this.options = b.defaults({}, c, {limit: f,delay: h}), this.client = a, this.updating = !1, this.queued = !1, this.count = 0
    }
    var b = require("underscore"), c = require("logger"), d = require("date"), e = require("features"), f = 10, g = 100, h = 18e5, i = 3e4;
    return a.prototype = {createOrUpdateUser: function() {
        return this.updating ? (c.info("throttler - An update is in progress"), void (this.queued = !0)) : (this.client.createOrUpdateUser().then(b.bind(function() {
            this.queued && b.defer(b.bind(this.createOrUpdateUser, this)), this.updatedAt = d.now(), this.count++, this.queued = this.updating = this.delayed = !1
        }, this)), void (this.updating = !0))
    },throttledCreateOrUpdateUser: function() {
        var a = this.getDelay();
        return 0 === a ? this.createOrUpdateUser() : (c.info("throttler - Update delayed for " + a + "ms"), void (this.delayed || (b.delay(b.bind(this.createOrUpdateUser, this), a), this.delayed = !0)))
    },getDelay: function() {
        var a = this.options.delay;
        return e.isEnabled("spa-throttling") && (a = i), this.isThrottled() ? b.max([this.updatedAt - d.now() + a, 0]) : 0
    },isThrottled: function() {
        var a = this.options.limit;
        return e.isEnabled("spa-throttling") && (a = g), this.count >= a
    },reset: function() {
        this.count = 0
    }}, a
}), define("time", ["exports", "i18n"], function(a, b) {
    "use strict";
    function c(a) {
        return "Invalid Date" !== a.toString()
    }
    var d = {s: 1e3,m: 60,h: 60,d: 24,w: 7};
    a.relativeTime = function(a) {
        var b = new Date, c = b - a;
        c = Math.max(0, c);
        var e = "s";
        for (var f in d) {
            if (c < d[f])
                break;
            e = f, c /= d[f]
        }
        return c = Math.floor(c), {unit: e,delta: c}
    }, a.relativeTimeInWords = function(d, e) {
        if (!c(d))
            return "";
        var f = a.relativeTime(d);
        return void 0 !== e && "s" === f.unit ? e : b.translate("X" + f.unit, {delta: f.delta})
    }
}), define("turbolinks", function() {
    "use strict";
    var a = require("jquery");
    return function(b) {
        a(document).on("page:change", function() {
            b.add()
        })
    }
}), define("upload", function() {
    "use strict";
    function a(a) {
        var b = d.Deferred(), c = new FileReader;
        return c.onload = e.bind(b.resolve, b, a), c.readAsDataURL(a.file), b
    }
    function b(a) {
        var b = d.Deferred();
        return a.save().then(e.bind(b.resolve, b, a)).fail(function() {
            a.trigger("upload:error"), b.reject(a)
        }), b
    }
    function c(a) {
        var b = d.Deferred(), c = new FormData;
        c.append("key", a.get("key")), c.append("acl", a.get("acl")), c.append("Content-Type", a.get("content_type")), c.append("AWSAccessKeyId", a.get("aws_access_key")), c.append("policy", a.get("policy")), c.append("signature", a.get("signature")), c.append("success_action_status", a.get("success_action_status")), c.append("file", a.file);
        var e = new XMLHttpRequest;
        return e.upload.addEventListener("progress", function(b) {
            b.lengthComputable && a.trigger("upload:progress", b.loaded, b.total)
        }, !1), e.addEventListener("error", function() {
            a.trigger("upload:error"), b.reject(a)
        }, !1), e.addEventListener("load", function() {
            a.trigger("upload:complete"), b.resolve(a)
        }, !1), e.addEventListener("abort", function() {
            a.trigger("upload:abort"), b.reject(a)
        }, !1), e.open("POST", a.get("upload_destination"), !0), e.send(c), b
    }
    var d = require("jquery"), e = require("underscore");
    return function(d) {
        return d.trigger("upload:start"), a(d).then(b).then(c)
    }
}), define("url-opener", ["underscore", "browser"], function(a, b) {
    "use strict";
    function c() {
        return b.features.uiwebview()
    }
    return {openUrlInNewWindowAndNullOpener: function(b) {
        if (!a.isEmpty(b)) {
            var c = window.open("");
            c.opener = null, c.document.write('<meta http-equiv="refresh" content="0; url=' + b + '">'), c.document.close()
        }
    },openUrlInNewWindow: function(a) {
        return c() ? !1 : (this.openUrlInNewWindowAndNullOpener(a), !0)
    },openLinkInNewWindow: function(b) {
        var c = b.data("via") || b.attr("href");
        return a.isUndefined(c) ? !1 : (b.attr("href", c), this.openUrlInNewWindow(c))
    }}
}), define("url", ["underscore", "exports"], function(a, b) {
    "use strict";
    b.parse = function(b) {
        var c = document.createElement("a");
        return c.href = b, a.pick(c, "protocol", "host", "port", "pathname", "hash", "search")
    }
}), define("user-metrics", function() {
    "use strict";
    var a = require("underscore"), b = require("metrics"), c = require("store"), d = require("json"), e = "tracked-events";
    return {initialize: function(a) {
        this.settings = a
    },trackEvent: function(a) {
        if (!this.isTrackedEvent(a)) {
            var f = this.getTrackedEvents();
            f.push(a), c.localStorage.set(e, d.stringify(f)), b.increment(a)
        }
    },trackSignedOutEvent: function(a) {
        this.settings && this.settings.get("user.anonymous") && this.trackEvent(a)
    },isTrackedEvent: function(b) {
        return a.indexOf(this.getTrackedEvents(), b) >= 0
    },getTrackedEvents: function() {
        return d.parse(c.localStorage.get(e) || "[]")
    }}
}), define("user-notifier", function() {
    "use strict";
    function a(a) {
        return "audio.notification." + a.id
    }
    function b(b) {
        return j.parse(i.localStorage.get(a(b)) || 0)
    }
    function c(b) {
        i.localStorage.set(a(b), b.get("updated_at"))
    }
    function d(a) {
        return b(a) === a.get("updated_at")
    }
    var e = require("audio"), f = require("date"), g = require("page-title"), h = require("i18n"), i = require("store"), j = require("json");
    return {enable: function() {
        this.enabled = !0
    },isEnabled: function() {
        return this.enabled
    },triggerNotification: function(a) {
        if (this.isEnabled() && !a.isRead()) {
            var b = a.parts.last();
            if (b && !b.byUser()) {
                var c, d = b.getAuthorFirstName();
                c = d ? h.translate("x-says", {firstName: d}) : h.translate("someone-says"), g.setNotification(c), this._playAudio(a)
            }
        }
    },triggerWelcomeNotification: function(a) {
        if (this.isEnabled()) {
            var b = "audio.notification.app-message", c = j.parse(i.localStorage.get(b) || 0);
            if (!c) {
                if (h.isLocaleEnglish()) {
                    var d = a + " says...";
                    g.setNotification(d)
                }
                i.localStorage.set(b, f.now()), e.playNotification()
            }
        }
    },_playAudio: function(a) {
        d(a) || (c(a), e.playNotification())
    }}
}), define("views/admin-avatar", function() {
    "use strict";
    var a = require("underscore"), b = require("backbone"), c = require("template"), d = require("initials");
    return b.View.extend({template: c.load("admin-avatar"),className: "intercom-admin-avatar",initialize: function(a) {
        this.avatarUri = a.avatarUri, this.adminFirstName = a.adminFirstName, this.adminFirstInitial = d.firstInitial(this.adminFirstName)
    },render: function() {
        return this.$el.html(this.template({avatarUri: this.avatarUri,adminFirstInitial: this.adminFirstInitial,adminFirstName: this.adminFirstName,hasAvatar: this.hasAvatar()})), this.$el.toggleClass("intercom-admin-fallback-avatar", !this.hasAvatar()), this
    },hasAvatar: function() {
        return !a.isEmpty(this.avatarUri) && this.avatarUri.indexOf("msg-user-icon-73") < 0
    },html: function() {
        return this.render().$el.prop("outerHTML")
    }})
}), define("views/animations/add-admin-part", ["jquery", "jquery-transit"], function() {
    "use strict";
    function a(a, b, c, d) {
        a.scrollToBottom(), a.$(".intercom-sheet-content").transition({y: b + "px",duration: 0}).transition({y: "0px",duration: 400,easing: "ease",complete: function() {
            c && d.$el.addClass("intercom-conversation-part-grouped-last")
        }})
    }
    function b(a, b) {
        a.$el.transition({y: "+=" + b + "px",duration: 0}).transition({y: "0px",duration: 400,easing: "snap",complete: function() {
            this.addClass("intercom-conversation-part-grouped-last")
        }}), a.$(".intercom-comment-metadata-container").transition({opacity: 0,duration: 0}).transition({opacity: 1,duration: 100})
    }
    function c(a, b, c) {
        return Math.min(a.getScrollPosition(), b.getHeight() - c)
    }
    function d(a, b, c) {
        if (!c)
            return 0;
        a.$(".intercom-comment-caret").remove(), a.$(".intercom-comment-avatar").transition({opacity: 0,duration: 200});
        var d = b.outerHeight(!0);
        return b.hasClass("intercom-conversation-part-grouped-last") ? b.removeClass("intercom-conversation-part-grouped-last").addClass("intercom-conversation-part-grouped") : b.addClass("intercom-conversation-part-grouped-first"), d - b.outerHeight(!0)
    }
    return function(e, f, g, h) {
        var i = e.$(".intercom-conversation-part:not(.intercom-is-typing):eq(-2)"), j = d(f, i, h), k = c(e, f, j), l = f.getHeight() - j;
        g && (k -= g.getHeight()), k > 0 ? (k = l > k ? k : l, a(e, k, h, f)) : h && b(f, j)
    }
}), define("views/animations/add-anonymous-form", ["jquery", "jquery-transit"], function() {
    "use strict";
    return function(a, b) {
        a.$el.hide().transition({opacity: 0,duration: 0}).delay(b + 1800).slideDown({duration: 400}).transition({opacity: 1,duration: 200})
    }
}), define("views/animations/add-is-typing", ["jquery", "jquery-transit"], function() {
    "use strict";
    function a(a, b, c) {
        a.$(".intercom-conversation-parts").transition({y: c + "px",duration: 0}).transition({y: "0px",duration: 100}), b.$(".intercom-comment-avatar").transition({opacity: 0,scale: 0,duration: 0}).transition({opacity: 100,scale: 1,duration: 100,delay: 100}), b.$(".intercom-comment-body-container").transition({scale: 0,opacity: 0,duration: 0}).transition({scale: 1,opacity: 100,duration: 100,delay: 200})
    }
    function b(a) {
        a.$(".intercom-comment-avatar").transition({opacity: 0,scale: 0,duration: 0}).transition({opacity: 100,scale: 1,duration: 100}), a.$(".intercom-comment-body-container").transition({scale: 0,opacity: 0,duration: 0}).transition({scale: 1,opacity: 100,duration: 100,delay: 100})
    }
    function c(a, b) {
        return Math.min(a.getScrollTop(), b.getHeight())
    }
    return function(d, e) {
        var f = c(d, e);
        f > 0 ? a(d, e, f) : b(e)
    }
}), define("views/animations/add-user-part", ["jquery", "jquery-transit"], function() {
    "use strict";
    function a(a, b, c) {
        a.scrollToBottom(), b.$el.transition({opacity: 0,duration: 0}).transition({opacity: 100,duration: 400}), a.$(".intercom-conversation-parts").transition({y: c + "px",duration: 0}).transition({y: "0px",duration: 400,easing: "ease"})
    }
    function b(a) {
        a.$el.transition({y: "100px",opacity: 0,duration: 0}).transition({opacity: 100,queue: !1,duration: 200}).transition({y: "0px",duration: 400,easing: "snap"})
    }
    function c(a, b, c) {
        return Math.min(a.getHeight() - a.$(".intercom-conversation-parts-container").outerHeight(!0) - a.$(".intercom-app-profile-container").outerHeight(!0), b.getHeight() - c)
    }
    return function(d, e, f) {
        var g = c(d, e, f), h = e.getHeight() - f;
        g > 0 ? b(e) : (g = Math.abs(g) < h ? Math.abs(g) : h, a(d, e, g, f))
    }
}), define("views/animations/bounce-composer", ["jquery", "jquery-transit"], function() {
    "use strict";
    return function(a) {
        var b = a.$(".intercom-composer");
        b.transition({y: -5,duration: 200}).transition({y: 0,easing: "ease",duration: 200})
    }
}), define("views/animations/hide-app-profile", ["jquery", "jquery-transit"], function() {
    "use strict";
    return function(a) {
        var b = a.$(".intercom-app-profile-container"), c = b.height();
        b.css({height: c,overflow: "hidden"}).transition({height: 0,duration: 400,complete: function() {
            b.empty().removeAttr("style")
        }})
    }
}), define("views/animations/hide-enter-to-send", ["jquery", "jquery-transit"], function() {
    "use strict";
    function a(a, b) {
        a.transition({opacity: 0,duration: 200,complete: function() {
            c(a)
        }}), b.transition({opacity: 0,duration: 0}).delay(200).transition({opacity: 1,duration: 200})
    }
    function b(a) {
        a.transition({height: 0,opacity: 0,duration: 200,complete: function() {
            c(a)
        }})
    }
    function c(a) {
        a.css({display: "none",height: "auto"})
    }
    return function(c) {
        var d = c.$(".intercom-composer-press-enter-to-send"), e = c.$(".intercom-powered-by");
        d.is(":hidden") || (e.length > 0 ? a(d, e) : b(d))
    }
}), define("views/animations/hovercard-to-new-message", ["jquery", "jquery-transit"], function() {
    "use strict";
    var a = require("navigation-events");
    return function(b, c) {
        //TODO
        console.log('navigation-events occur');
        
        var d = 300,
            e = b.closest("#intercom-launcher"),
            f = e.find(".intercom-launcher-button"),
            g = b.closest("#intercom-container"),
            h = g.find("#intercom-messenger"),
            i = b.find(".intercom-launcher-hovercard-textarea"),
            j = b.find(".intercom-launcher-hovercard-welcome"),
            k = window.innerHeight,
            l = c ? "+=19" : "-=3";

        console.log(a, b, c, d, e, f, g, h, i, j, k, l);
        //a: object
        //b: hovercard, c: true, d: 300, e:xx, f:
        
        a.trigger("click:new-conversation-no-animation");
        e.removeClass("intercom-launcher-inactive");
        
        var m = g.find(".intercom-sheet-body");
        m.css({boxShadow: "none"});

        j.transition({opacity: 0,marginBottom: "+=100",duration: 100});
        
        i.transition({paddingBottom: l,duration: d});
        
        b.css({border: "none",borderLeft: "1px solid #dadee2"}).transition({width: "+=1",duration: 0}).transition({width: 368,paddingTop: k,borderRadius: 0,right: -20,bottom: -19,duration: d});
        
        h.transition({opacity: 0,duration: 0}).delay(d).transition({opacity: 1,duration: 1000});
        h.children().transition({opacity: 0,duration: 0}).delay(d).transition({opacity: 1,duration: 200,complete: function() {
            e.removeAttr("style").addClass("intercom-launcher-inactive"), f.removeAttr("style"), h.removeAttr("style"), m.removeAttr("style"), h.children().removeAttr("style"), b.removeAttr("style").hide(), j.removeAttr("style"), i.removeAttr("style")
        }});
    }
}), define("views/animations/hovercard", ["exports", "jquery", "jquery-transit"], function(a) {
    "use strict";
    var b = "cubic-bezier(0.1, 0.0, 0.2, 1)";
    a.show = function(a) {
        a.stop().clearQueue().removeAttr("style"), a.show().css({transformOrigin: "315px 100%",x: 0,y: 0}).transition({opacity: 0,scale: .8,x: 0,y: 0,duration: 0}), a.transition({scale: 1,x: 0,y: 0,queue: !1}, 250, b), a.transition({opacity: 1,duration: 170})
    }, a.hide = function(a) {
        a.css({transformOrigin: "315px 100%"}).transition({scale: .8,x: 0,y: 0,opacity: 0,complete: function() {
            a.hide()
        }}, 90, b)
    }
}), define("views/animations/launcher-preview", ["exports", "jquery", "jquery-transit"], function(a) {
    "use strict";
    function b(a) {
        return a.$(".intercom-launcher-preview")
    }
    function c(a) {
        return a.$(".intercom-launcher-preview-close")
    }
    function d(a) {
        b(a).transition({x: "10px",opacity: 0,scale: .8,duration: 150,easing: "ease-in-out"}, function() {
            b(a).removeAttr("style"), a.hidePreview(), c(a).show()
        })
    }
    a.show = function(a, e) {
        e || c(a).hide(), b(a).css({animation: "none"}).transition({opacity: 0,x: "10px",delay: 1500,duration: 0,easing: "ease-in-out"}, function() {
            b(a).css({visibility: "visible",opacity: 0})
        }).transition({x: "-5px",scale: 1.05,duration: 150,easing: "ease-in-out"}).transition({opacity: 1,x: 0,scale: 1,duration: 150,easing: "ease-in-out"}, function() {
            b(a).css({transformOrigin: "right"}), e && a.playWelcomeNotification(), setTimeout(function() {
                e || d(a)
            }, 8e3)
        })
    }
}), define("views/animations/launcher", ["exports", "jquery", "jquery-transit"], function(a) {
    "use strict";
    function b(a) {
        return a.$(".intercom-launcher-button")
    }
    a.first = function(a) {
        b(a).transition({scale: 0,delay: 1e3}).transition({scale: 1.2,duration: 120,easing: "ease-out"}).transition({scale: 1,duration: 30,easing: "ease-out"})
    }, a.subsequent = function(a) {
        b(a).transition({opacity: 0,scale: .8,delay: 1e3,duration: 0}).transition({opacity: 1,scale: 1,duration: 150,easing: "ease-out"})
    }
}), define("views/animations/remove-auto-response", ["jquery", "jquery-transit"], function() {
    "use strict";
    function a(a) {
        return a.isAnonymousUserWithoutEmail() && a.hasAnonymousForm() && !a.isAutoResponseVisible() ? void 0 : a.isAnonymousUserWithoutEmail() && a.isAutoResponseVisible() ? a.$(".intercom-auto-response-text") : a.$el
    }
    return function(b) {
        var c = a(b);
        if (c) {
            var d = c.height();
            c.css({height: d}).transition({opacity: 0,height: 0,paddingTop: 0,paddingBottom: 0,marginTop: 0,marginBottom: 0,border: 0,duration: 400})
        }
    }
}), define("views/animations/remove-is-typing", ["jquery", "jquery-transit"], function() {
    "use strict";
    function a(a, b, c) {
        a.$(".intercom-conversation-parts").transition({y: -b + "px",duration: 0,delay: c}).transition({y: "0px",duration: c})
    }
    function b(a, b) {
        a.$el.transition({opacity: 0,duration: b})
    }
    function c(a, b) {
        return Math.min(a.getScrollTop(), b.getHeight())
    }
    var d = require("underscore");
    return function(e, f, g) {
        g = g || 100;
        var h = c(e, f);
        a(e, f, h, g), b(f, g), d.delay(d.bind(f.remove, f), g)
    }
}), define("views/animations/show-anonymous-email", ["jquery", "jquery-transit"], function() {
    "use strict";
    function a(a, b, c, d) {
        a.$el.transition({height: c + "px",scale: .95,duration: 0}).transition({height: d + "px",duration: 200}).transition({opacity: 1,scale: 1.05,duration: 100}).transition({scale: 1,duration: 100,complete: function() {
            b.isAutoResponseVisible() ? this.transition({opacity: 0,delay: 5e3,duration: 200}).slideUp() : this.transition({delay: 5e3,complete: function() {
                b.removeAutoResponse()
            }})
        }})
    }
    function b(a) {
        return a.$el.height()
    }
    return function(c, d) {
        c.$el.transition({opacity: 0,duration: 200,complete: function() {
            var e = b(c);
            c.render();
            var f = b(c);
            a(c, d, e, f)
        }})
    }
}), define("views/animations/show-composer", ["jquery", "jquery-transit"], function() {
    "use strict";
    return function(a) {
        var b = a.$(".intercom-composer"), c = b.outerHeight(!0);
        b.transition({y: c,duration: 0}).delay(200).transition({y: -5,easing: "ease",duration: 200}).transition({y: 0,easing: "ease",duration: 200})
    }
}), define("views/animations/show-email-collector-confirmation", ["jquery", "jquery-transit"], function() {
    "use strict";
    function a(a, b, c) {
        a.$el.transition({height: b,duration: 0}).transition({height: c,duration: 200,complete: function() {
            a.$el.height(c)
        }}), a.$el.children().transition({opacity: 0,duration: 0}).delay(200).transition({opacity: 1,duration: 200})
    }
    function b(a) {
        return a.$el.height()
    }
    var c = !1;
    return function(d) {
        d.$el.children().transition({opacity: 0,duration: 200,complete: function() {
            if (!c) {
                c = !0;
                var e = b(d);
                d.render();
                var f = b(d);
                a(d, e, f)
            }
        }})
    }
}), define("views/animations/show-enter-to-send", ["jquery", "jquery-transit"], function() {
    "use strict";
    function a(a, b) {
        b.transition({opacity: 0,duration: 200}), a.transition({opacity: 0,duration: 0}).delay(200).transition({opacity: 1,duration: 200})
    }
    function b(a) {
        a.transition({height: 0,opacity: 0,duration: 0}).transition({height: 16,opacity: 1,easing: "ease",duration: 200})
    }
    return function(c) {
        var d = c.$(".intercom-composer-press-enter-to-send"), e = c.$(".intercom-powered-by");
        d.is(":visible") || (d.css({display: "block"}), e.length > 0 ? a(d, e) : b(d))
    }
}), define("views/animations/show-visitor-auto-message-email-collector", ["jquery", "jquery-transit"], function() {
    "use strict";
    return function(a) {
        a.$el.transition({opacity: 0,duration: 0}).delay(400).transition({opacity: 1,duration: 200})
    }
}), define("views/animations/transition-conversation-header", ["jquery", "jquery-transit"], function() {
    "use strict";
    function a(a, b) {
        a.is(":visible") && !d && (d = !0, a.transition({opacity: 0,top: "-100%",duration: c,complete: function() {
            this.css({opacity: 1}).hide(), d = !1
        }}), b.show().css({opacity: 0}).transition({opacity: 1,top: 0,duration: c}))
    }
    function b(a, b) {
        a.is(":visible") || d || (d = !0, a.show().css({opacity: 0}).transition({opacity: 1,top: 0,duration: c}), b.transition({opacity: 0,top: "100%",duration: c,complete: function() {
            this.css({opacity: 1}).hide(), d = !1
        }}))
    }
    var c, d = !1;
    return function(c, d, e) {
        var f = c.$(".intercom-sheet-header-generic-title"), g = c.$(".intercom-sheet-header-title-container");
        e = e || 200, d ? b(f, g) : a(f, g)
    }
}), define("views/animations/zoomed-image", ["exports", "jquery-transit"], function(a) {
    "use strict";
    function b(a) {
        var b = a.$placeholder.width(), d = a.$placeholder.height(), e = a.$placeholder.offset();
        e.top -= c(document).scrollTop(), e.left -= c(document).scrollLeft();
        var f = b / a.width, g = e.left + b / 2 - (a.left + a.width / 2), h = e.top + d / 2 - (a.top + a.height / 2);
        return {x: g,y: h,scale: f}
    }
    var c = require("jquery"), d = require("underscore");
    a.show = function(a) {
        a.$el.transition(b(a), 100).transition({x: 0,y: 0,scale: 1}, 300, "ease")
    }, a.hide = function(a, c) {
        a.$el.transition(d.extend(b(a), {complete: c}), 300, "ease")
    }
}), define("views/app-hovercard", function() {
    "use strict";
    var a = require("underscore"), b = require("backbone"), c = require("template"), d = require("previewer"), e = require("emoji"), f = require("views/admin-avatar"), g = require("views/animations/hovercard"), h = require("views/animations/hovercard-to-new-message");
    return b.View.extend({template: c.load("app-hovercard"),className: "intercom-launcher-hovercard",initialize: function(a) {
        this.timeout = null, this.settings = a
    },render: function() {
        return this.$el.html(this.template({appName: this.settings.get("app.name")})).hide(), this.renderAdminAvatars(), this
    },renderAdminAvatars: function() {
        var b = this.$(".intercom-launcher-hovercard-admins").html(""), c = this.settings.get("app.active-admins");
        c && c.length > 0 && a.each(c, a.bind(function(a) {
            var c = {avatarUri: a.avatar.image_urls.square_128,adminFirstName: a.first_name};
            b.append(new f(c).html())
        }, this))
            },show: function() {
                this.isVisible() || this.settings.get("user.has-conversations") || (this.previewAppMessage(), this.$("textarea").val(""), g.show(this.$el))
            },hide: function() {
                this.isVisible() && g.hide(this.$el)
            },previewAppMessage: function() {
                var b = this.$el.find(".intercom-launcher-hovercard-welcome-text");
                b.is(":empty") && (b.html(e.maybeSubstituteWithSpans(d.preview(this.settings.get("app.message")), "intercom-emoji-sub-icon")), a.defer(a.bind(function() {
                    b.previewify({rows: 3})
                }, b)))
            },transitionToNewMessage: function() {
                h(this.$el, this.settings.get("app.branding-enabled"))
            },isVisible: function() {
                return this.$el.is(":visible")
            }})
}), define("views/app-profile", function() {
    "use strict";
    var a = require("underscore"), b = require("template"), c = require("user-metrics"), d = require("backbone"), e = require("views/last-active"), f = require("views/admin-avatar");
    return d.View.extend({template: b.load("app-profile"),adminTemplate: b.load("app-profile-admin"),className: "intercom-app-profile",events: {"click .intercom-active-admin-avatar": "onAppProfileAvatarClicked"},initialize: function(a) {
        this.settings = a.settings, this.app = a.app, this.lastActiveView = new e({model: this.app}), this.listenTo(this.app, "change", this.renderLastActive)
    },render: function() {
        var a = this.settings.get("app.active-admins"), b = this.settings.get("app.message"), c = this.settings.get("app.name");
        return a || b ? (this.$el.html(this.template({message: b,appName: c})), this.renderAdmins(), this.renderLastActive()) : this.$el.hide(), this
    },renderAdmins: function() {
        var b = this.settings.get("app.active-admins");
        b && 0 !== b.length ? (this.$(".intercom-active-admins").show(), a.each(b, a.bind(function(a) {
            var b = {avatarUri: a.avatar.image_urls.square_128,adminFirstName: a.first_name}, c = new f(b).html();
            this.$el.find(".intercom-active-admins").append(this.adminTemplate({adminAvatar: c,firstName: a.first_name}))
        }, this))) : this.$(".intercom-active-admins").hide()
    },renderLastActive: function() {
        this.$(".intercom-app-profile-last-active").html(this.lastActiveView.render().el)
    },hasAvatar: function(b) {
        return !a.isEmpty(b) && b.indexOf("msg-user-icon-73") < 0
    },onAppProfileAvatarClicked: function() {
        c.trackSignedOutEvent("uniqueVisitorClickedAvatarInWelcomePanel")
    }})
}), define("views/auto-response", function() {
    "use strict";
    var a = require("underscore"), b = require("backbone"), c = require("template"), d = require("views/new-anonymous-user"), e = require("views/animations/add-anonymous-form"), f = require("views/animations/remove-auto-response"), g = require("interblocks");
    return b.View.extend({template: c.load("auto-response"),className: "intercom-auto-response",initialize: function(a) {
        this.settings = a.settings, this.message = this.model.getMessage()
    },render: function(b) {
        var c = 200;
        if (b = a.defaults({}, b, {delay: 0}), this.$el.toggleClass("intercom-auto-response-active", this.isActive()), !this.isActive())
            return this;
        if (this.hasAutoResponse() && this.renderTemplate(), this.isAnonymousUserWithoutEmail()) {
            var f = new d({settings: this.settings,parentView: this,shouldShowReplyDelay: this.shouldShowReplyDelay()}).render();
            if (this.$el.append(f.$el), this.hasAutoResponse() && b.delay > 0) {
                var g = b.delay + c;
                e(f, g)
            }
        }
        return b.delay > 0 && this.$el.hide().delay(b.delay).fadeIn(c), this
    },shouldShowReplyDelay: function() {
        return this.model.replyDelayBodyBlockList().length > 0 && g.supportsBlockRendering(this.model.replyDelayBodyBlockList())
    },renderTemplate: function() {
        this.$el.html(this.template({medianResponseTimeEnabled: this.shouldShowReplyDelay(),medianResponseTimeBodyHTML: g.renderBlocks(this.model.replyDelayBodyBlockList()),customAutoResponseEnabled: this.settings.get("app.rtm-enabled"),customAutoResponse: this.settings.get("app.auto-response"),firstName: this.message.getAuthorFirstName(),haveEmail: !a.isEmpty(this.message.getAuthorEmail()),email: this.message.getAuthorEmail()}))
    },isActive: function() {
        return this.isAnonymousUserWithoutEmail() || this.hasAutoResponse()
    },hasAutoResponse: function() {
        return this.showStaticAutoResponse() || this.showCustomAutoResponse() || this.shouldShowReplyDelay()
    },isAutoResponseVisible: function() {
        return this.$(".intercom-auto-response-text").is(":visible")
    },hasAnonymousForm: function() {
        return this.$("input").is(":visible")
    },isAnonymousUserWithoutEmail: function() {
        return this.settings.get("user.anonymous") && a.isEmpty(this.message.getAuthorEmail())
    },showStaticAutoResponse: function() {
        return this.model.qualifiesForAutoResponse() && (!this.settings.get("app.rtm-enabled") || this.settings.get("app.rtm-enabled") && this.message.byAdmin())
    },showCustomAutoResponse: function() {
        return this.settings.get("app.rtm-enabled") && this.settings.has("app.auto-response") && this.model.qualifiesForAutoResponse()
    },removeAutoResponse: function() {
        f(this)
    }})
}), define("views/composer", function() {
    "use strict";
    function a(a) {
        a.stopPropagation()
    }
    var b = require("jquery"), c = require("underscore"), d = require("backbone"), e = require("browser"), f = require("draft-store"), g = require("user-metrics"), h = require("models/draft"), i = require("models/upload"), j = require("audio"), k = require("metrics"), l = require("collections/uploads"), m = require("views/emoji-selector"), n = require("template"), o = require("views/animations/show-enter-to-send"), p = require("views/animations/hide-enter-to-send");
    return d.View.extend({template: n.load("composer"),tagName: "form",id: "intercom-composer",className: "intercom-composer",attributes: {action: "",method: "POST"},events: {submit: "onSubmitted","keyup textarea": "onTextChanged","input textarea": "onTextChanged","focus textarea": "updateComposer","blur textarea": "onComposerBlur","keydown textarea": "onKeyDown","click .intercom-composer-upload-button": "onUploadButtonClicked","click .intercom-composer-emoji-button": "onEmojiButtonClicked","change input[type=file]": "onUploadsAdded"},initialize: function(a) {
        this.timeout = null, this.settings = a.settings, this.uploads = new l, this.isVisitorAutoMessage = !1, this.$(".intercom-composer-upload-error").hide(), this.emojiSelectorView = new m({onEmojiIconClickCallback: c.bind(this.insertEmoji, this)}), this.listenTo(this.uploads, "add", this.submitUpload)
    },render: function() {
        return this.$el.html(this.template()), this.$(".intercom-composer-emoji-selector-container").append(this.emojiSelectorView.render().el), this.$(".intercom-composer-emoji-button").toggle(this.isEmojiEnabled()), this.$(".intercom-composer-upload-button").toggle(this.isUploadingEnabled()), this.updateSubmit(), this
    },setConversationId: function(a) {
        this.conversationId = a;
        var b = f.loadDraft(this.conversationId);
        c.isUndefined(b) || this.setText(b.getText())
    },setVisitorAutoMessage: function(a) {
        this.isVisitorAutoMessage = a
    },insertEmoji: function(a) {
        0 === this.getText().length ? (this.setText(a), this.$el.submit()) : (this._insertTextAtCursor(a), this.saveDraft(), this.focus())
    },enable: function() {
        return this.$("textarea, input").prop("disabled", ""), this.$("input[type=submit]").css("visibility", "inherit"), this.$el.removeClass("intercom-composer-disabled"), this.updateSubmit(), this
    },disable: function() {
        return this.$("textarea, input").prop("disabled", "disabled"), this.$("input[type=submit]").css("visibility", "hidden"), this.$el.addClass("intercom-composer-disabled"), this
    },reset: function() {
        return this.uploads.reset(), this.$("textarea").val(""), this.$("pre span").empty(), this.updateComposer(), this.conversationId = null, this
    },focus: function() {
        return this.$("textarea").focus(), this
    },blur: function() {
        return this.$("textarea").blur(), this
    },isEmojiEnabled: function() {
        return !e.features.ie8() && !e.features.touchScreen() && void 0 !== this.settings
    },isUploadingEnabled: function() {
        return !e.features.touchScreen() && e.features.upload() && void 0 !== this.settings && !this.settings.get("user.anonymous")
    },isSubmitButtonEnabled: function() {
        return !this.$("input[type=submit]").prop("disabled")
    },isFocused: function() {
        return this.$("textarea").is(":focus")
    },hide: function() {
        return this.$el.addClass("intercom-composer-inactive"), this
    },show: function() {
        return this.$el.removeClass("intercom-composer-inactive"), this
    },updatePosition: function() {
        var a = 0;
        this.$el.hasClass("intercom-composer-inactive") || (a = this.$el.closest(".intercom-composer").outerHeight(!0)), this.$el.closest(".intercom-conversation").find(".intercom-sheet-content").css({bottom: a})
    },updateSubmit: function() {
        var a = b.trim(this.getText()), d = c.isEmpty(a);
        this.$("input[type=submit]").prop("disabled", d), e.features.touchScreen() && (this.$("input[type=submit]").show(), this.$("textarea").css("font-size", "20px"))
    },hasAnyUploads: function() {
        return this.uploads.length > 0
    },saveDraft: function() {
        var a = new h(this.getText());
        a.isEmpty() ? f.removeDraft(this.conversationId) : f.saveDraft(a, this.conversationId)
    },scrollIntoView: function() {
        var a = this.$el.closest(".intercom-sheet-content");
        a.scrollTop(a.prop("scrollHeight"))
    },setPlaceholder: function(a) {
        var c = b("<div/>").html(a).text();
        this.$("textarea").attr("placeholder") !== c && this.$("textarea").attr({placeholder: c})
    },getText: function() {
        return this.$("textarea").val()
    },setText: function(a) {
        c.isString(a) && (this.$("textarea").val(a), this.updateComposer())
    },clearText: function() {
        this.$("textarea").val(""), this.$("pre span").empty(), this.updateComposer()
    },updateComposer: function() {
        this.$("pre span").text(this.getText()), this.updatePosition(), this.scrollIntoView(), this.updateSubmit(), this.$(".intercom-composer-textarea").addClass("intercom-composer-focused")
    },onComposerBlur: function() {
        this.$(".intercom-composer-textarea").removeClass("intercom-composer-focused")
    },onTextChanged: function(a) {
        a.stopPropagation(), this.updateComposer(), this.saveDraft(), this.eventShouldTriggerUserIsTyping(a) && (this.trigger("userIsTyping"), b(document).trigger(b.Event("intercom.keyup")))
    },queueEnterToSendAnimation: function() {
        e.features.touchScreen() || (this.resetEnterToSendTimeout(), c.isEmpty(this.getText()) ? this.hideEnterToSend() : this.timeout = setTimeout(c.bind(this.showEnterToSendAnimation, this), 2e3))
    },showEnterToSendAnimation: function() {
        o(this)
    },eventShouldTriggerUserIsTyping: function(a) {
        if ("input" === a.type)
            return !0;
        if (!a.originalEvent)
            return !0;
        var b = a.originalEvent.keyCode;
        return b > 46 && 91 > b || b > 145 || 32 === b ? !0 : !1
    },submitUpload: function() {
        var a = this.getText();
        this.clearText(), this.$el.submit(), this.setText(a)
    },onSubmitted: function(a) {
        a.preventDefault(), this.hideEmojiSelector();
        var b = this.getText();
        f.removeDraft(this.conversationId), (!c.isEmpty(b) || this.hasAnyUploads()) && (this.trigger("submit", b, this.uploads.clone()), this.resetUploads(), j.playSubmit(), e.features.touchScreen() && this.blur(), this._trackMessageSent(), this.hideEnterToSend())
    },resetEnterToSendTimeout: function() {
        clearTimeout(this.timeout)
    },hideEnterToSend: function() {
        this.resetEnterToSendTimeout(), p(this)
    },resetEnterToSend: function() {
        this.$(".intercom-composer-press-enter-to-send").css({height: "auto",display: "none"}), this.$(".intercom-powered-by").css({opacity: 1})
    },submitKeyPressed: function(a) {
        return 13 !== a.keyCode || a.altKey || a.shiftKey ? !1 : (a.preventDefault(), !0)
    },onKeyDown: function(a) {
        this.submitKeyPressed(a) && this.isSubmitButtonEnabled() && this.$el.submit(), this._trackComposerTyping(), a.stopPropagation()
    },onUploadButtonClicked: function() {
        this.$("input[type=file]").click()
    },onUploadError: function() {
        this.$(".intercom-composer-upload-error").show(), this.updateComposer()
    },showEmojiSelector: function() {
        this.$(".intercom-emoji-selector").on("click", a), this.$(".intercom-emoji-selector").show(), b(".intercom-conversation.intercom-sheet-active").on("click.hideEmojiSelector", c.bind(this.hideEmojiSelector, this)), this.$(".intercom-composer-emoji-button").addClass("intercom-composer-emoji-button-active"), this.focus()
    },hideEmojiSelector: function() {
        this.$(".intercom-emoji-selector").off("click", a), this.$(".intercom-emoji-selector").hide(), b(".intercom-conversation.intercom-sheet-active").off("click.hideEmojiSelector"), this.$(".intercom-composer-emoji-button").removeClass("intercom-composer-emoji-button-active")
    },onEmojiButtonClicked: function(a) {
        a.stopPropagation(), this.$(".intercom-emoji-selector").is(":visible") ? this.hideEmojiSelector() : this.showEmojiSelector()
    },getFiles: function() {
        return this.$("input[type=file]")[0].files
    },onUploadsAdded: function() {
        var a = this.getFiles();
        c.each(a, c.bind(function(a) {
            var b = i.fromFile(a);
            b.isTooBig() ? (k.increment("uploadTooBig"), this.onUploadError()) : b.isImage() ? this.previewAndAddUpload(b) : this.uploads.add(b)
        }, this))
            },previewAndAddUpload: function(a) {
                if (e.features.upload()) {
                    var b = new FileReader, d = new Image;
                    b.onload = c.bind(function(b) {
                        d.src = b.target.result, d.onload = c.bind(function() {
                            a.set({imageData: b.target.result,width: d.width,height: d.height}), this.uploads.add(a)
                        }, this)
                    }, this), b.readAsDataURL(a.file)
                } else
                    this.uploads.add(a)
            },resetUploads: function() {
                var a = this.$("input[type=file]");
                this.$(".intercom-composer-upload-error").hide(), a.replaceWith(a.val("").clone(!0)), this.uploads.reset()
            },metricsPrefix: function() {
                return this.conversationId || this.isVisitorAutoMessage ? this.isVisitorAutoMessage ? "inReplyToVisitorAutoMessage." : void 0 : "fromNewConversationView."
            },_getCursorPosition: function() {
                return this.$("textarea")[0].selectionStart
            },_setCursorPosition: function(a) {
                this.$("textArea")[0].setSelectionRange(a, a)
            },_insertTextAtCursor: function(a) {
                var b = this.$("textarea"), c = this._getCursorPosition(), d = b.val(), e = d.slice(0, c), f = d.slice(c);
                this.setText(e + a + f), this._setCursorPosition(c + a.length)
            },_trackComposerTyping: function() {
                (!this.conversationId || this.isVisitorAutoMessage) && g.trackSignedOutEvent(this.metricsPrefix() + "uniqueVisitorTypedInComposer")
            },_trackMessageSent: function() {
                (!this.conversationId || this.isVisitorAutoMessage) && g.trackSignedOutEvent(this.metricsPrefix() + "uniqueVisitorSentMessage")
            }})
}), define("views/conversation-item", function() {
    "use strict";
    var a = require("backbone"), b = require("navigation-events"), c = require("views/relative-time"), d = require("metrics"), e = require("previewer"), f = require("template"), g = require("emoji");
    return a.View.extend({template: f.load("conversation-item"),className: "intercom-conversations-item",events: {click: "onClicked"},initialize: function() {
        this.listenTo(this.model, "change", this.render), this.listenTo(this.model.parts, "add", this.render)
    },getPreview: function() {
        return e.isMetadataPreview(this.model.preview()) ? e.preview(this.model.preview()) : g.maybeSubstituteWithSpans(this.model.previewText(), "intercom-emoji-sub-icon")
    },render: function() {
        return this.$el.html(this.template({conversation: this.model,preview: this.getPreview()})).toggleClass("intercom-conversations-item-unread", this.model.isUnread()), this.$(".intercom-conversations-item-summary").toggleClass("intercom-conversations-item-summary-metadata", e.isMetadataPreview(this.model.preview())), this.$(".intercom-conversations-item-timestamp").append((new c).render(this.model.updatedAt()).el), this
    },onClicked: function(a) {
        a.preventDefault(), b.trigger("click:conversation", this.model), d.increment("conversationInInboxClicked")
    }})
}), define("views/conversation", function() {
    "use strict";
    var a = require("underscore"), b = require("i18n"), c = require("browser"), d = require("initials"), e = require("activity-monitor"), f = require("audio"), g = require("date"), h = require("metrics"), i = require("user-metrics"), j = require("rtm-latency-monitor"), k = require("visibility"), l = require("template"), m = require("state-store"), n = require("models/user"), o = require("models/part"), p = require("models/conversation"), q = require("views/sheet"), r = require("views/part"), s = require("views/composer"), t = require("views/unread-counter"), u = require("views/app-profile"), v = require("views/powered-by"), w = require("views/auto-response"), x = require("views/visitor-auto-message-email-collector"), y = require("views/is-typing"), z = require("views/last-active"), A = require("views/animations/add-user-part"), B = require("views/animations/add-admin-part"), C = require("views/animations/add-is-typing"), D = require("views/animations/hide-app-profile"), E = require("views/animations/show-composer"), F = require("views/animations/show-visitor-auto-message-email-collector"), G = require("views/animations/bounce-composer"), H = require("views/animations/remove-is-typing"), I = require("views/animations/remove-auto-response"), J = require("views/animations/transition-conversation-header");
    return q.extend({template: l.load("conversation"),titleTemplate: l.load("conversation-title"),id: "intercom-conversation",className: "intercom-conversation intercom-sheet",events: a.extend(q.prototype.events, {mousemove: "onMouseMovedOrClicked",click: "onMouseMovedOrClicked","click .intercom-active-admin-avatar": "onAppProfileAvatarClicked"}),initialize: function(a) {
        q.prototype.initialize.apply(this, arguments), this.app = a.app, this.client = a.client, this.nexusClient = a.nexusClient, this.composerView = new s(a), this.counterView = new t({collection: this.collection}), this.poweredByView = new v({settings: this.settings}), this.appProfileView = new u({settings: this.settings,app: this.app}), this.lastActiveView = new z({model: this.app}), this.listenTo(this.composerView, "submit", this.onComposerSubmitted), this.listenTo(this.composerView, "userIsTyping", this.onComposerIsTyping), this.listenTo(this.app, "change", this.onTeamLastSeenChange)
    },render: function() {
        return this.$el.html(this.template()), this.$el.addClass("intercom-emoji-support"), this.renderComposer(), this.renderPoweredBy(), this.counterView.setElement(this.$(".intercom-unread-counter")).render(), this
    },renderNewConversation: function(c) {
        this.model && this.stopListening(this.model.parts), this.model = void 0, this.renderAppProfile(), this.renderTitle(), this.renderTeamLastActive(), this.composerView.show().reset().setPlaceholder(b.translate("new-conversation-placeholder")), this.focusComposerIfAppropriate(), this.composerView.setConversationId(), this.composerView.resetEnterToSend(), c !== !1 && this.showComposerWithAnimation(), this.$(".intercom-sheet-content").on("scroll", a.bind(this.onConversationScroll, this)), i.trackSignedOutEvent("uniqueVisitorOpenedNewConversation")
    },renderConversation: function(c, d) {
        this.model && this.stopListening(this.model.parts), this.stopListening(this.app), this.model = c, this.renderTitle(), this.renderAdminLastActive(), this.composerView.hide().reset().setPlaceholder(b.translate("new-comment-placeholder")), this.$el.addClass("intercom-sheet-loading"), this.$el.toggleClass("intercom-conversation-preview", d.autoOpen && this.model.isSmallAnnouncement()), this.$el.toggleClass(["intercom-conversation-announcement", "intercom-sheet-maximized"].join(" "), this.model.isAnnouncement()), j.invalidateLatencyData(), this.model.fetch().then(a.bind(function() {
            this.isVisitorAutoMessage() && i.trackSignedOutEvent("uniqueVisitorOpenedVisitorAutoMessage"), this.listenTo(this.model.parts, "add", this.onPartAdded), this.listenTo(this.model.parts, "change", this.onPartChange), this.composerView.setConversationId(this.model.id), this.composerView.setVisitorAutoMessage(this.isVisitorAutoMessage()), this.composerView.resetEnterToSend(), this.renderAdminLastActive(), this.setComposerVisibility(), this.renderAppProfile(), this.renderParts(), this.renderAutoResponse(), this.focusComposerIfAppropriate(), this.showComposerWithAnimation(), this.model.partsCount() > 1 && this.scrollToBottom(), this.renderTitle(), this._maybeShowEmailCollector(), this.$el.removeClass("intercom-sheet-loading"), this.$(".intercom-sheet-content").on("scroll", a.bind(this.onConversationScroll, this))
        }, this))
    },renderParts: function() {
        this.model.parts.nonLwrResponses().each(function(a) {
            var b = new r({model: a,conversation: this.model});
            this.groupParts(a, b), this.$(".intercom-conversation-parts").append(b.render().el)
        }, this), this.model.partsCount() > 1 && this.$el.removeClass("intercom-conversation-preview"), this.model.isUnread() && this.$(".intercom-conversation-part:last").addClass("intercom-conversation-part-unread"), this.markConversationAsRead()
    },groupParts: function(a, b) {
        var c = this.$(".intercom-conversation-part:not(.intercom-is-typing):last"), d = c.outerHeight(!0);
        return !this.isGroupedWithPreviousPart(a) && this.isGroupedWithNextPart(a) ? this.group(b.$el, "first") : this.isGroupedWithPreviousPart(a) && !this.isGroupedWithNextPart(a) ? (this.group(b.$el, "last"), c.hasClass("intercom-conversation-part-grouped-last") ? this.group(c, "middle") : c.hasClass("intercom-conversation-part-grouped") || this.group(c, "first")) : this.isGroupedWithPreviousPart(a) && this.group(b.$el, "middle"), (this.autoResponseIsActive() || this.emailCollectorIsActive()) && this.regroupComments(), d - c.outerHeight(!0)
    },regroupComments: function() {
        var a = this.domPart(0), b = this.domPart(1), c = this.domPart(2), d = this.isGroupedWithNextPart(this.model.parts.at(0)), e = this.model.parts.at(1) && this.isGroupedWithNextPart(this.model.parts.at(1)), f = this.model.parts.at(2) && this.isGroupedWithNextPart(this.model.parts.at(2));
        this.autoResponseIsActive() ? (this.removeGroupingClasses(a), this.removeGroupingClasses(b), e && this.group(b, "first")) : this.emailCollectorIsActive() ? (this.removeGroupingClasses(b), this.removeGroupingClasses(c), f && this.group(c, "first")) : (a.toggleClass("intercom-conversation-part-grouped-first", d), e && this.group(b, "middle"))
    },group: function(a, b) {
        return "first" === b ? this.removeGroupingClasses(a).addClass("intercom-conversation-part-grouped-first") : "middle" === b ? this.removeGroupingClasses(a).addClass("intercom-conversation-part-grouped") : "last" === b ? this.removeGroupingClasses(a).addClass("intercom-conversation-part-grouped-last") : void 0
    },domPart: function(a) {
        return this.$(".intercom-conversation-part:eq(" + a + ")")
    },removeGroupingClasses: function(b) {
        return b.removeClass(function(b, c) {
            return a.filter(c.split(" "), function(a) {
                return a.indexOf("grouped") >= 0
            }).join(" ")
        })
    },showComposerWithAnimation: function() {
        E(this)
    },scrollToBottom: function() {
        this.setScrollTop(this.getScrollHeight())
    },autoResponseIsActive: function() {
        return this.autoResponseView && this.autoResponseView.isActive()
    },emailCollectorIsActive: function() {
        return this.visitorAutoMessageEmailCollectorView && this.visitorAutoMessageEmailCollectorView.isActive()
    },renderAppProfile: function() {
        this.model && (this.model.hasAdminComment() || this.model.getMessage().byAdmin()) || this.$(".intercom-app-profile-container").show().html(this.appProfileView.render().el)
    },hideAppProfile: function() {
        D(this)
    },renderTitle: function() {
        var a = this.model ? this.titleTemplate({appName: this.settings.get("app.name"),adminFirstName: this.model.lastAdminFirstName(),adminName: this.model.lastAdminName()}) : this.settings.get("app.name");
        this.$(".intercom-sheet-header-title").html(a), this.setGenericTitle()
    },setGenericTitle: function() {
        this.model && 0 !== this.model.parts.byAdmin().size() ? this.resetTitle() : (this.$(".intercom-sheet-header-generic-title").html(b.translate("new-message")), (!this.model || this.appProfileNameIsVisible()) && this.$(".intercom-sheet-header").addClass("intercom-sheet-header-show-generic"))
    },renderAdminLastActive: function() {
        this.$(".intercom-sheet-header-title").toggleClass("intercom-sheet-header-with-presence", this.hasLastActiveAdminTimestamp()), this.$(".intercom-sheet-header-title-container").append(this.lastActiveView.render({last_active: this.getLastActiveTimestamp()}).el)
    },renderTeamLastActive: function() {
        this.$(".intercom-sheet-header-title").toggleClass("intercom-sheet-header-with-presence", this.hasLastActiveTeamTimestamp()), this.$(".intercom-sheet-header-title-container").append(this.lastActiveView.render().el)
    },hasLastActiveTeamTimestamp: function() {
        return void 0 !== this.app.get("last_active")
    },hasLastActiveAdminTimestamp: function() {
        return void 0 !== this.model && void 0 !== this.model.lastAdmin() && void 0 !== this.model.lastAdminActiveTimestamp()
    },getLastActiveTimestamp: function() {
        return this.hasLastActiveAdminTimestamp() ? this.model.lastAdminActiveTimestamp() : void 0
    },renderComposer: function() {
        this.$(".intercom-composer-container").append(this.composerView.render().el)
    },renderPoweredBy: function() {
        if (this.settings.get("app.branding-enabled")) {
            var a = this.model && this.model.getMessage().byAdmin(), b = a ? "outbound" : "inbound";
            this.$(".intercom-composer").append(this.poweredByView.render({trackingType: b}).el), this.$el.addClass("intercom-powered-by-enabled")
        }
    },renderAutoResponse: function(a) {
        var b = new w({model: this.model,settings: this.settings});
        b.isActive() && (this.$(".intercom-conversation-part:first").after(b.render(a).$el), this.autoResponseView = b, this.regroupComments())
    },addIsTypingWithAnimation: function(b, c) {
        if (void 0 === this.isTypingView) {
            var d = new y;
            this.$(".intercom-conversation-parts").append(d.render({adminAvatar: b,adminInitials: c}).$el), this.scrollToBottom(), C(this, d), this.isTypingTimeout = setTimeout(a.bind(function() {
                this.removeIsTypingWithAnimation()
            }, this), 2e4), this.isTypingView = d
        }
    },removeIsTypingWithAnimation: function() {
        void 0 !== this.isTypingView && (H(this, this.isTypingView), this.isTypingView = void 0, clearTimeout(this.isTypingTimeout))
    },removeIsTyping: function() {
        void 0 !== this.isTypingView && (this.isTypingView.remove(), this.isTypingView = void 0, clearTimeout(this.isTypingTimeout))
    },removeAutoResponse: function() {
        void 0 !== this.autoResponseView && (I(this.autoResponseView), this.autoResponseView.isAnonymousUserWithoutEmail() || (this.autoResponseView = void 0, this.regroupComments()))
    },addUserPartWithAnimation: function(a) {
        var b = new r({model: a,conversation: this.model}), c = this.groupParts(a, b);
        return this.$(".intercom-conversation-parts").append(b.render().$el), this.composerView.reset(), A(this, b, c), this._maybeShowEmailCollector(!0), b
    },addAdminPartWithAnimation: function(a) {
        var b = new r({model: a,conversation: this.model});
        return this.$(".intercom-conversation-parts").append(b.render().$el), a === this.model.parts.last() ? B(this, b, this.isTypingView, this.isGroupedWithPreviousPart(a)) : this.groupParts(a, b), this.renderTitle(), this.scrollToBottom(), this.removeIsTyping({animate: !1}), this.removeAutoResponse(), this.hideAppProfile(), this.model.isUnread() && b.setUnread(), this.markConversationAsRead(), b
    },markConversationAsRead: function() {
        k.isPageVisible() && e.isActive() ? this.markActiveConversationAsRead() : this.markConversationAsReadWhenActive()
    },markConversationAsReadWhenActive: function() {
        var b = a.once(a.bind(this.markActiveConversationAsRead, this));
        e.onActive(b), k.onVisible(b)
    },markActiveConversationAsRead: function() {
        this.shouldMarkConversationAsRead() && (this.model.markAsRead(), this.nexusClient.onConversationSeen(this.model.id), setTimeout(a.bind(function() {
            this.$(".intercom-conversation-part").removeClass("intercom-conversation-part-unread")
        }, this), 3e3))
    },shouldMarkConversationAsRead: function() {
        return this.isActive() && !this.isMinimized() && this.model && this.model.isUnread()
    },focusComposerIfAppropriate: function() {
        this.model && 1 === this.model.parts.nonLwrResponses().size() || c.features.touchScreen() || this.composerView.focus()
    },createComment: function(b) {
        var c = h.timer("createComment");
        this.model.addPart(b);
        var d = this.model.parts, e = this.addUserPartWithAnimation(b), g = function() {
            f.playDelivered(), c.resolve()
        }, i = a.throttle(function() {
            h.increment("saveCommentFailed"), c.fail(), f.playFailed(), e.renderFailed()
        }, 1e3, {leading: !1}), j = function() {
            d.get(b) && b.save().then(g).fail(i)
        };
        e.on("retry", j), b.isUpload() ? e.on("part:save", j) : j()
    },createConversation: function(c) {
        var d = h.timer("createConversation");
        this.model = c, this.listenTo(this.model.parts, "add", this.onPartAdded), this.collection.add(this.model);
        var e = c.getMessage(), g = this.addUserPartWithAnimation(e);
        this.composerView.reset().disable().setPlaceholder(b.translate("new-comment-placeholder"));
        var i = a.bind(function() {
            f.playDelivered(), this.renderAutoResponse({delay: 1e3}), this.composerView.enable().setConversationId(this.model.id), this.focusComposerIfAppropriate(), n.fromSettings(this.settings).fetchRealtimeSettingsIfMissing(), m.save({view: "conversation-" + this.model.id}), d.resolve()
        }, this), j = a.throttle(function() {
            d.fail(), h.increment("saveConversationFailed"), f.playFailed(), g.renderFailed()
        }, 1e3, {leading: !1}), k = function() {
            c.save().then(i).fail(j)
        };
        g.on("retry", k), e.isUpload() ? g.on("part:save", k) : k()
    },setComposerVisibility: function() {
        var a = this.model.getMessage().isLwrMessage() && 1 === this.model.parts.nonLwrResponses().size();
        a ? this.composerView.hide() : this.composerView.show(), this.composerView.updatePosition()
    },reset: function() {
        this.model && this.stopListening(this.model.parts), this.resetTitle(), this.$(".intercom-sheet-content").off("scroll"), this.$(".intercom-conversation-parts").empty(), this.$(".intercom-app-profile-container").empty().hide(), this.composerView.blur().reset()
    },resetTitle: function() {
        this.$(".intercom-sheet-header-generic-title").removeAttr("style"), this.$(".intercom-sheet-header-title-container").removeAttr("style"), this.$(".intercom-sheet-header").removeClass("intercom-sheet-header-show-generic")
    },isPreview: function() {
        return this.$el.hasClass("intercom-conversation-preview")
    },didHide: function() {
        this.reset()
    },didMaximize: function() {
        this.markConversationAsRead()
    },_maybeUpdateLastActive: function() {
        var a = g.now();
        this.app.set("last_active", parseInt(a / 1e3, 10)), this.model.updateLastAdminActiveTimestamp(parseInt(a / 1e3, 10)), this.renderAdminLastActive()
    },_maybeShowEmailCollector: function(a) {
        this.shouldShowAnonymousEmailCollector() && (this.visitorAutoMessageEmailCollectorView = new x({parentView: this,settings: this.settings}), this.visitorAutoMessageEmailCollectorView.render(), this.visitorAutoMessageEmailCollectorView.insertIntoParentView(), this.regroupComments(), a === !0 && F(this.visitorAutoMessageEmailCollectorView))
    },onTeamLastSeenChange: function() {
        this.renderTeamLastActive()
    },onPartAdded: function(a) {
        a.byAdmin() && (this.nexusClient.onConversationReceived(this.model.id), this._maybeUpdateLastActive(), this.addAdminPartWithAnimation(a))
    },onPartChange: function(a) {
        a.byUser() && a.changed.seen_by_admin === a.SEEN && this._maybeUpdateLastActive()
    },previousPart: function(a) {
        return this.model.parts.at(this.model.parts.indexOf(a) - 1)
    },nextPart: function(a) {
        return this.model.parts.at(this.model.parts.indexOf(a) + 1)
    },hasPreviousPart: function(b) {
        return !a.isUndefined(this.previousPart(b))
    },hasNextPart: function(b) {
        return !a.isUndefined(this.nextPart(b))
    },isGroupedWithPreviousPart: function(a) {
        return this.hasPreviousPart(a) && this.isGroupedWithNextPart(this.previousPart(a)) && this.isGroupedWithPart(this.previousPart(a), a)
    },isGroupedWithNextPart: function(a) {
        return this.hasNextPart(a) && this.isGroupedWithPart(a, this.nextPart(a))
    },isGroupedWithPart: function(a, b) {
        if (b.isNew() && a.isNew())
            return b.byUser() && a.byUser();
        if (b.isNew()) {
            var c = parseInt(g.now() / 1e3, 10), d = b.byUser() && a.byUser(), e = !b.byUser() && b.getAuthorEmail() === a.getAuthorEmail();
            return Math.abs(c - a.get("created_at")) <= 60 && (d || e)
        }
        return !a.isNew() && b.getAuthorEmail() === a.getAuthorEmail() && b.byUser() === a.byUser() && b.get("created_at") - a.get("created_at") <= 60
    },onAdminIsTyping: function(a) {
        if (this.model && this.model.id === a.eventData.conversationId) {
            var b = d.firstInitial(a.eventData.adminName), c = a.eventData.adminAvatar;
            c.indexOf("/assets/msg-user-icon-73") >= 0 && (c = null), this.addIsTypingWithAnimation(c, b)
        }
    },createMessageOrComment: function(a, b) {
        this.model ? this.createComment(o.fromBodyAndUploads(a, b, this.model)) : this.createConversation(p.fromBodyAndUploads(a, b))
    },scrollHeaderIfRequired: function() {
        this.$(".intercom-app-profile-team-and-activity").is(":visible") && J(this, this.appProfileNameIsVisible())
    },appProfileNameIsVisible: function() {
        if (!this.$(".intercom-app-profile-team-and-activity").is(":visible"))
            return !1;
        var a = this.getScrollTop(), b = this.$(".intercom-app-profile-team-and-activity").position().top + this.$(".intercom-app-profile-team-and-activity").outerHeight();
        return b > a
    },onComposerSubmitted: function(b, c) {
        c.isEmpty() ? this.createMessageOrComment(b, []) : c.each(a.bind(function(a) {
            this.createMessageOrComment(b, a)
        }, this))
            },isVisitorAutoMessage: function() {
                return this.model && this.model.parts.first().byAdmin() ? this.model.parts.first().isChatAutoMessage() && this.settings.get("user.anonymous") : !1
            },shouldShowAnonymousEmailCollector: function() {
                return this.isVisitorAutoMessage() && this.model.hasUserComment() && (!this.visitorAutoMessageEmailCollectorView || !this.visitorAutoMessageEmailCollectorView.isActive()) && a.isEmpty(this.settings.get("user.anonymous-email"))
            },onComposerIsTyping: a.throttle(function() {
                this.model && this.model.hasUserComment() || this.composerView.queueEnterToSendAnimation(), this.model && this.settings.get("app.rtm-enabled") && this.nexusClient.postEvent("UserIsTyping", {conversationId: this.model.id})
            }, 1e3),onMouseMovedOrClicked: a.throttle(function() {
                this.model && this.model.isSmallAnnouncement() && this.isPreview() && this.$el.removeClass("intercom-conversation-preview")
            }, 100),onAppProfileAvatarClicked: a.throttle(function() {
                G(this)
            }, 1e3),onConversationScroll: a.throttle(function() {
                this.scrollHeaderIfRequired()
            }, 100)})
}), define("views/conversations", function() {
    "use strict";
    var a = require("jquery"), b = require("underscore"), c = require("navigation-events"), d = require("views/sheet"), e = require("views/conversation-item"), f = require("template"), g = require("metrics");
    return d.extend({template: f.load("conversations"),id: "intercom-conversations",className: "intercom-conversations intercom-sheet",events: b.extend(d.prototype.events, {"click .intercom-conversations-new-conversation-button": "onNewConversationClicked"}),initialize: function(a) {
        d.prototype.initialize.apply(this, arguments), this.client = a.client, this.listenTo(this.collection, "add change", this.renderConversations)
    },render: function() {
        var a = this.settings.get("app.inbound-messaging-enabled");
        return this.$el.html(this.template({appName: this.settings.get("app.name"),inboundMessagingEnabled: a})).toggleClass("intercom-new-message-enabled", a), this.renderConversations(), this.$(".intercom-sheet-content").on("scroll", b.bind(this.onScroll, this)), this
    },renderConversations: function() {
        var b = document.createDocumentFragment();
        this.collection.each(function(c) {
            a(b).prepend(new e({model: c}).render().el)
        }, this), this.$(".intercom-conversations-items").html(b), this.$el.toggleClass("intercom-conversations-empty", this.collection.isEmpty()), this.$el.toggleClass("intercom-conversations-fetched", this.collection.isFetched()), this.shouldFetchNextPage() && this.fetchNextPage()
    },fetchNextPage: function() {
        this.$el.hasClass("intercom-conversations-fetching") || this.$el.hasClass("intercom-conversations-fetched") || (this.$el.addClass("intercom-conversations-fetching"), this.collection.fetchNextPage().then(b.bind(function() {
            this.$el.removeClass("intercom-conversations-fetching")
        }, this)))
    },shouldFetchNextPage: function() {
        return 1 === this.collection.pages && !this.collection.isFetched()
    },onNewConversationClicked: function(a) {
        a.preventDefault(), a.stopPropagation(), c.trigger("click:new-conversation"), g.increment("newConversationButtonClicked")
    },onScroll: b.throttle(function() {
        this.getScrollPosition() < 50 && this.fetchNextPage()
    }, 200)})
}), define("views/embed/conversation", function() {
    "use strict";
    var a = require("jquery"), b = require("backbone"), c = require("views/embed/part"), d = require("views/composer"), e = require("template");
    return b.View.extend({template: e.load("embed/conversation"),className: ["intercom-conversation", "intercom-conversation-active", "intercom-conversation-embed"].join(" "),events: {mouseenter: "onMouseEnter"},initialize: function(a) {
        this.appName = a.appName || !1, this.adminName = a.adminName || !1, this.preview = a.preview || !1, this.composerView = new d(a), this.listenTo(this.model.parts, "add reset change", this.renderParts)
    },render: function() {
        this.$el.html(this.template({appName: this.appName,adminName: this.adminName})), this.$(".intercom-composer-container").append(this.composerView.render({placeholder: "Write a reply&hellip;"}).el);
        var a = !this.appName && !this.adminName;
        return this.$(".intercom-sheet-content").toggleClass("intercom-embed-no-header", a), this
    },renderParts: function() {
        var b = document.createDocumentFragment();
        this.model.parts.each(function(d) {
            var e = new c({model: d,conversation: this.model});
            a(b).append(e.render().el)
        }, this), this.$(".intercom-conversation-parts").html(b), this.$el.toggleClass("intercom-conversation-preview", this.isPreviewable()), this.$el.toggleClass("intercom-conversation-announcement", this.model.isAnnouncement()), this.$(".intercom-lwr-composer").removeClass("intercom-lwr-composer-enabled"), this.updateComposer()
    },updateComposer: function() {
        var a = this.model.parts.last();
        a.isLwrMessage() || a.isLwrResponse() ? this.composerView.hide() : this.composerView.show().disable().updatePosition()
    },isPreviewable: function() {
        return this.preview && this.model.isSmallAnnouncement()
    },onMouseEnter: function() {
        this.$el.removeClass("intercom-conversation-preview")
    }})
}), define("views/embed/launcher", ["jquery", "underscore", "backbone", "template", "preview"], function(a, b, c, d) {
    "use strict";
    return c.View.extend({template: d.load("embed/launcher"),id: "intercom-embedded-launcher",className: ["intercom-launcher", "intercom-launcher-active", "intercom-launcher-enabled"].join(" "),render: function() {
        return this.$el.html(this.template()), this
    },addPreview: function(a, b) {
        this.$el.addClass("intercom-launcher-with-preview intercom-launcher-with-badge"), this.$(".intercom-launcher-preview-body").html(a).previewify(), this.$el.toggleClass(["intercom-launcher-with-avatar", "intercom-launcher-with-updated-avatar"].join(" "), void 0 !== b), this.$(".intercom-launcher-button").css({"background-image": void 0 === b ? "" : 'url("' + b + '")'}), this.$(".intercom-launcher-badge").text(1)
    }})
}), define("views/embed/part", ["jquery", "underscore", "backbone", "views/part"], function(a, b, c, d) {
    "use strict";
    return d.extend({openLink: a.noop,openImage: a.noop})
}), define("views/emoji-selector", function() {
    "use strict";
    var a = require("underscore"), b = require("browser"), c = require("intermoji"), d = require("emoji"), e = require("backbone"), f = function(a) {
        return '<span class="intercom-emoji-image" style="' + c.spritemapStyleString(d.sizePx(), a) + '" title="' + c.asciiFromUnicode(a) + '"></span>'
    }, g = function(b, d) {
        return a.reduce(b, function(a, b) {
            return a + '<span class="intercom-emoji-icon" title="' + c.identifierFromUnicode(b) + '">' + b + "</span>"
        }, '<div class="intercom-emoji-selector-panel-large" data-group-idx="' + d + '">') + '<div class="intercom-large-emoji-panel-top-mask" data-group-idx="' + d + '"></div><div class="intercom-large-emoji-panel-bottom-mask" data-group-idx="' + d + '"></div></div>'
    }, h = function(a, b, c) {
        return '<span class="intercom-emoji-group-icon" title="' + b + '"data-group-idx="' + c + '">' + a + "</span>"
    };
    return e.View.extend({className: "intercom-emoji-selector",events: {"click .intercom-emoji-image": "onEmojiImageClick","click .intercom-emoji-group-icon": "onEmojiGroupIconClick","click .intercom-emoji-icon": "onEmojiIconClick"},getScrollPosition: function() {
        return this.getScrollHeight() - this.getHeight() - this.getScrollTop()
    },getScrollTop: function() {
        return this.$(".intercom-emoji-selector-panel-large.active").scrollTop()
    },getScrollHeight: function() {
        return this.$(".intercom-emoji-selector-panel-large.active").prop("scrollHeight")
    },getHeight: function() {
        return this.$(".intercom-emoji-selector-panel-large.active").height()
    },onScrollLargePanel: function(a) {
        if (b.features.pointerEvents()) {
            var c = this.$('.intercom-large-emoji-panel-top-mask[data-group-idx="' + a.target.dataset.groupIdx + '"]'), d = this.$('.intercom-large-emoji-panel-bottom-mask[data-group-idx="' + a.target.dataset.groupIdx + '"]');
            this.getScrollTop() > 0 && !c.is(":visible") ? c.fadeIn(200) : 0 === this.getScrollTop() && c.is(":visible") && c.fadeOut(200), this.getScrollPosition() > 0 && !d.is(":visible") ? d.fadeIn(200) : 0 === this.getScrollPosition() && d.is(":visible") && d.fadeOut(200)
        }
    },initialize: function(a) {
        this.onEmojiIconClickCallback = a.onEmojiIconClickCallback
    },render: function() {
        return b.features.emoji() ? (this.renderWithNativeSupport(c.prettyEmoticonsUnicodeGroups()), this.activatePanel(0), this.$(".intercom-emoji-selector-panel-large").on("scroll", a.bind(this.onScrollLargePanel, this))) : this.renderWithoutNativeSupport(c.asciiEmoticonsUnicodeList.slice(0, 12)), this
    },renderWithNativeSupport: function(d) {
        this.$el.append(a.reduce(d, function(a, b, d) {
            var e = c.getGroupRepresentatives()[d];
            return a + h(e[0], e[1], d)
        }, '<div class="intercom-emoji-selector-panel-header">') + "</div>" + a.reduce(d, function(a, b, c) {
            return a + g(b, c)
        }, "", this)), b.features.pointerEvents() || this.$(".intercom-large-emoji-panel-bottom-mask").css("display", "none")
    },renderWithoutNativeSupport: function(b) {
        this.$el.append(a.reduce(b, function(a, b) {
            return a + f(b)
        }, '<div class="intercom-emoji-selector-panel-small">') + "</div>")
    },onEmojiImageClick: function(a) {
        this.onEmojiIconClickCallback(a.currentTarget.title)
    },onEmojiIconClick: function(a) {
        this.onEmojiIconClickCallback(a.currentTarget.textContent)
    },onEmojiGroupIconClick: function(a) {
        this.activatePanel(a.currentTarget.dataset.groupIdx)
    },activatePanel: function(a) {
        this.$(".intercom-emoji-selector-panel-large.active").removeClass("active"), this.$('.intercom-emoji-selector-panel-large[data-group-idx="' + a + '"]').addClass("active"), this.$(".intercom-emoji-group-icon.active").removeClass("active"), this.$('.intercom-emoji-group-icon[data-group-idx="' + a + '"]').addClass("active")
    }})
}), define("views/image-viewer", function() {
    "use strict";
    var a = require("jquery"), b = require("underscore"), c = require("backbone"), d = require("views/zoomed-image"), e = require("template");
    return c.View.extend({className: "intercom-image-viewer",template: e.load("image-viewer"),events: {click: "onClick"},initialize: function(a) {
        this.zoomedImageView = new d({image: a.image})
    },render: function() {
        return this.$el.html(this.template()), this.$el.append(this.zoomedImageView.render().$el), b.defer(b.bind(function() {
            this.$(".intercom-image-viewer-overlay").transition({opacity: .8}, 300)
        }, this)), a(document).on("keyup.intercom-image-overlay", b.bind(this.onKeyUp, this)), this
    },close: function() {
        this.$(".intercom-image-viewer-overlay").transition({opacity: 0,complete: b.bind(this.remove, this)}, 300), this.zoomedImageView.remove(), a(document).off("keyup.intercom-image-overlay")
    },onClick: function() {
        this.close()
    },onKeyUp: function(a) {
        27 === a.keyCode && this.close()
    }})
}), define("views/image", function() {
    "use strict";
    function a(a, d) {
        a.naturalWidth > 0 && a.naturalHeight > 0 ? c.defer(d) : b(a).load(d)
    }
    var b = require("jquery"), c = require("underscore"), d = require("backbone"), e = require("views/image-viewer"), f = require("url-opener"), g = require("browser");
    return d.View.extend({render: function() {
        return a(this.el, c.bind(function() {
            this.isScaled() && !this.isLink() && this.$el.off("click").on("click", c.bind(this.onClick, this)).addClass("intercom-image-viewable")
        }, this)), this
    },open: function() {
        g.features.ie8() ? this.openInNewWindow() : this.openInViewer()
    },openInViewer: function() {
        var a = new e({image: this.el});
        b("#intercom-container").append(a.render().$el)
    },openInNewWindow: function() {
        f.openUrlInNewWindow(this.$el.attr("src"))
    },isLink: function() {
        return this.$el.closest("a").length > 0
    },isScaled: function() {
        return this.$el.width() < this.el.naturalWidth || this.$el.height() < this.el.naturalHeight
    },onClick: function(a) {
        a.preventDefault(), this.open()
    }})
}), define("views/intercom", function() {
    "use strict";
    var a = require("jquery"), b = require("underscore"), c = require("backbone"), d = require("stylesheet"), e = require("browser"), f = require("metrics"), g = require("state-store"), h = require("models/conversation"), i = require("views/messenger"), j = require("views/launcher");
    return c.View.extend({id: "intercom-container",className: "intercom-container intercom-reset",initialize: function(a) {
        this.settings = a.settings, this.launcherView = new j({settings: this.settings,collection: this.collection}), this.messengerView = new i({client: a.client,nexusClient: a.nexusClient,settings: this.settings,collection: this.collection,app: a.app}), this.render = b.once(this.render), this.fetchConversations = b.once(this.fetchConversations)
    },render: function(a) {
        return this.$el.toggleClass("intercom-ie8", e.features.ie8()), this.renderStylesheet(), this.setPackageIdentifier(), this.renderLauncher(), this.renderMessenger(), !a && this.settings.get("user.anonymous") && this.settings.get("launcher.enabled") && this.showWelcomeMessage(), this.restoreState(), this
    },renderStylesheet: function() {
        this.$el.append(this.makeStylesheetElement())
    },renderLauncher: function() {
        this.$el.append(this.launcherView.render().$el), this.launcherView.$el.fadeIn(100)
    },renderMessenger: function() {
        this.$el.append(this.messengerView.render().$el)
    },makeStylesheetElement: function() {
        var b = d("stylesheets/intercom", this.settings.get("app.color"));
        return a('<style type="text/css" id="intercom-styles">' + b + "</style>")
    },setPackageIdentifier: function() {
        this.isUserAnonymous() && this.isInboundMessagingEnabled() ? this.$el.addClass("intercom-acquire") : !this.isInboundMessagingEnabled() && this.isOutboundMessagingEnabled() && this.$el.addClass("intercom-learn")
    },show: function(a) {
        return a ? void this.showConversation(a) : void this.fetchConversations().then(b.bind(function() {
            this.collection.isEmpty() && this.isInboundMessagingEnabled() ? this.showNewConversation() : this.showConversations()
        }, this))
    },showConversations: function() {
        this.fetchConversations().then(b.bind(function() {
            this.messengerView.showConversations(), this.launcherView.hide()
        }, this)), g.save({view: "conversations",restore: !0})
    },showConversationById: function(a) {
        var c = new h({id: a});
        this.showLoading(), c.fetch().then(b.bind(function() {
            c.set({read: !0}), this.collection.add(c, {merge: !0}), this.showConversation(c)
        }, this))
    },showConversation: function(a) {
        this.messengerView.showConversation(a), this.launcherView.hide(), this.shouldMinimize && this.minimize(), g.save({view: "conversation-" + a.id,restore: !a.isAnnouncement()})
    },showNewConversation: function(a, b) {
        console.log('--->here?', a, b);

        this.messengerView.showNewConversation(a, b);
        
        // this.isInboundMessagingEnabled() && (this.messengerView.showNewConversation(a, b), this.launcherView.hide(), this.shouldMinimize && this.minimize(), g.save({view: "new-conversation",restore: !0}))
    },showWelcomeMessage: function() {
        this.settings.has("app.message") && this.launcherView.showWelcome(this.settings.get("app.message"))
    },showLoading: function() {
        this.messengerView.showLoading(), this.launcherView.hide()
    },autoOpenConversation: function(a) {
        this.messengerView.autoOpenConversation(a), this.launcherView.hide()
    },hide: function() {
        this.messengerView.hide(), this.launcherView.show(), g.clear()
    },minimize: function() {
        var a = this.messengerView.getCurrentConversation();
        this.messengerView.minimize(), this.launcherView.minimize(), this.launcherView.maximize(a), this.shouldMinimize = !1, g.save({minimized: !0,restore: !0})
    },maximize: function(a) {
        this.messengerView.maximize(), this.launcherView.minimize(), a && a !== this.messengerView.getCurrentConversation() && this.showConversation(a), g.save({minimized: !1})
    },isMinimized: function() {
        return this.messengerView.isMinimized()
    },isActive: function() {
        return this.messengerView.isActive()
    },isInboundMessagingEnabled: function() {
        return this.settings.get("app.inbound-messaging-enabled")
    },isOutboundMessagingEnabled: function() {
        return this.settings.get("app.outbound-messaging-enabled")
    },isUserAnonymous: function() {
        return this.settings.get("user.anonymous")
    },restoreState: function() {
        var a = g.load();
        if (a && a.view && a.restore !== !1) {
            this.shouldMinimize = a.minimized;
            var b = a.view.match(/conversation-(\d+)/);
            b ? this.showConversationById(b[1]) : "conversations" === a.view ? this.showConversations() : "new-conversation" === a.view && this.showNewConversation(), this.shouldMinimize && this.messengerView.hide()
        }
    },refreshActiveConversation: function(a) {
        return this.messengerView.refreshActiveConversation(a)
    },fetchConversations: function() {
        this.showLoading();
        var a = f.timer("fetchConversations");
        return this.collection.fetch().then(a.resolve)
    }})
}), define("views/is-typing", function() {
    "use strict";
    var a = require("backbone"), b = require("template");
    return a.View.extend({template: b.load("is-typing"),className: "intercom-conversation-part intercom-is-typing",render: function(a) {
        return this.$el.html(this.template(a)), this
    },getHeight: function() {
        return this.$el.outerHeight(!0)
    }})
}), define("views/last-active", function() {
    "use strict";
    var a = require("underscore"), b = require("backbone"), c = require("template"), d = require("time"), e = require("i18n");
    return b.View.extend({template: c.load("last-active"),className: "intercom-last-active",initialize: function() {
        this.updateLastSeen = null, this.listenTo(this.model, "change", this.render)
    },render: function(b) {
        if (this.clearLastSeenUpdateTimer(), b ? (this.stopListening(this.model), this.last_active = b.last_active) : this.last_active = this.getTeamPresenceTimestamp(), this.last_active) {
            var c = a.bind(function() {
                this.$el.html(this.template({lastActive: this.getRelativeText((new Date).getTime())}))
            }, this);
            c(), this.$el.show(), this.updateLastSeen = setInterval(c, 6e4)
        } else
            this.$el.hide();
        return this
    },getRelativeText: function() {
        var a = d.relativeTime(new Date(this.last_active));
        switch (a.unit) {
        case "s":
            return e.translate("active-in-the-last-x-minutes", {minutes: 15});
        case "m":
            return a.delta <= 15 ? e.translate("active-in-the-last-x-minutes", {minutes: 15}) : e.translate("active-in-the-last-hour");
        case "h":
            return 1 === a.delta ? e.translate("last-active-one-hour-ago") : e.translate("last-active-x-hours-ago", {hours: a.delta});
        case "d":
            return 1 === a.delta ? e.translate("last-active-one-day-ago") : e.translate("last-active-x-days-ago", {days: a.delta});
        default:
            return e.translate("last-active-more-than-one-week-ago")
        }
    },clearLastSeenUpdateTimer: function() {
        window.clearInterval(this.updateLastSeen)
    },getTeamPresenceTimestamp: function() {
        var b = this.model.get("last_active");
        return a.isNumber(b) ? 1e3 * b : void 0
    }})
}), define("views/launcher", ["preview"], function() {
    "use strict";
    var a = require("jquery"), b = require("underscore"), c = require("json"), d = require("backbone"), e = require("logger"), f = require("browser"), g = require("store"), h = require("metrics"), i = require("navigation-events"), j = require("previewer"), k = require("user-notifier"), l = require("template"), m = require("emoji"), n = require("user-metrics"), o = require("views/app-hovercard"), p = require("views/animations/launcher"), q = require("views/animations/launcher-preview");
    return d.View.extend({template: l.load("launcher"),closedPreviewsKey: "closed-preview-keys",id: "intercom-launcher",className: "intercom-launcher intercom-launcher-active",events: {click: "onClicked",mouseover: "onMouseOver",mouseout: "onMouseOut","click .intercom-launcher-preview-close": "onCloseClicked"},initialize: function(a) {
        this.timeout = null, this.settings = a.settings, this.listenTo(this.collection, "add change", this.update), this.listenTo(this.collection, "add", this.onConversationAdded), this.listenTo(this.collection, "change", this.onConversationChanged), this.render = b.once(this.render), this.anonymousOnDesktop = this.settings.get("user.anonymous") && !f.features.touchScreen()
    },render: function() {
        return this.$el.html(this.template), this.insertHoverCard(), this.isEnabled() && this.enable(), this
    },insertHoverCard: function() {
        this.createHoverCard(), this.appHovercardView && this.$el.append(this.appHovercardView.render().el)
    },createHoverCard: function() {
        this.appHovercardView || this.settings.get("user.anonymous") && !this.isMobileUser() && (this.appHovercardView = new o(this.settings))
    },show: function() {
        this.$el.addClass("intercom-launcher-active").removeClass("intercom-launcher-maximized").removeClass("intercom-launcher-minimized").removeClass("intercom-launcher-inactive"), this.model || this.removeAvatar()
    },hide: function() {
        this.$el.addClass("intercom-launcher-inactive").removeClass("intercom-launcher-maximized").removeClass("intercom-launcher-active")
    },minimize: function() {
        this.$el.addClass("intercom-launcher-minimized").removeClass("intercom-launcher-maximized"), this.minimizedConversation = void 0, this.updatedSinceMinimize = !1
    },isMinimized: function() {
        return this.$el.hasClass("intercom-launcher-maximized")
    },maximize: function(a) {
        if (this.minimizedConversation = a, this.updatedSinceMinimize = !1, this.$el.addClass("intercom-launcher-maximized").removeClass("intercom-launcher-minimized").removeClass("intercom-launcher-with-preview").removeClass("intercom-launcher-with-avatar").removeClass("intercom-launcher-with-initials"), this.removeAvatar(), void 0 !== a) {
            var b = a.lastAdminAvatar(), c = a.lastAdminInitials();
            this.setAvatar(b, c)
        }
    },enable: function() {
        this.$el.addClass("intercom-launcher-enabled"), e.info("views/launcher - Launcher enabled")
    },disable: function() {
        this.$el.removeClass("intercom-launcher-enabled"), e.info("views/launcher - Launcher disabled")
    },update: function() {
        void 0 !== this.minimizedConversation && (this.updatedSinceMinimize = !0), this.model = this.collection.newUnread().last(), b.isUndefined(this.model) ? (this.$el.removeClass("intercom-launcher-with-message").removeClass("intercom-launcher-with-avatar").removeClass("intercom-launcher-with-initials").removeClass("intercom-launcher-with-badge").removeClass("intercom-launcher-with-preview"), this.removeAvatar()) : (this.$el.addClass("intercom-launcher-with-message"), this.updateAvatar(), this.updateBadge(), this.updatePreview(), this.appHovercardView && this.hideHoverCard())
    },onConversationAdded: function(a, c, d) {
        b.isUndefined(a) || b.isUndefined(d) || d.add !== !0 || a.isRead() || (this.settings.update({user: {has_conversations: !0}}), k.triggerNotification(a))
    },onConversationChanged: function(a) {
        b.isUndefined(a) || a.isRead() || a.changed.read !== !1 && b.isUndefined(a.changed.parts_count) || k.triggerNotification(a)
    },updateAvatar: function() {
        var a = this.model.lastAdminAvatar(), b = this.model.lastAdminInitials();
        this.$el.addClass("intercom-launcher-with-updated-avatar"), this.setAvatar(a, b)
    },setAvatar: function(a, b) {
        void 0 === a ? (this.$el.addClass("intercom-launcher-with-initials"), this.$(".intercom-launcher-button").show().removeAttr("style").find(".intercom-launcher-initials").text(b)) : (this.$el.addClass("intercom-launcher-with-avatar"), this.$(".intercom-launcher-button").show().removeAttr("style").css({"background-image": 'url("' + a + '")'}))
    },removeAvatar: function() {
        this.$el.removeClass("intercom-launcher-with-avatar").removeClass("intercom-launcher-with-updated-avatar").removeClass("intercom-launcher-with-initials"), this.$(".intercom-launcher-button").css({"background-image": ""})
    },updatePreview: function() {
        var a = this.model.parts.byAdmin().last();
        void 0 !== a && this.shouldShowPreview(a) ? this.$el.hasClass("intercom-launcher-with-preview") ? this.hidePreviewForUpdate(a) : this.showPreview(a.body(), a.id) : this.hidePreview()
    },updateBadge: function() {
        var a = this.collection.unread().size();
        this.$el.toggleClass("intercom-launcher-with-badge", a > 0), this.$(".intercom-launcher-badge").text(a)
    },isEnabled: function() {
        return this.settings.get("launcher.enabled")
    },shouldSupressPreview: function() {
        return this.model && !this.model.matchesCurrentUrl() && !this.model.hasUserComment()
    },showPreview: function(a, c) {
        if (!this.isPreviewClosed(c) && !this.shouldSupressPreview()) {
            var d = this.$el.addClass("intercom-launcher-with-preview").find(".intercom-launcher-preview-body").toggleClass("intercom-launcher-preview-metadata", j.isMetadataPreview(a)).html(m.maybeSubstituteWithSpans(j.preview(a), "intercom-emoji-sub-icon"));
            this.anonymousOnDesktop && "app-message" === c || b.defer(b.bind(d.previewify, d)), b.defer(b.bind(function() {
                var a = this.$el.find(".intercom-launcher-preview");
                a.toggleClass("intercom-launcher-preview-multi-line", a.outerHeight() > this.$el.outerHeight())
            }, this)), this.previewKey = c
        }
    },showWelcome: function(a) {
        if (!this.isMobileUser())
            if (this.appHovercardView) {
                if (!this.firstPingThisSession())
                    return;
                setTimeout(b.bind(this.showHoverCard, this), 500), this.timeout = setTimeout(b.bind(this.hideHoverCard, this), 6e3), g.sessionStorage.set("welcome.animated", "true")
            } else
                this.firstPingOrAnonymousOnDesktop() && !this.isPreviewClosed("app-message") ? (this.showPreview(a, "app-message"), p.first(this), q.show(this, this.anonymousOnDesktop), g.sessionStorage.set("welcome.animated", "true")) : p.subsequent(this)
    },playWelcomeNotification: function() {
        k.triggerWelcomeNotification(this.settings.get("app.name"))
    },firstPingThisSession: function() {
        return "true" !== g.sessionStorage.get("welcome.animated")
    },firstPingOrAnonymousOnDesktop: function() {
        return this.firstPingThisSession() || this.anonymousOnDesktop
    },hidePreview: function() {
        this.$el.removeClass("intercom-launcher-with-preview intercom-launcher-with-admins"), this.$(".intercom-launcher-preview").removeAttr("style")
    },hidePreviewForUpdate: function(a) {
        this.$(".intercom-launcher-preview").removeAttr("style").addClass("intercom-launcher-update-preview"), b.delay(b.bind(function() {
            this.hidePreview(), this.$(".intercom-launcher-preview").removeClass("intercom-launcher-update-preview"), this.showPreview(a.body(), a.id)
        }, this), 1500)
    },closePreview: function() {
        this.previewKey && (this.addClosedPreviewKey(this.previewKey), this.hidePreview(), n.trackSignedOutEvent("app-message" === this.previewKey ? "uniqueVisitorDismissedWelcomeMessage" : "uniqueVisitorDismissedChatNotification"))
    },shouldShowPreview: function(a) {
        return !this.isPreviewClosed(a.id) && (this.model.isChat() || this.model.hasComments())
    },isPreviewClosed: function(a) {
        var c = this.getClosedPreviewKeys();
        return b.contains(c, a)
    },isMobileUser: function() {
        return f.features.touchScreen()
    },getClosedPreviewKeys: function() {
        return c.parse(g.sessionStorage.get(this.closedPreviewsKey) || "[]")
    },addClosedPreviewKey: function(a) {
        var d = this.getClosedPreviewKeys();
        b.contains(d, a) || d.push(a), g.sessionStorage.set(this.closedPreviewsKey, c.stringify(d))
    },incrementLauncherClickMetrics: function() {
        h.increment(b.isUndefined(this.minimizedConversation) ? b.isUndefined(this.model) ? "launcherClicked" : "chatheadClicked" : "maximizeClicked")
    },onClicked: function(b) {
        if (!a(b.target).is("a")) {
            b.preventDefault();
            var c;
            c = void 0 === this.minimizedConversation || this.updatedSinceMinimize ? this.model : this.minimizedConversation, this.appHovercardView && this.appHovercardView.isVisible() && !c && !f.features.ie() ? this.appHovercardView.transitionToNewMessage() : i.trigger("click:open", c), this.incrementLauncherClickMetrics(), this.addClosedPreviewKey(this.previewKey), this.hidePreview(), this.trackClickMetrics()
        }
    },showHoverCard: function() {
        this.appHovercardView.show()
    },hideHoverCard: function() {
        this.appHovercardView.hide()
    },onMouseOver: function() {
        !this.appHovercardView || this.model || this.isMinimized() || (clearTimeout(this.timeout), this.timeout = setTimeout(b.bind(this.showHoverCard, this), 150))
    },onMouseOut: function(c) {
        if (this.appHovercardView) {
            var d = 1 === a(c.fromElement).closest(".intercom-launcher-hovercard").length && 0 === a(c.toElement).closest(".intercom-launcher-hovercard").length, e = d ? 50 : 500;
            clearTimeout(this.timeout), this.timeout = setTimeout(b.bind(this.hideHoverCard, this), e)
        }
    },trackClickMetrics: function() {
        n.trackSignedOutEvent(this.model && this.model.parts.byAdmin().first() && this.model.parts.byAdmin().first().isChatAutoMessage() && this.settings.get("user.anonymous") ? "inReplyToVisitorAutoMessage.uniqueVisitorOpenedMessenger" : "fromNewConversationView.uniqueVisitorOpenedMessenger")
    },onCloseClicked: function(a) {
        a.stopPropagation(), this.closePreview(), h.increment("launcherPreviewClosed")
    }})
}), define("views/loading", ["jquery", "underscore", "backbone", "views/sheet", "template"], function(a, b, c, d, e) {
    "use strict";
    return d.extend({template: e.load("loading"),id: "intercom-loading",minimizable: !1,className: "intercom-sheet intercom-sheet-loading",initialize: function() {
        d.prototype.initialize.apply(this, arguments)
    },render: function() {
        return this.$el.html(this.template({appName: this.settings.get("app.name")})), this
    },didHide: function() {
        this.$(".intercom-sheet-spinner").hide()
    },willShow: function() {
        this.$(".intercom-sheet-spinner").show()
    }})
}), define("views/lwr-composer", function() {
    "use strict";
    var a = require("jquery"), b = require("underscore"), c = require("backbone"), d = require("audio"), e = require("templates/lwr-thumbs-composer"), f = require("templates/lwr-emotions-composer"), g = require("templates/icon-thumbs-up"), h = require("templates/icon-thumbs-down"), i = require("templates/icon-emotion-happy"), j = require("templates/icon-emotion-neutral"), k = require("templates/icon-emotion-sad");
    return c.View.extend({thumbsTemplate: e,emotionsTemplate: f,tagName: "form",id: "intercom-lwr-composer",className: "intercom-lwr-composer",events: {"click .intercom-lwr-composer-option": "onSelected"},render: function() {
        var a = this.getLwrComposerType();
        return "thumbs" === a ? this.renderThumbs() : "emotions" === a && this.renderEmotions(), this.markSelectedOption(), this.$el.toggleClass("intercom-lwr-composer-enabled", 0 === this.$(".intercom-lwr-composer-option-selected").length), this.show(), this
    },renderThumbs: function() {
        this.$el.html(this.thumbsTemplate()), this.$(".intercom-lwr-composer-option-thumbs-up .intercom-lwr-icon").html(g), this.$(".intercom-lwr-composer-option-thumbs-down .intercom-lwr-icon").html(h)
    },renderEmotions: function() {
        this.$el.html(this.emotionsTemplate()), this.$(".intercom-lwr-composer-option-happy .intercom-lwr-icon").html(i), this.$(".intercom-lwr-composer-option-neutral .intercom-lwr-icon").html(j), this.$(".intercom-lwr-composer-option-sad .intercom-lwr-icon").html(k)
    },show: function() {
        this.$el.addClass("intercom-lwr-composer-active")
    },hide: function() {
        this.$el.removeClass("intercom-lwr-composer-active")
    },enable: function() {
        this.$el.addClass("intercom-lwr-composer-enabled")
    },disable: function() {
        this.$el.removeClass("intercom-lwr-composer-enabled")
    },onSelected: function(b) {
        b.preventDefault();
        var c = a(b.target).closest(".intercom-lwr-composer-option");
        if (this.$el.hasClass("intercom-lwr-composer-enabled")) {
            c.addClass("intercom-lwr-composer-option-selected intercom-lwr-composer-option-pop"), this.$el.removeClass("intercom-lwr-composer-enabled");
            var e = c.data("option");
            this.trigger("submit", this.model.getLwrType(), e), d.playDelivered()
        }
    },markSelectedOption: function() {
        var b = this.model.getLwrResponse();
        this.$(".intercom-lwr-composer-option").each(function(c, d) {
            a(d).toggleClass("intercom-lwr-composer-option-selected", a(d).data("option") === b)
        })
            },getLwrComposerType: function() {
                var a = this.model.getLwrResponse();
                return b.contains(["thumbs_up", "thumbs_down"], a) ? "thumbs" : b.contains(["happy", "neutral", "sad"], a) ? "emotions" : this.model.getLwrType()
            }})
}), define("views/messenger", function() {
    "use strict";
    var a = require("jquery"), b = require("underscore"), c = require("backbone"), d = require("views/conversation"), e = require("views/conversations"), f = require("views/loading");
    return c.View.extend({id: "intercom-messenger",className: "intercom-messenger intercom-messenger-inactive",initialize: function(a) {
        this.settings = a.settings;
        var c = {client: a.client,nexusClient: a.nexusClient,settings: a.settings,collection: this.collection,app: a.app};
        this.newConversationView = new d(c), this.conversationsView = new e(c), this.conversationView = new d(c), this.loadingView = new f({settings: a.settings}), this.render = b.once(this.render), this.renderConversation = b.once(this.renderConversation), this.renderConversations = b.once(this.renderConversations), this.renderNewConversation = b.once(this.renderNewConversation), this.renderLoading = b.once(this.renderLoading), this._registerNexusEvents(a.nexusClient)
    },renderConversation: function() {
        this.$el.append(this.conversationView.render().el)
    },renderConversations: function() {
        this.$el.append(this.conversationsView.render().el)
    },renderNewConversation: function() {
        this.$el.append(this.newConversationView.render().el)
    },renderLoading: function() {
        this.$el.append(this.loadingView.render().el)
    },showConversations: function() {
        this.renderConversations(), this.show(this.conversationsView)
    },showNewConversation: function(a, b) {

        console.log('messageView--->showNewConversation');

        this.renderNewConversation();
        this.show(this.newConversationView);
        this.newConversationView.renderNewConversation(b);
        // this.newConversationView.composerView.setText(a);
        
        // this.renderNewConversation(), this.show(this.newConversationView), this.newConversationView.renderNewConversation(b), this.newConversationView.composerView.setText(a)
    },showConversation: function(a) {
        this.renderConversation(), this.conversationView.renderConversation(a, {autoOpen: !1}), this.show(this.conversationView)
    },showLoading: function() {
        this.renderLoading(), this.show(this.loadingView)
    },autoOpenConversation: function(a) {
        this.renderConversation(), this.conversationView.renderConversation(a, {autoOpen: !0}), this.show(this.conversationView)
    },hide: function() {
        a("body").removeClass("intercom-messenger-active"), this.$el.removeClass("intercom-messenger-active").addClass("intercom-messenger-inactive"), this.currentView && this.currentView.hide()
    },show: function(b) {
        this.currentView && this.currentView.hide(), this.currentView = b, a("body").addClass("intercom-messenger-active"), this.$el.addClass("intercom-messenger-active").removeClass("intercom-messenger-inactive"), b.show()
    },minimize: function() {
        this.currentView && this.currentView.minimize()
    },maximize: function() {
        this.currentView && this.currentView.maximize()
    },isMinimized: function() {
        return this.currentView && this.currentView.isMinimized()
    },isActive: function() {
        return this.$el.hasClass("intercom-messenger-active")
    },isConversationViewActive: function() {
        return this.isActive() && b.contains([this.conversationView, this.newConversationView], this.currentView)
    },getCurrentConversation: function() {
        return this.isConversationViewActive() ? this.currentView.model : void 0
    },refreshActiveConversation: function(a) {
        var b = this.getCurrentConversation();
        return b && b.id === a ? (b.fetch(), !0) : !1
    },onAdminIsTyping: function(a) {
        this.settings.get("app.rtm-enabled") && this.isConversationViewActive() && this.currentView.onAdminIsTyping(a)
    },_registerNexusEvents: function(a) {
        a.addListener("AdminIsTyping", b.bind(this.onAdminIsTyping, this))
    }})
}), define("views/new-anonymous-user", function() {
    "use strict";
    var a = require("jquery"), b = require("underscore"), c = require("backbone"), d = require("email"), e = require("template"), f = require("models/user"), g = require("views/animations/show-anonymous-email");
    return c.View.extend({template: e.load("new-anonymous-user"),className: "intercom-new-anonymous-user",tagName: "form",events: {submit: "onSubmit","input input[name=email]": "onTextChanged"},attributes: {novalidate: "novalidate"},initialize: function(a) {
        this.user = f.fromSettings(a.settings), this.parentView = a.parentView, this.shouldShowReplyDelay = a.shouldShowReplyDelay
    },render: function() {
        return this.$el.html(this.template({haveEmail: this.user.hasEmail(),email: this.user.getEmail(),emailCollectorText: this.shouldShowReplyDelay ? "median-reply-autoresponse-without-email" : "anonymous-email-responder"})), this.enable(), this
    },enable: function() {
        this.$el.removeClass("intercom-new-anonymous-user-disabled").find('input[type="submit"]').prop("disabled", "disabled")
    },disable: function() {
        this.$el.addClass("intercom-new-anonymous-user-disabled").find("input").prop("disabled", "disabled")
    },getEmail: function() {
        return a.trim(this.$("input[name=email]").val())
    },onSubmit: function(a) {
        a.preventDefault();
        var b = this.getEmail();
        return d.isValid(b) ? (this.disable(), void this.user.updateAnonymousEmail(b).then(this.playPostSubmitAnimation())) : void this.$("input[type=email]").addClass("intercom-new-anonymous-user-email-invalid")
    },playPostSubmitAnimation: function() {
        g(this, this.parentView)
    },onTextChanged: function() {
        this.$("input[type=submit]").prop("disabled", b.isEmpty(this.getEmail()) ? "disabled" : ""), this.$("input[type=email]").removeClass("intercom-new-anonymous-user-email-invalid")
    }})
}), define("views/part", function() {
    "use strict";
    var a = require("underscore"), b = require("jquery"), c = require("i18n"), d = require("browser"), e = require("backbone"), f = require("metrics"), g = require("url-opener"), h = require("template"), i = require("emoji"), j = require("models/part"), k = require("views/lwr-composer"), l = require("views/relative-time"), m = require("views/video-reply"), n = require("views/image");
    return e.View.extend({commentTemplate: h.load("comment"),announcementTemplate: h.load("announcement"),smallAnnouncementTemplate: h.load("small-announcement"),uploadTemplate: h.load("upload-part"),imageOnlyTemplate: h.load("image-only-part"),stickerTemplate: h.load("sticker-part"),commentMetadataTemplate: h.load("comment-metadata"),className: "intercom-conversation-part",events: {click: "onClick","click .intercom-comment-body a": "openLink","click .intercom-announcement-body a": "openLink","click .intercom-small-announcement-body a": "openLink"},initialize: function(a) {
        this.failed = !1, this.conversation = a.conversation, this.lwrComposerView = new k({model: this.model}), this.listenTo(this.lwrComposerView, "submit", this.onLwrComposerSubmitted), this.listenTo(this.model, "change", this.onChange), this.listenTo(this.model.uploads, "upload:complete", this.triggerPartSave)
    },render: function() {
        return this.model.isAnnouncement() ? this.renderAnnouncement() : this.model.isSmallAnnouncement() ? this.renderSmallAnnouncement() : this.model.isSticker() ? this.renderSticker() : this.model.isVideoReply() ? this.renderVideoReply() : this.renderComment(), this.renderLwrComposer(), this.renderImages(), this.$(".intercom-attachments").toggle(this.model.uploads.any()), this
    },renderImages: function() {
        this.$([".intercom-comment-body img", ".intercom-announcement-body img", ".intercom-small-announcement-body img"].join(", ")).each(function() {
            new n({el: this}).render()
        })
            },renderSticker: function() {
                var a = this.model.getStickerData();
                this.$el.html(this.stickerTemplate({adminAvatar: this.model.adminAvatar(),stickerIdentifier: a.identifier,isAdminPart: this.model.byAdmin(),stickerUrl: "https://js.intercomcdn.com/images/stickers/" + a.assetId + ".png",unicodeSticker: a.unicodeSticker,nativeStickerSupport: d.features.emoji() && !d.features.touchScreen()})), this.renderMetadata()
            },renderAnnouncement: function() {
                this.$el.html(this.announcementTemplate({part: this.model,partBody: i.maybeSubstituteWithSpans(this.model.renderedBody(), "intercom-emoji-sub-icon")}))
            },renderSmallAnnouncement: function() {
                this.$el.html(this.smallAnnouncementTemplate({part: this.model,partBody: i.maybeSubstituteWithSpans(this.model.renderedBody(), "intercom-emoji-sub-icon")}))
            },renderComment: function() {
                var a = this.model.renderedBody();
                this.model.isNew() && (a = this.replaceNewLineWithBreak(a)), this.insertCommentHTML(this.getCommentTemplate(a)), this.hasPendingUploads() ? (this.$el.find(".intercom-upload-remove").click(b.proxy(this.removeUpload, this, this.model, this.$el)), this.uploadPendingUploads()) : this.$(".intercom-attachment-progress-percentage").css({width: "100%"}), this.renderMetadata()
            },renderVideoReply: function() {
                this.$el.html(new m({model: this.model}).render().el), this.renderMetadata()
            },renderMetadata: function() {
                var a;
                this.model.byUser() && (this.failed ? a = c.translate("failed") : this.showSending() && (a = c.translate("sending"))), this.model.isUpload() || this.$(".intercom-comment-metadata-container").append(this.commentMetadataTemplate({commentState: a})), this.$el.toggleClass("intercom-conversation-part-failed", this.failed), this.showCreatedAt() && (this.$(".intercom-comment-metadata").append((new l).render(this.getCreatedAt(), this.model.byUser() ? c.translate("delivered") : void 0).el), this.model.shouldShowAdminSeenState() && this.$(".intercom-comment-metadata").append(this.model.isSeenByAdmin() ? ". " + c.translate("seen") + "." : ". " + c.translate("not-seen-yet") + "."))
            },getCommentTemplate: function(a) {
                return this.model.isUpload() ? this.uploadTemplate({part: this.model,upload: this.model.uploads.first(),showSending: this.showSending(),showFailed: this.failed}) : this.model.bodyIsImage() && 0 === this.model.uploads.length ? this.imageOnlyTemplate({partBody: a,adminAvatar: this.model.adminAvatar(),isAdminPart: this.model.byAdmin()}) : this.commentTemplate({part: this.model,partBody: i.maybeSubstituteWithSpans(a, "intercom-emoji-sub-icon")})
            },insertCommentHTML: function(a) {
                if (this.shouldNotReRenderContent()) {
                    var c = b(a).find(".intercom-comment-metadata-container");
                    this.$(".intercom-comment-metadata-container").replaceWith(c), this.$(".intercom-comment").removeClass("intercom-upload-is-uploading")
                } else
                    this.$el.html(a)
            },shouldNotReRenderContent: function() {
                return this.failed && this.model.isImageUpload() || !this.model.isNew() && this.model.isImageUpload() && !a.isEmpty(this.$el.html())
            },renderLwrComposer: function() {
                this.model.isLwrMessage() ? this.$(".intercom-lwr-composer-container").html(this.lwrComposerView.render().el) : this.lwrComposerView.hide()
            },renderFailed: function() {
                this.failed = !0, this.render()
            },showSending: function() {
                return !this.failed && this.model.isNew()
            },showCreatedAt: function() {
                return !this.failed && !this.model.isNew() && !this.model.isChatAutoMessage()
            },getCreatedAt: function() {
                return this.model.isMessage() ? this.conversation.createdAt() : this.model.createdAt()
            },setUnread: function() {
                this.$el.addClass("intercom-conversation-part-unread")
            },replaceNewLineWithBreak: function(b) {
                return a.isEmpty(b) ? void 0 : (b = b.replace(/^\s+|\s+$/g, "").replace(/(?:\r\n|\r|\n){2,}/g, "</p><p>").replace(/(?:\r\n|\r|\n)/g, "<br>"), b.indexOf("<p>") > 0 && (b = "<p>" + b + "</p>"), b)
            },openLink: function(a) {
                var c = b(a.target).closest("a");
                g.openLinkInNewWindow(c) && a.preventDefault()
            },hasPendingUploads: function() {
                return this.model.uploads.pendingUploads().length > 0
            },uploadPendingUploads: function() {
                this.failed || a.each(this.model.uploads.pendingUploads(), a.bind(function(b) {
                    this.listenTo(b, "upload:progress", this.updateUploadProgress), this.listenTo(b, "upload:error", a.bind(this.errorUploading, this, b)), b.isImage() && this.previewUpload(b), b.upload()
                }, this))
                    },previewUpload: function(a) {
                        this.$("img").attr("src", a.imageData())
                    },stopListeningToUploads: function() {
                        this.stopListening(this.model.uploads), a.each(this.model.uploads, a.bind(function(a) {
                            this.stopListening(a)
                        }, this))
                            },errorUploading: function(a) {
                                a.attributes.public_url || (f.increment("errorUploading"), this.renderFailed())
                            },updateUploadProgress: function(a, b) {
                                var c = parseInt(a / b * 100, 10);
                                this.$(".intercom-attachment-progress-percentage").css({width: c + "%"})
                            },triggerPartSave: function() {
                                this.trigger("part:save")
                            },removeUpload: function(a, b, c) {
                                c.preventDefault(), this.stopListeningToUploads(), this.conversation.parts.remove(this.model), b.slideUp(function() {
                                    b.remove()
                                })
                            },getHeight: function() {
                                return this.$el.outerHeight(!0)
                            },onChange: function() {
                                this.failed = !1, this.render()
                            },onClick: function() {
                                this.failed && (this.failed = !1, this.hasPendingUploads() || this.trigger("retry"), this.render())
                            },onLwrComposerSubmitted: function(a, b) {
                                new j({conversation_id: this.conversation.id,message_id: this.model.id,reply_type: a,reply_option: b}).save(), this.trigger("lwr:submit")
                            }})
}), define("views/powered-by", ["jquery", "underscore", "backbone", "i18n", "template"], function(a, b, c, d, e) {
    "use strict";
    return c.View.extend({template: e.load("powered-by"),className: "intercom-powered-by",initialize: function(a) {
        this.settings = a.settings
    },render: function(a) {
        return a = b.extend(a, {variantText: this.settings.get("app.powered-by-text"),variantId: this.settings.get("app.powered-by-id")}), a.hasVariant = d.isLocaleEnglish() && b.isString(a.variantText), a.hasVariant && (a.variantTerm = a.variantText.toLowerCase().replace(/\s+/g, "-")), this.$el.html(this.template(a)), this
    }})
}), define("views/relative-time", ["jquery", "underscore", "backbone", "time"], function(a, b, c, d) {
    "use strict";
    return c.View.extend({tagName: "span",className: "intercom-relative-time",render: function(a, c) {
        var e = b.bind(function() {
            this.$el.html(d.relativeTimeInWords(a, c))
        }, this);
        return e(), setInterval(e, 1e3), this
    }})
}), define("views/sheet", function() {
    "use strict";
    var a = require("backbone"), b = require("metrics"), c = require("navigation-events");
    return a.View.extend({events: {"click .intercom-sheet-header-conversations-button": "onConversationsClicked","click .intercom-sheet-header-close-button": "onCloseClicked","click .intercom-sheet-header-minimize-button": "onMinimizeClicked"},initialize: function(a) {
        this.settings = a.settings
    },show: function() {
        return this.callback("willShow", arguments), this.$el.addClass("intercom-sheet-active"), this.callback("didShow", arguments), this
    },hide: function() {
        return this.callback("willHide", arguments), this.$el.removeClass("intercom-sheet-active"), this.callback("didHide", arguments), this
    },minimize: function() {
        this.callback("willMinimize", arguments), this.$el.addClass("intercom-sheet-minimized"), this.callback("didMinimize", arguments)
    },maximize: function() {
        this.callback("willMaximize", arguments), this.$el.removeClass("intercom-sheet-minimized"), this.callback("didMaximize", arguments)
    },isMinimized: function() {
        return this.$el.hasClass("intercom-sheet-minimized")
    },isActive: function() {
        return this.$el.hasClass("intercom-sheet-active")
    },getScrollPosition: function() {
        return this.getScrollHeight() - this.getHeight() - this.getScrollTop()
    },getScrollTop: function() {
        return this.$(".intercom-sheet-content").scrollTop()
    },setScrollTop: function(a) {
        return this.$(".intercom-sheet-content").scrollTop(a)
    },getScrollHeight: function() {
        return this.$(".intercom-sheet-content").prop("scrollHeight")
    },getHeight: function() {
        return this.$(".intercom-sheet-content").height()
    },scrollToBottom: function() {
        this.setScrollTop(this.getScrollHeight())
    },callback: function(a, b) {
        var c = this[a];
        void 0 !== c && c.apply(this, b)
    },onCloseClicked: function(a) {
        a.preventDefault(), a.stopPropagation(), c.trigger("click:close"), b.increment("closeClicked")
    },onMinimizeClicked: function(a) {
        a.preventDefault(), a.stopPropagation(), c.trigger("click:minimize"), b.increment("minimizeButtonClicked")
    },onConversationsClicked: function(a) {
        a.preventDefault(), a.stopPropagation(), c.trigger("click:conversations"), b.increment("inboxButtonClicked")
    }})
}), define("views/unread-counter", ["jquery", "underscore", "backbone"], function(a, b, c) {
    "use strict";
    return c.View.extend({className: "intercom-unread-counter",initialize: function() {
        this.listenTo(this.collection, "add change", this.render)
    },render: function() {
        var a = this.collection.unread().size();
        return this.$el.toggleClass("intercom-unread-counter-active", a > 0).text(a), this
    }})
}), define("views/video-reply", function() {
    "use strict";
    var a = require("underscore"), b = require("backbone"), c = require("template");
    return b.View.extend({template: c.load("video-reply-part"),className: "intercom-video-reply-part",events: {"click .intercom-video-reply-controls-playpausebutton": "togglePlayPause","click .intercom-video-reply-controls-mutebutton": "toggleMute","click video": "togglePlayPause","click .intercom-video-reply-controls": "togglePlayPause"},render: function() {
        this.$el.html(this.template({part: this.model,partBody: this.model.renderedBody()}));
        var b = this.video();
        return b.controls = !1, b.addEventListener("timeupdate", a.bind(this.updateProgressBar, this)), this.startPlayback(b), this.updateVideoControls(), this
    },video: function() {
        return a.isUndefined(this._video) && (this._video = this.$("video")[0]), this._video
    },startPlayback: function(b) {
        b.loop = !0, b.muted = !0, b.addEventListener("canplay", a.bind(function() {
            b.play(), this.updateVideoControls()
        }, this)), b.play(), this.updateVideoControls()
    },updateVideoControls: function() {
        var a = this.video();
        this.$(".intercom-video-reply-controls-playpausebutton").toggleClass("intercom-paused", a.paused).toggleClass("intercom-unpaused", !a.paused), this.$(".intercom-video-reply-controls-mutebutton").toggleClass("intercom-muted", a.muted).toggleClass("intercom-unmuted", !a.muted)
    },updateProgressBar: function() {
        var b = this.video(), c = Math.round(100 * (b.currentTime / b.duration)), d = a.template("linear-gradient(to right,white, white <%= percentProgress %>%, rgba(255,255,255,0.5) <%= percentProgress %>%, rgba(255,255,255,0.5) <%= percentProgress %>%)")({percentProgress: c});
        this.$(".intercom-video-reply-controls-progressbar").css("background", d)
    },togglePlayPause: function(a) {
        a.stopPropagation();
        var b = this.video();
        b.paused ? b.play() : b.pause(), this.updateVideoControls()
    },toggleMute: function(a) {
        a.stopPropagation();
        var b = this.video();
        b.muted && !b.paused && (b.currentTime = 0), b.muted = !b.muted, this.updateVideoControls()
    }})
}), define("views/visitor-auto-message-email-collector", function() {
    "use strict";
    var a = require("views/new-anonymous-user"), b = require("views/animations/show-email-collector-confirmation");
    return a.extend({className: "intercom-auto-response intercom-new-anonymous-user",render: function() {
        return this.$el.addClass("intercom-auto-response-active").html(this.template({haveEmail: this.user.hasEmail(),email: this.user.getEmail(),emailCollectorText: "visitor-auto-message-email-collector"})), this.enable(), this
    },isActive: function() {
        return this.$el.is(":visible")
    },enable: function() {
        this.$el.removeClass("intercom-new-anonymous-user-disabled").find('input[type="submit"]').prop("disabled", "disabled")
    },disable: function() {
        this.$el.addClass("intercom-new-anonymous-user-disabled").find("input").prop("disabled", "disabled")
    },insertIntoParentView: function() {
        0 === this.parentView.$(".intercom-new-anonymous-user").length && this.$el.insertAfter(this.parentView.$(".intercom-conversation-part:eq(1)"))
    },playPostSubmitAnimation: function() {
        b(this)
    },removeFromParentView: function() {
        this.$el.remove()
    }})
}), define("views/zoomed-image", function() {
    "use strict";
    var a = require("jquery"), b = require("underscore"), c = require("backbone"), d = require("views/animations/zoomed-image");
    return c.View.extend({className: "intercom-zoomed-image",tagName: "img",padding: 20,initialize: function(b) {
        this.image = b.image, this.$image = a(b.image)
    },render: function() {
        this.$el.attr("src", a(this.image).attr("src")), a(window).on("resize.intercom-image-viewer", b.bind(this.onResize, this));
        var c = window.innerWidth, e = window.innerHeight;
        return this.resize(c, e), this.addPlaceholder(), d.show(this), this
    },resize: function(a, b) {
        var c = a - 2 * this.padding, d = b - 2 * this.padding, e = Math.min(c / this.image.naturalWidth, d / this.image.naturalHeight);
        e > 1 && (e = 1), this.width = this.image.naturalWidth * e, this.height = this.image.naturalHeight * e, this.left = a / 2 - this.width / 2, this.top = b / 2 - this.height / 2, this.$el.css({top: this.top,left: this.left,width: this.width,height: this.height})
    },remove: function() {
        this.stopListening(), a(window).off("resize.intercom-image-viewer"), d.hide(this, b.bind(function() {
            this.removePlaceholder(), this.$el.remove()
        }, this))
    },addPlaceholder: function() {
        this.$placeholder = a("<div/>").addClass("intercom-zoomed-image-placeholder").width(this.$image.width()).height(this.$image.height()), this.$image.hide(), this.$image.parent().append(this.$placeholder)
    },removePlaceholder: function() {
        this.$placeholder.remove(), this.$image.show()
    },onResize: b.throttle(function() {
        var a = window.innerWidth, b = window.innerHeight;
        this.resize(a, b)
    }, 500)})
}), define("visibility", ["exports"], function(a) {
    "use strict";
    var b = require("jquery");
    a.isPageVisible = function() {
        return "undefined" != typeof document.hidden ? !document.hidden : "undefined" != typeof document.mozHidden ? !document.mozHidden : "undefined" != typeof document.msHidden ? !document.msHidden : "undefined" != typeof document.webkitHidden ? !document.webkitHidden : !0
    }, a.onVisible = function(c) {
        var d;
        "undefined" != typeof document.hidden ? d = "visibilitychange" : "undefined" != typeof document.mozHidden ? d = "mozvisibilitychange" : "undefined" != typeof document.msHidden ? d = "msvisibilitychange" : "undefined" != typeof document.webkitHidden && (d = "webkitvisibilitychange"), b(document).on(d, function() {
            a.isPageVisible() && c()
        })
    }
}), define("xhr", ["jquery"], function() {
    "use strict";
    function a() {
        return "function" == typeof window.xdomain && "object" == typeof window.xhook && void 0 !== typeof window.xhook.XMLHttpRequest
    }
    function b() {
        try {
            var b = a() ? window.xhook.XMLHttpRequest : window.XMLHttpRequest;
            return new b
        } catch (c) {
        }
    }
    function c() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP")
        } catch (a) {
        }
    }
    return {createXHR: function() {
        return void 0 !== window.ActiveXObject ? b() || c() : b()
    }}
});
var exports, module, $ = require("jquery"), _ = require("underscore"), Backbone = require("backbone");
$.noConflict(!0), _.noConflict(), Backbone.noConflict(), (void 0 === window.Intercom || window.Intercom.booted !== !0) && (require("boot"), window.Intercom.booted = !0), interop.restore()
}).call(window);
Intercom('boot', {app_id: 'tx2p130c'});
