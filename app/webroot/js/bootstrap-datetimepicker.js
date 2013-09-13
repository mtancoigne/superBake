! function (c) {
	function f() {
		return new Date(Date.UTC.apply(Date, arguments))
	}

	function a() {
		var g = new Date();
		return f(g.getUTCFullYear(), g.getUTCMonth(), g.getUTCDate(), g.getUTCHours(), g.getUTCMinutes(), g.getUTCSeconds(), 0)
	}
	var e = function (h, g) {
		var i = this;
		this.element = c(h);
		this.language = g.language || this.element.data("date-language") || "en";
		this.language = this.language in d ? this.language : "en";
		this.isRTL = d[this.language].rtl || false;
		this.formatType = g.formatType || this.element.data("format-type") || "standard";
		this.format = b.parseFormat(g.format || this.element.data("date-format") || b.getDefaultFormat(this.formatType, "input"), this.formatType);
		this.isInline = false;
		this.isVisible = false;
		this.isInput = this.element.is("input");
		this.component = this.element.is(".date") ? this.element.find(".input-group-addon .icon-th, .input-group-addon .icon-time, .input-group-addon .icon-calendar").parent() : false;
		this.componentReset = this.element.is(".date") ? this.element.find(".input-group-addon .icon-remove").parent() : false;
		this.hasInput = this.component && this.element.find("input").length;
		if (this.component && this.component.length === 0) {
			this.component = false
		}
		this.linkField = g.linkField || this.element.data("link-field") || false;
		this.linkFormat = b.parseFormat(g.linkFormat || this.element.data("link-format") || b.getDefaultFormat(this.formatType, "link"), this.formatType);
		this.minuteStep = g.minuteStep || this.element.data("minute-step") || 5;
		this.pickerPosition = g.pickerPosition || this.element.data("picker-position") || "bottom-right";
		this.showMeridian = g.showMeridian || this.element.data("show-meridian") || false;
		this.initialDate = g.initialDate || new Date();
		this._attachEvents();
		this.formatViewType = "datetime";
		if ("formatViewType" in g) {
			this.formatViewType = g.formatViewType
		} else {
			if ("formatViewType" in this.element.data()) {
				this.formatViewType = this.element.data("formatViewType")
			}
		}
		this.minView = 0;
		if ("minView" in g) {
			this.minView = g.minView
		} else {
			if ("minView" in this.element.data()) {
				this.minView = this.element.data("min-view")
			}
		}
		this.minView = b.convertViewMode(this.minView);
		this.maxView = b.modes.length - 1;
		if ("maxView" in g) {
			this.maxView = g.maxView
		} else {
			if ("maxView" in this.element.data()) {
				this.maxView = this.element.data("max-view")
			}
		}
		this.maxView = b.convertViewMode(this.maxView);
		this.startViewMode = 2;
		if ("startView" in g) {
			this.startViewMode = g.startView
		} else {
			if ("startView" in this.element.data()) {
				this.startViewMode = this.element.data("start-view")
			}
		}
		this.startViewMode = b.convertViewMode(this.startViewMode);
		this.viewMode = this.startViewMode;
		this.viewSelect = this.minView;
		if ("viewSelect" in g) {
			this.viewSelect = g.viewSelect
		} else {
			if ("viewSelect" in this.element.data()) {
				this.viewSelect = this.element.data("view-select")
			}
		}
		this.viewSelect = b.convertViewMode(this.viewSelect);
		this.forceParse = true;
		if ("forceParse" in g) {
			this.forceParse = g.forceParse
		} else {
			if ("dateForceParse" in this.element.data()) {
				this.forceParse = this.element.data("date-force-parse")
			}
		}
		this.picker = c(b.template).appendTo(this.isInline ? this.element : "body").on({
			click: c.proxy(this.click, this),
			mousedown: c.proxy(this.mousedown, this)
		});
		if (this.isInline) {
			this.picker.addClass("datetimepicker-inline")
		} else {
			this.picker.addClass("datetimepicker-dropdown-" + this.pickerPosition + " dropdown-menu")
		} if (this.isRTL) {
			this.picker.addClass("datetimepicker-rtl");
			this.picker.find(".prev i, .next i").toggleClass("icon-arrow-left icon-arrow-right")
		}
		c(document).on("mousedown", function (j) {
			if (c(j.target).closest(".datetimepicker").length === 0) {
				i.hide()
			}
		});
		this.autoclose = false;
		if ("autoclose" in g) {
			this.autoclose = g.autoclose
		} else {
			if ("dateAutoclose" in this.element.data()) {
				this.autoclose = this.element.data("date-autoclose")
			}
		}
		this.keyboardNavigation = true;
		if ("keyboardNavigation" in g) {
			this.keyboardNavigation = g.keyboardNavigation
		} else {
			if ("dateKeyboardNavigation" in this.element.data()) {
				this.keyboardNavigation = this.element.data("date-keyboard-navigation")
			}
		}
		this.todayBtn = (g.todayBtn || this.element.data("date-today-btn") || false);
		this.todayHighlight = (g.todayHighlight || this.element.data("date-today-highlight") || false);
		this.weekStart = ((g.weekStart || this.element.data("date-weekstart") || d[this.language].weekStart || 0) % 7);
		this.weekEnd = ((this.weekStart + 6) % 7);
		this.startDate = -Infinity;
		this.endDate = Infinity;
		this.daysOfWeekDisabled = [];
		this.setStartDate(g.startDate || this.element.data("date-startdate"));
		this.setEndDate(g.endDate || this.element.data("date-enddate"));
		this.setDaysOfWeekDisabled(g.daysOfWeekDisabled || this.element.data("date-days-of-week-disabled"));
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();
		if (this.isInline) {
			this.show()
		}
	};
	e.prototype = {
		constructor: e,
		_events: [],
		_attachEvents: function () {
			this._detachEvents();
			if (this.isInput) {
				this._events = [
					[this.element, {
						focus: c.proxy(this.show, this),
						keyup: c.proxy(this.update, this),
						keydown: c.proxy(this.keydown, this)
					}]
				]
			} else {
				if (this.component && this.hasInput) {
					this._events = [
						[this.element.find("input"), {
							focus: c.proxy(this.show, this),
							keyup: c.proxy(this.update, this),
							keydown: c.proxy(this.keydown, this)
						}],
						[this.component, {
							click: c.proxy(this.show, this)
						}]
					];
					if (this.componentReset) {
						this._events.push([this.componentReset, {
							click: c.proxy(this.reset, this)
						}])
					}
				} else {
					if (this.element.is("div")) {
						this.isInline = true
					} else {
						this._events = [
							[this.element, {
								click: c.proxy(this.show, this)
							}]
						]
					}
				}
			}
			for (var g = 0, h, j; g < this._events.length; g++) {
				h = this._events[g][0];
				j = this._events[g][1];
				h.on(j)
			}
		},
		_detachEvents: function () {
			for (var g = 0, h, j; g < this._events.length; g++) {
				h = this._events[g][0];
				j = this._events[g][1];
				h.off(j)
			}
			this._events = []
		},
		show: function (g) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			if (this.forceParse) {
				this.update()
			}
			this.place();
			c(window).on("resize", c.proxy(this.place, this));
			if (g) {
				g.stopPropagation();
				g.preventDefault()
			}
			this.isVisible = true;
			this.element.trigger({
				type: "show",
				date: this.date
			})
		},
		hide: function (g) {
			if (!this.isVisible) {
				return
			}
			if (this.isInline) {
				return
			}
			this.picker.hide();
			c(window).off("resize", this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				c(document).off("mousedown", this.hide)
			}
			if (this.forceParse && (this.isInput && this.element.val() || this.hasInput && this.element.find("input").val())) {
				this.setValue()
			}
			this.isVisible = false;
			this.element.trigger({
				type: "hide",
				date: this.date
			})
		},
		remove: function () {
			this._detachEvents();
			this.picker.remove();
			delete this.element.data().datetimepicker
		},
		getDate: function () {
			var g = this.getUTCDate();
			return new Date(g.getTime() + (g.getTimezoneOffset() * 60000))
		},
		getUTCDate: function () {
			return this.date
		},
		setDate: function (g) {
			this.setUTCDate(new Date(g.getTime() - (g.getTimezoneOffset() * 60000)))
		},
		setUTCDate: function (g) {
			if (g >= this.startDate && g <= this.endDate) {
				this.date = g;
				this.setValue();
				this.viewDate = this.date;
				this.fill()
			} else {
				this.element.trigger({
					type: "outOfRange",
					date: g,
					startDate: this.startDate,
					endDate: this.endDate
				})
			}
		},
		setFormat: function (h) {
			this.format = b.parseFormat(h, this.formatType);
			var g;
			if (this.isInput) {
				g = this.element
			} else {
				if (this.component) {
					g = this.element.find("input")
				}
			} if (g && g.val()) {
				this.setValue()
			}
		},
		setValue: function () {
			var g = this.getFormattedDate();
			if (!this.isInput) {
				if (this.component) {
					this.element.find("input").val(g)
				}
				this.element.data("date", g)
			} else {
				this.element.val(g)
			} if (this.linkField) {
				c("#" + this.linkField).val(this.getFormattedDate(this.linkFormat))
			}
		},
		getFormattedDate: function (g) {
			if (g == undefined) {
				g = this.format
			}
			return b.formatDate(this.date, g, this.language, this.formatType)
		},
		setStartDate: function (g) {
			this.startDate = g || -Infinity;
			if (this.startDate !== -Infinity) {
				this.startDate = b.parseDate(this.startDate, this.format, this.language, this.formatType)
			}
			this.update();
			this.updateNavArrows()
		},
		setEndDate: function (g) {
			this.endDate = g || Infinity;
			if (this.endDate !== Infinity) {
				this.endDate = b.parseDate(this.endDate, this.format, this.language, this.formatType)
			}
			this.update();
			this.updateNavArrows()
		},
		setDaysOfWeekDisabled: function (g) {
			this.daysOfWeekDisabled = g || [];
			if (!c.isArray(this.daysOfWeekDisabled)) {
				this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/)
			}
			this.daysOfWeekDisabled = c.map(this.daysOfWeekDisabled, function (h) {
				return parseInt(h, 10)
			});
			this.update();
			this.updateNavArrows()
		},
		place: function () {
			if (this.isInline) {
				return
			}
			var j = parseInt(this.element.parents().filter(function () {
				return c(this).css("z-index") != "auto"
			}).first().css("z-index")) + 10;
			var i, h, g;
			if (this.component) {
				i = this.component.offset();
				g = i.left;
				if (this.pickerPosition == "bottom-left" || this.pickerPosition == "top-left") {
					g += this.component.outerWidth() - this.picker.outerWidth()
				}
			} else {
				i = this.element.offset();
				g = i.left
			} if (this.pickerPosition == "top-left" || this.pickerPosition == "top-right") {
				h = i.top - this.picker.outerHeight()
			} else {
				h = i.top + this.height
			}
			this.picker.css({
				top: h,
				left: g,
				zIndex: j
			})
		},
		update: function () {
			var g, h = false;
			if (arguments && arguments.length && (typeof arguments[0] === "string" || arguments[0] instanceof Date)) {
				g = arguments[0];
				h = true
			} else {
				g = this.element.data("date") || (this.isInput ? this.element.val() : this.element.find("input").val()) || this.initialDate
			} if (!g) {
				g = new Date();
				h = false
			}
			this.date = b.parseDate(g, this.format, this.language, this.formatType);
			if (h) {
				this.setValue()
			}
			if (this.date < this.startDate) {
				this.viewDate = new Date(this.startDate)
			} else {
				if (this.date > this.endDate) {
					this.viewDate = new Date(this.endDate)
				} else {
					this.viewDate = new Date(this.date)
				}
			}
			this.fill()
		},
		fillDow: function () {
			var g = this.weekStart,
				h = "<tr>";
			while (g < this.weekStart + 7) {
				h += '<th class="dow">' + d[this.language].daysMin[(g++) % 7] + "</th>"
			}
			h += "</tr>";
			this.picker.find(".datetimepicker-days thead").append(h)
		},
		fillMonths: function () {
			var h = "",
				g = 0;
			while (g < 12) {
				h += '<span class="month">' + d[this.language].monthsShort[g++] + "</span>"
			}
			this.picker.find(".datetimepicker-months td").html(h)
		},
		fill: function () {
			if (this.date == null || this.viewDate == null) {
				return
			}
			var E = new Date(this.viewDate),
				q = E.getUTCFullYear(),
				F = E.getUTCMonth(),
				j = E.getUTCDate(),
				z = E.getUTCHours(),
				u = E.getUTCMinutes(),
				v = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity,
				A = this.startDate !== -Infinity ? this.startDate.getUTCMonth() : -Infinity,
				l = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity,
				w = this.endDate !== Infinity ? this.endDate.getUTCMonth() : Infinity,
				n = (new f(this.date.getUTCFullYear(), this.date.getUTCMonth(), this.date.getUTCDate())).valueOf(),
				D = new Date();
			this.picker.find(".datetimepicker-days thead th:eq(1)").text(d[this.language].months[F] + " " + q);
			if (this.formatViewType == "time") {
				var B = z % 12 ? z % 12 : 12;
				var h = (B < 10 ? "0" : "") + B;
				var m = (u < 10 ? "0" : "") + u;
				var H = d[this.language].meridiem[z < 12 ? 0 : 1];
				this.picker.find(".datetimepicker-hours thead th:eq(1)").text(h + ":" + m + " " + H.toUpperCase());
				this.picker.find(".datetimepicker-minutes thead th:eq(1)").text(h + ":" + m + " " + H.toUpperCase())
			} else {
				this.picker.find(".datetimepicker-hours thead th:eq(1)").text(j + " " + d[this.language].months[F] + " " + q);
				this.picker.find(".datetimepicker-minutes thead th:eq(1)").text(j + " " + d[this.language].months[F] + " " + q)
			}
			this.picker.find("tfoot th.today").text(d[this.language].today).toggle(this.todayBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			var I = f(q, F - 1, 28, 0, 0, 0, 0),
				y = b.getDaysInMonth(I.getUTCFullYear(), I.getUTCMonth());
			I.setUTCDate(y);
			I.setUTCDate(y - (I.getUTCDay() - this.weekStart + 7) % 7);
			var g = new Date(I);
			g.setUTCDate(g.getUTCDate() + 42);
			g = g.valueOf();
			var o = [];
			var r;
			while (I.valueOf() < g) {
				if (I.getUTCDay() == this.weekStart) {
					o.push("<tr>")
				}
				r = "";
				if (I.getUTCFullYear() < q || (I.getUTCFullYear() == q && I.getUTCMonth() < F)) {
					r += " old"
				} else {
					if (I.getUTCFullYear() > q || (I.getUTCFullYear() == q && I.getUTCMonth() > F)) {
						r += " new"
					}
				} if (this.todayHighlight && I.getUTCFullYear() == D.getFullYear() && I.getUTCMonth() == D.getMonth() && I.getUTCDate() == D.getDate()) {
					r += " today"
				}
				if (I.valueOf() == n) {
					r += " active"
				}
				if ((I.valueOf() + 86400000) <= this.startDate || I.valueOf() > this.endDate || c.inArray(I.getUTCDay(), this.daysOfWeekDisabled) !== -1) {
					r += " disabled"
				}
				o.push('<td class="day' + r + '">' + I.getUTCDate() + "</td>");
				if (I.getUTCDay() == this.weekEnd) {
					o.push("</tr>")
				}
				I.setUTCDate(I.getUTCDate() + 1)
			}
			this.picker.find(".datetimepicker-days tbody").empty().append(o.join(""));
			o = [];
			var s = "",
				C = "",
				p = "";
			for (var x = 0; x < 24; x++) {
				var t = f(q, F, j, x);
				r = "";
				if ((t.valueOf() + 3600000) <= this.startDate || t.valueOf() > this.endDate) {
					r += " disabled"
				} else {
					if (z == x) {
						r += " active"
					}
				} if (this.showMeridian && d[this.language].meridiem.length == 2) {
					C = (x < 12 ? d[this.language].meridiem[0] : d[this.language].meridiem[1]);
					if (C != p) {
						if (p != "") {
							o.push("</fieldset>")
						}
						o.push('<fieldset class="hour"><legend>' + C.toUpperCase() + "</legend>")
					}
					p = C;
					s = (x % 12 ? x % 12 : 12);
					o.push('<span class="hour' + r + " hour_" + (x < 12 ? "am" : "pm") + '">' + s + "</span>");
					if (x == 23) {
						o.push("</fieldset>")
					}
				} else {
					s = x + ":00";
					o.push('<span class="hour' + r + '">' + s + "</span>")
				}
			}
			this.picker.find(".datetimepicker-hours td").html(o.join(""));
			o = [];
			s = "", C = "", p = "";
			for (var x = 0; x < 60; x += this.minuteStep) {
				var t = f(q, F, j, z, x, 0);
				r = "";
				if (t.valueOf() < this.startDate || t.valueOf() > this.endDate) {
					r += " disabled"
				} else {
					if (Math.floor(u / this.minuteStep) == Math.floor(x / this.minuteStep)) {
						r += " active"
					}
				} if (this.showMeridian && d[this.language].meridiem.length == 2) {
					C = (z < 12 ? d[this.language].meridiem[0] : d[this.language].meridiem[1]);
					if (C != p) {
						if (p != "") {
							o.push("</fieldset>")
						}
						o.push('<fieldset class="minute"><legend>' + C.toUpperCase() + "</legend>")
					}
					p = C;
					s = (z % 12 ? z % 12 : 12);
					o.push('<span class="minute' + r + '">' + s + ":" + (x < 10 ? "0" + x : x) + "</span>");
					if (x == 59) {
						o.push("</fieldset>")
					}
				} else {
					s = x + ":00";
					o.push('<span class="minute' + r + '">' + z + ":" + (x < 10 ? "0" + x : x) + "</span>")
				}
			}
			this.picker.find(".datetimepicker-minutes td").html(o.join(""));
			var J = this.date.getUTCFullYear();
			var k = this.picker.find(".datetimepicker-months").find("th:eq(1)").text(q).end().find("span").removeClass("active");
			if (J == q) {
				k.eq(this.date.getUTCMonth()).addClass("active")
			}
			if (q < v || q > l) {
				k.addClass("disabled")
			}
			if (q == v) {
				k.slice(0, A).addClass("disabled")
			}
			if (q == l) {
				k.slice(w + 1).addClass("disabled")
			}
			o = "";
			q = parseInt(q / 10, 10) * 10;
			var G = this.picker.find(".datetimepicker-years").find("th:eq(1)").text(q + "-" + (q + 9)).end().find("td");
			q -= 1;
			for (var x = -1; x < 11; x++) {
				o += '<span class="year' + (x == -1 || x == 10 ? " old" : "") + (J == q ? " active" : "") + (q < v || q > l ? " disabled" : "") + '">' + q + "</span>";
				q += 1
			}
			G.html(o);
			this.place()
		},
		updateNavArrows: function () {
			var k = new Date(this.viewDate),
				i = k.getUTCFullYear(),
				j = k.getUTCMonth(),
				h = k.getUTCDate(),
				g = k.getUTCHours();
			switch (this.viewMode) {
			case 0:
				if (this.startDate !== -Infinity && i <= this.startDate.getUTCFullYear() && j <= this.startDate.getUTCMonth() && h <= this.startDate.getUTCDate() && g <= this.startDate.getUTCHours()) {
					this.picker.find(".prev").css({
						visibility: "hidden"
					})
				} else {
					this.picker.find(".prev").css({
						visibility: "visible"
					})
				} if (this.endDate !== Infinity && i >= this.endDate.getUTCFullYear() && j >= this.endDate.getUTCMonth() && h >= this.endDate.getUTCDate() && g >= this.endDate.getUTCHours()) {
					this.picker.find(".next").css({
						visibility: "hidden"
					})
				} else {
					this.picker.find(".next").css({
						visibility: "visible"
					})
				}
				break;
			case 1:
				if (this.startDate !== -Infinity && i <= this.startDate.getUTCFullYear() && j <= this.startDate.getUTCMonth() && h <= this.startDate.getUTCDate()) {
					this.picker.find(".prev").css({
						visibility: "hidden"
					})
				} else {
					this.picker.find(".prev").css({
						visibility: "visible"
					})
				} if (this.endDate !== Infinity && i >= this.endDate.getUTCFullYear() && j >= this.endDate.getUTCMonth() && h >= this.endDate.getUTCDate()) {
					this.picker.find(".next").css({
						visibility: "hidden"
					})
				} else {
					this.picker.find(".next").css({
						visibility: "visible"
					})
				}
				break;
			case 2:
				if (this.startDate !== -Infinity && i <= this.startDate.getUTCFullYear() && j <= this.startDate.getUTCMonth()) {
					this.picker.find(".prev").css({
						visibility: "hidden"
					})
				} else {
					this.picker.find(".prev").css({
						visibility: "visible"
					})
				} if (this.endDate !== Infinity && i >= this.endDate.getUTCFullYear() && j >= this.endDate.getUTCMonth()) {
					this.picker.find(".next").css({
						visibility: "hidden"
					})
				} else {
					this.picker.find(".next").css({
						visibility: "visible"
					})
				}
				break;
			case 3:
			case 4:
				if (this.startDate !== -Infinity && i <= this.startDate.getUTCFullYear()) {
					this.picker.find(".prev").css({
						visibility: "hidden"
					})
				} else {
					this.picker.find(".prev").css({
						visibility: "visible"
					})
				} if (this.endDate !== Infinity && i >= this.endDate.getUTCFullYear()) {
					this.picker.find(".next").css({
						visibility: "hidden"
					})
				} else {
					this.picker.find(".next").css({
						visibility: "visible"
					})
				}
				break
			}
		},
		click: function (k) {
			k.stopPropagation();
			k.preventDefault();
			var l = c(k.target).closest("span, td, th, legend");
			if (l.length == 1) {
				if (l.is(".disabled")) {
					this.element.trigger({
						type: "outOfRange",
						date: this.viewDate,
						startDate: this.startDate,
						endDate: this.endDate
					});
					return
				}
				switch (l[0].nodeName.toLowerCase()) {
				case "th":
					switch (l[0].className) {
					case "switch":
						this.showMode(1);
						break;
					case "prev":
					case "next":
						var g = b.modes[this.viewMode].navStep * (l[0].className == "prev" ? -1 : 1);
						switch (this.viewMode) {
						case 0:
							this.viewDate = this.moveHour(this.viewDate, g);
							break;
						case 1:
							this.viewDate = this.moveDate(this.viewDate, g);
							break;
						case 2:
							this.viewDate = this.moveMonth(this.viewDate, g);
							break;
						case 3:
						case 4:
							this.viewDate = this.moveYear(this.viewDate, g);
							break
						}
						this.fill();
						break;
					case "today":
						var h = new Date();
						h = f(h.getFullYear(), h.getMonth(), h.getDate(), h.getHours(), h.getMinutes(), h.getSeconds(), 0);
						this.viewMode = this.startViewMode;
						this.showMode(0);
						this._setDate(h);
						this.fill();
						if (this.autoclose) {
							this.hide()
						}
						break
					}
					break;
				case "span":
					if (!l.is(".disabled")) {
						var n = this.viewDate.getUTCFullYear(),
							m = this.viewDate.getUTCMonth(),
							o = this.viewDate.getUTCDate(),
							p = this.viewDate.getUTCHours(),
							i = this.viewDate.getUTCMinutes(),
							q = this.viewDate.getUTCSeconds();
						if (l.is(".month")) {
							this.viewDate.setUTCDate(1);
							m = l.parent().find("span").index(l);
							o = this.viewDate.getUTCDate();
							this.viewDate.setUTCMonth(m);
							this.element.trigger({
								type: "changeMonth",
								date: this.viewDate
							});
							if (this.viewSelect >= 3) {
								this._setDate(f(n, m, o, p, i, q, 0))
							}
						} else {
							if (l.is(".year")) {
								this.viewDate.setUTCDate(1);
								n = parseInt(l.text(), 10) || 0;
								this.viewDate.setUTCFullYear(n);
								this.element.trigger({
									type: "changeYear",
									date: this.viewDate
								});
								if (this.viewSelect >= 4) {
									this._setDate(f(n, m, o, p, i, q, 0))
								}
							} else {
								if (l.is(".hour")) {
									p = parseInt(l.text(), 10) || 0;
									if (l.hasClass("hour_am") || l.hasClass("hour_pm")) {
										if (p == 12 && l.hasClass("hour_am")) {
											p = 0
										} else {
											if (p != 12 && l.hasClass("hour_pm")) {
												p += 12
											}
										}
									}
									this.viewDate.setUTCHours(p);
									this.element.trigger({
										type: "changeHour",
										date: this.viewDate
									});
									if (this.viewSelect >= 1) {
										this._setDate(f(n, m, o, p, i, q, 0))
									}
								} else {
									if (l.is(".minute")) {
										i = parseInt(l.text().substr(l.text().indexOf(":") + 1), 10) || 0;
										this.viewDate.setUTCMinutes(i);
										this.element.trigger({
											type: "changeMinute",
											date: this.viewDate
										});
										if (this.viewSelect >= 0) {
											this._setDate(f(n, m, o, p, i, q, 0))
										}
									}
								}
							}
						} if (this.viewMode != 0) {
							var j = this.viewMode;
							this.showMode(-1);
							this.fill();
							if (j == this.viewMode && this.autoclose) {
								this.hide()
							}
						} else {
							this.fill();
							if (this.autoclose) {
								this.hide()
							}
						}
					}
					break;
				case "td":
					if (l.is(".day") && !l.is(".disabled")) {
						var o = parseInt(l.text(), 10) || 1;
						var n = this.viewDate.getUTCFullYear(),
							m = this.viewDate.getUTCMonth(),
							p = this.viewDate.getUTCHours(),
							i = this.viewDate.getUTCMinutes(),
							q = this.viewDate.getUTCSeconds();
						if (l.is(".old")) {
							if (m === 0) {
								m = 11;
								n -= 1
							} else {
								m -= 1
							}
						} else {
							if (l.is(".new")) {
								if (m == 11) {
									m = 0;
									n += 1
								} else {
									m += 1
								}
							}
						}
						this.viewDate.setUTCFullYear(n);
						this.viewDate.setUTCMonth(m);
						this.viewDate.setUTCDate(o);
						this.element.trigger({
							type: "changeDay",
							date: this.viewDate
						});
						if (this.viewSelect >= 2) {
							this._setDate(f(n, m, o, p, i, q, 0))
						}
					}
					var j = this.viewMode;
					this.showMode(-1);
					this.fill();
					if (j == this.viewMode && this.autoclose) {
						this.hide()
					}
					break
				}
			}
		},
		_setDate: function (g, i) {
			if (!i || i == "date") {
				this.date = g
			}
			if (!i || i == "view") {
				this.viewDate = g
			}
			this.fill();
			this.setValue();
			var h;
			if (this.isInput) {
				h = this.element
			} else {
				if (this.component) {
					h = this.element.find("input")
				}
			} if (h) {
				h.change();
				if (this.autoclose && (!i || i == "date")) {}
			}
			this.element.trigger({
				type: "changeDate",
				date: this.date
			})
		},
		moveMinute: function (h, g) {
			if (!g) {
				return h
			}
			var i = new Date(h.valueOf());
			i.setUTCMinutes(i.getUTCMinutes() + (g * this.minuteStep));
			return i
		},
		moveHour: function (h, g) {
			if (!g) {
				return h
			}
			var i = new Date(h.valueOf());
			i.setUTCHours(i.getUTCHours() + g);
			return i
		},
		moveDate: function (h, g) {
			if (!g) {
				return h
			}
			var i = new Date(h.valueOf());
			i.setUTCDate(i.getUTCDate() + g);
			return i
		},
		moveMonth: function (g, h) {
			if (!h) {
				return g
			}
			var l = new Date(g.valueOf()),
				p = l.getUTCDate(),
				m = l.getUTCMonth(),
				k = Math.abs(h),
				o, n;
			h = h > 0 ? 1 : -1;
			if (k == 1) {
				n = h == -1 ? function () {
					return l.getUTCMonth() == m
				} : function () {
					return l.getUTCMonth() != o
				};
				o = m + h;
				l.setUTCMonth(o);
				if (o < 0 || o > 11) {
					o = (o + 12) % 12
				}
			} else {
				for (var j = 0; j < k; j++) {
					l = this.moveMonth(l, h)
				}
				o = l.getUTCMonth();
				l.setUTCDate(p);
				n = function () {
					return o != l.getUTCMonth()
				}
			}
			while (n()) {
				l.setUTCDate(--p);
				l.setUTCMonth(o)
			}
			return l
		},
		moveYear: function (h, g) {
			return this.moveMonth(h, g * 12)
		},
		dateWithinRange: function (g) {
			return g >= this.startDate && g <= this.endDate
		},
		keydown: function (k) {
			if (this.picker.is(":not(:visible)")) {
				if (k.keyCode == 27) {
					this.show()
				}
				return
			}
			var m = false,
				h, n, l, o, g;
			switch (k.keyCode) {
			case 27:
				this.hide();
				k.preventDefault();
				break;
			case 37:
			case 39:
				if (!this.keyboardNavigation) {
					break
				}
				h = k.keyCode == 37 ? -1 : 1;
				viewMode = this.viewMode;
				if (k.ctrlKey) {
					viewMode += 2
				} else {
					if (k.shiftKey) {
						viewMode += 1
					}
				} if (viewMode == 4) {
					o = this.moveYear(this.date, h);
					g = this.moveYear(this.viewDate, h)
				} else {
					if (viewMode == 3) {
						o = this.moveMonth(this.date, h);
						g = this.moveMonth(this.viewDate, h)
					} else {
						if (viewMode == 2) {
							o = this.moveDate(this.date, h);
							g = this.moveDate(this.viewDate, h)
						} else {
							if (viewMode == 1) {
								o = this.moveHour(this.date, h);
								g = this.moveHour(this.viewDate, h)
							} else {
								if (viewMode == 0) {
									o = this.moveMinute(this.date, h);
									g = this.moveMinute(this.viewDate, h)
								}
							}
						}
					}
				} if (this.dateWithinRange(o)) {
					this.date = o;
					this.viewDate = g;
					this.setValue();
					this.update();
					k.preventDefault();
					m = true
				}
				break;
			case 38:
			case 40:
				if (!this.keyboardNavigation) {
					break
				}
				h = k.keyCode == 38 ? -1 : 1;
				viewMode = this.viewMode;
				if (k.ctrlKey) {
					viewMode += 2
				} else {
					if (k.shiftKey) {
						viewMode += 1
					}
				} if (viewMode == 4) {
					o = this.moveYear(this.date, h);
					g = this.moveYear(this.viewDate, h)
				} else {
					if (viewMode == 3) {
						o = this.moveMonth(this.date, h);
						g = this.moveMonth(this.viewDate, h)
					} else {
						if (viewMode == 2) {
							o = this.moveDate(this.date, h * 7);
							g = this.moveDate(this.viewDate, h * 7)
						} else {
							if (viewMode == 1) {
								if (this.showMeridian) {
									o = this.moveHour(this.date, h * 6);
									g = this.moveHour(this.viewDate, h * 6)
								} else {
									o = this.moveHour(this.date, h * 4);
									g = this.moveHour(this.viewDate, h * 4)
								}
							} else {
								if (viewMode == 0) {
									o = this.moveMinute(this.date, h * 4);
									g = this.moveMinute(this.viewDate, h * 4)
								}
							}
						}
					}
				} if (this.dateWithinRange(o)) {
					this.date = o;
					this.viewDate = g;
					this.setValue();
					this.update();
					k.preventDefault();
					m = true
				}
				break;
			case 13:
				if (this.viewMode != 0) {
					var j = this.viewMode;
					this.showMode(-1);
					this.fill();
					if (j == this.viewMode && this.autoclose) {
						this.hide()
					}
				} else {
					this.fill();
					if (this.autoclose) {
						this.hide()
					}
				}
				k.preventDefault();
				break;
			case 9:
				this.hide();
				break
			}
			if (m) {
				var i;
				if (this.isInput) {
					i = this.element
				} else {
					if (this.component) {
						i = this.element.find("input")
					}
				} if (i) {
					i.change()
				}
				this.element.trigger({
					type: "changeDate",
					date: this.date
				})
			}
		},
		showMode: function (g) {
			if (g) {
				var h = Math.max(0, Math.min(b.modes.length - 1, this.viewMode + g));
				if (h >= this.minView && h <= this.maxView) {
					this.element.trigger({
						type: "changeMode",
						date: this.viewDate,
						oldViewMode: this.viewMode,
						newViewMode: h
					});
					this.viewMode = h
				}
			}
			this.picker.find(">div").hide().filter(".datetimepicker-" + b.modes[this.viewMode].clsName).css("display", "block");
			this.updateNavArrows()
		},
		reset: function (g) {
			this._setDate(null, "date")
		}
	};
	c.fn.datetimepicker = function (h) {
		var g = Array.apply(null, arguments);
		g.shift();
		return this.each(function () {
			var k = c(this),
				j = k.data("datetimepicker"),
				i = typeof h == "object" && h;
			if (!j) {
				k.data("datetimepicker", (j = new e(this, c.extend({}, c.fn.datetimepicker.defaults, i))))
			}
			if (typeof h == "string" && typeof j[h] == "function") {
				j[h].apply(j, g)
			}
		})
	};
	c.fn.datetimepicker.defaults = {};
	c.fn.datetimepicker.Constructor = e;
	var d = c.fn.datetimepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
			daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
			daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
			months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
			meridiem: ["am", "pm"],
			suffix: ["st", "nd", "rd", "th"],
			today: "Today"
		}
	};
	var b = {
		modes: [{
			clsName: "minutes",
			navFnc: "Hours",
			navStep: 1
		}, {
			clsName: "hours",
			navFnc: "Date",
			navStep: 1
		}, {
			clsName: "days",
			navFnc: "Month",
			navStep: 1
		}, {
			clsName: "months",
			navFnc: "FullYear",
			navStep: 1
		}, {
			clsName: "years",
			navFnc: "FullYear",
			navStep: 10
		}],
		isLeapYear: function (g) {
			return (((g % 4 === 0) && (g % 100 !== 0)) || (g % 400 === 0))
		},
		getDaysInMonth: function (g, h) {
			return [31, (b.isLeapYear(g) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][h]
		},
		getDefaultFormat: function (g, h) {
			if (g == "standard") {
				if (h == "input") {
					return "yyyy-mm-dd hh:ii"
				} else {
					return "yyyy-mm-dd hh:ii:ss"
				}
			} else {
				if (g == "php") {
					if (h == "input") {
						return "Y-m-d H:i"
					} else {
						return "Y-m-d H:i:s"
					}
				} else {
					throw new Error("Invalid format type.")
				}
			}
		},
		validParts: function (g) {
			if (g == "standard") {
				return /hh?|HH?|p|P|ii?|ss?|dd?|DD?|mm?|MM?|yy(?:yy)?/g
			} else {
				if (g == "php") {
					return /[dDjlNwzFmMnStyYaABgGhHis]/g
				} else {
					throw new Error("Invalid format type.")
				}
			}
		},
		nonpunctuation: /[^ -\/:-@\[-`{-~\t\n\rTZ]+/g,
		parseFormat: function (j, h) {
			var g = j.replace(this.validParts(h), "\0").split("\0"),
				i = j.match(this.validParts(h));
			if (!g || !g.length || !i || i.length == 0) {
				throw new Error("Invalid date format.")
			}
			return {
				separators: g,
				parts: i
			}
		},
		parseDate: function (l, u, o, r) {
			if (l instanceof Date) {
				var w = new Date(l.valueOf() - l.getTimezoneOffset() * 60000);
				w.setMilliseconds(0);
				return w
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}$/.test(l)) {
				u = this.parseFormat("yyyy-mm-dd", r)
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}$/.test(l)) {
				u = this.parseFormat("yyyy-mm-dd hh:ii", r)
			}
			if (/^\d{4}\-\d{1,2}\-\d{1,2}[T ]\d{1,2}\:\d{1,2}\:\d{1,2}[Z]{0,1}$/.test(l)) {
				u = this.parseFormat("yyyy-mm-dd hh:ii:ss", r)
			}
			if (/^[-+]\d+[dmwy]([\s,]+[-+]\d+[dmwy])*$/.test(l)) {
				var x = /([-+]\d+)([dmwy])/,
					m = l.match(/([-+]\d+)([dmwy])/g),
					g, k;
				l = new Date();
				for (var n = 0; n < m.length; n++) {
					g = x.exec(m[n]);
					k = parseInt(g[1]);
					switch (g[2]) {
					case "d":
						l.setUTCDate(l.getUTCDate() + k);
						break;
					case "m":
						l = e.prototype.moveMonth.call(e.prototype, l, k);
						break;
					case "w":
						l.setUTCDate(l.getUTCDate() + k * 7);
						break;
					case "y":
						l = e.prototype.moveYear.call(e.prototype, l, k);
						break
					}
				}
				return f(l.getUTCFullYear(), l.getUTCMonth(), l.getUTCDate(), l.getUTCHours(), l.getUTCMinutes(), l.getUTCSeconds(), 0)
			}
			var m = l && l.match(this.nonpunctuation) || [],
				l = new Date(0, 0, 0, 0, 0, 0, 0),
				q = {}, t = ["hh", "h", "ii", "i", "ss", "s", "yyyy", "yy", "M", "MM", "m", "mm", "D", "DD", "d", "dd", "H", "HH", "p", "P"],
				v = {
					hh: function (s, i) {
						return s.setUTCHours(i)
					},
					h: function (s, i) {
						return s.setUTCHours(i)
					},
					HH: function (s, i) {
						return s.setUTCHours(i == 12 ? 0 : i)
					},
					H: function (s, i) {
						return s.setUTCHours(i == 12 ? 0 : i)
					},
					ii: function (s, i) {
						return s.setUTCMinutes(i)
					},
					i: function (s, i) {
						return s.setUTCMinutes(i)
					},
					ss: function (s, i) {
						return s.setUTCSeconds(i)
					},
					s: function (s, i) {
						return s.setUTCSeconds(i)
					},
					yyyy: function (s, i) {
						return s.setUTCFullYear(i)
					},
					yy: function (s, i) {
						return s.setUTCFullYear(2000 + i)
					},
					m: function (s, i) {
						i -= 1;
						while (i < 0) {
							i += 12
						}
						i %= 12;
						s.setUTCMonth(i);
						while (s.getUTCMonth() != i) {
							s.setUTCDate(s.getUTCDate() - 1)
						}
						return s
					},
					d: function (s, i) {
						return s.setUTCDate(i)
					},
					p: function (s, i) {
						return s.setUTCHours(i == 1 ? s.getUTCHours() + 12 : s.getUTCHours())
					}
				}, j, p, g;
			v.M = v.MM = v.mm = v.m;
			v.dd = v.d;
			v.P = v.p;
			l = f(l.getFullYear(), l.getMonth(), l.getDate(), l.getHours(), l.getMinutes(), l.getSeconds());
			if (m.length == u.parts.length) {
				for (var n = 0, h = u.parts.length; n < h; n++) {
					j = parseInt(m[n], 10);
					g = u.parts[n];
					if (isNaN(j)) {
						switch (g) {
						case "MM":
							p = c(d[o].months).filter(function () {
								var i = this.slice(0, m[n].length),
									s = m[n].slice(0, i.length);
								return i == s
							});
							j = c.inArray(p[0], d[o].months) + 1;
							break;
						case "M":
							p = c(d[o].monthsShort).filter(function () {
								var i = this.slice(0, m[n].length),
									s = m[n].slice(0, i.length);
								return i == s
							});
							j = c.inArray(p[0], d[o].monthsShort) + 1;
							break;
						case "p":
						case "P":
							j = c.inArray(m[n].toLowerCase(), d[o].meridiem);
							break
						}
					}
					q[g] = j
				}
				for (var n = 0, y; n < t.length; n++) {
					y = t[n];
					if (y in q && !isNaN(q[y])) {
						v[y](l, q[y])
					}
				}
			}
			return l
		},
		formatDate: function (g, m, o, k) {
			if (g == null) {
				return ""
			}
			var n;
			if (k == "standard") {
				n = {
					yy: g.getUTCFullYear().toString().substring(2),
					yyyy: g.getUTCFullYear(),
					m: g.getUTCMonth() + 1,
					M: d[o].monthsShort[g.getUTCMonth()],
					MM: d[o].months[g.getUTCMonth()],
					d: g.getUTCDate(),
					D: d[o].daysShort[g.getUTCDay()],
					DD: d[o].days[g.getUTCDay()],
					p: (d[o].meridiem.length == 2 ? d[o].meridiem[g.getUTCHours() < 12 ? 0 : 1] : ""),
					h: g.getUTCHours(),
					i: g.getUTCMinutes(),
					s: g.getUTCSeconds()
				};
				n.H = (n.h % 12 == 0 ? 12 : n.h % 12);
				n.HH = (n.H < 10 ? "0" : "") + n.H;
				n.P = n.p.toUpperCase();
				n.hh = (n.h < 10 ? "0" : "") + n.h;
				n.ii = (n.i < 10 ? "0" : "") + n.i;
				n.ss = (n.s < 10 ? "0" : "") + n.s;
				n.dd = (n.d < 10 ? "0" : "") + n.d;
				n.mm = (n.m < 10 ? "0" : "") + n.m
			} else {
				if (k == "php") {
					n = {
						y: g.getUTCFullYear().toString().substring(2),
						Y: g.getUTCFullYear(),
						F: d[o].months[g.getUTCMonth()],
						M: d[o].monthsShort[g.getUTCMonth()],
						n: g.getUTCMonth() + 1,
						t: b.getDaysInMonth(g.getUTCFullYear(), g.getUTCMonth()),
						j: g.getUTCDate(),
						l: d[o].days[g.getUTCDay()],
						D: d[o].daysShort[g.getUTCDay()],
						w: g.getUTCDay(),
						N: (g.getUTCDay() == 0 ? 7 : g.getUTCDay()),
						S: (g.getUTCDate() % 10 <= d[o].suffix.length ? d[o].suffix[g.getUTCDate() % 10 - 1] : ""),
						a: (d[o].meridiem.length == 2 ? d[o].meridiem[g.getUTCHours() < 12 ? 0 : 1] : ""),
						g: (g.getUTCHours() % 12 == 0 ? 12 : g.getUTCHours() % 12),
						G: g.getUTCHours(),
						i: g.getUTCMinutes(),
						s: g.getUTCSeconds()
					};
					n.m = (n.n < 10 ? "0" : "") + n.n;
					n.d = (n.j < 10 ? "0" : "") + n.j;
					n.A = n.a.toString().toUpperCase();
					n.h = (n.g < 10 ? "0" : "") + n.g;
					n.H = (n.G < 10 ? "0" : "") + n.G;
					n.i = (n.i < 10 ? "0" : "") + n.i;
					n.s = (n.s < 10 ? "0" : "") + n.s
				} else {
					throw new Error("Invalid format type.")
				}
			}
			var g = [],
				l = c.extend([], m.separators);
			for (var j = 0, h = m.parts.length; j < h; j++) {
				if (l.length) {
					g.push(l.shift())
				}
				g.push(n[m.parts[j]])
			}
			return g.join("")
		},
		convertViewMode: function (g) {
			switch (g) {
			case 4:
			case "decade":
				g = 4;
				break;
			case 3:
			case "year":
				g = 3;
				break;
			case 2:
			case "month":
				g = 2;
				break;
			case 1:
			case "day":
				g = 1;
				break;
			case 0:
			case "hour":
				g = 0;
				break
			}
			return g
		},
		headTemplate: '<thead><tr><th class="prev"><i class="icon-arrow-left"/></th><th colspan="5" class="switch"></th><th class="next"><i class="icon-arrow-right"/></th></tr></thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'
	};
	b.template = '<div class="datetimepicker"><div class="datetimepicker-minutes"><table class="table-condensed">' + b.headTemplate + b.contTemplate + b.footTemplate + '</table></div><div class="datetimepicker-hours"><table class="table-condensed">' + b.headTemplate + b.contTemplate + b.footTemplate + '</table></div><div class="datetimepicker-days"><table class="table-condensed">' + b.headTemplate + "<tbody></tbody>" + b.footTemplate + '</table></div><div class="datetimepicker-months"><table class="table-condensed">' + b.headTemplate + b.contTemplate + b.footTemplate + '</table></div><div class="datetimepicker-years"><table class="table-condensed">' + b.headTemplate + b.contTemplate + b.footTemplate + "</table></div></div>";
	c.fn.datetimepicker.DPGlobal = b;
	c.fn.datetimepicker.noConflict = function () {
		c.fn.datetimepicker = old;
		return this
	};
	c(document).on("focus.datetimepicker.data-api click.datetimepicker.data-api", '[data-provide="datetimepicker"]', function (h) {
		var g = c(this);
		if (g.data("datetimepicker")) {
			return
		}
		h.preventDefault();
		g.datetimepicker("show")
	});
	c(function () {
		c('[data-provide="datetimepicker-inline"]').datetimepicker()
	})
}(window.jQuery);