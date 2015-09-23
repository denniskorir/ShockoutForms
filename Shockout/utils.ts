﻿module Shockout {

    interface ICurrencyFormat {
        pos: string;
        neg: string;
        zero: string;
    }
    
    export class Utils {
    
        public static toCamelCase(str: string): string {
            return str.toString()
                .replace(/[^A-Za-z0-9\s]/g, '')
                .replace(/\s[A-Za-z]/g, function (x) {
                    return x[1].toUpperCase();
                });
        }

        /**
        * Parse a form ID from window.location.hash
        * @return number
        */
        public static getIdFromHash(): number {
            // example: parse ID from a URI `http://<mysite>/Forms/form.aspx/#/id/1`
            var rxHash: RegExp = /\/id\/\d+/i;
            var exec: Array<any> = rxHash.exec(window.location.hash);
            var id: any = !!exec ? exec[0].replace(/\D/g, '') : null;
            return /\d/.test(id) ? parseInt(id) : null;
        }

        public static setIdHash(id: number): void {
            window.location.hash = '#/id/' + id;
        }

        /** 
        * Escape column values
        * http://dracoblue.net/dev/encodedecode-special-xml-characters-in-javascript/155/ 
        */
        public static escapeColumnValue(s): any {
            if (typeof s === "string") {
                return s.replace(/&(?![a-zA-Z]{1,8};)/g, "&amp;");
            } else {
                return s;
            }
        }

        /**
        * Extract the Knockout observable name from a field with `data-bind` attribute
        * @param control: HTMLElement
        * @return string
        */
        public static observableNameFromControl(control: any): string {
            var attr: string = $(control).attr('data-bind');
            if (!!!attr) { return null; }
            attr = attr.replace(/\$/g, '');
            var rx: RegExp = /(\b:(\s+|)|\$root.)\w*\b/;
            var exec: Array<string> = rx.exec(attr);
            var result: string = !!exec ? exec[0].replace(/:(\s+|)/gi, '').replace(/\$root\./, '').replace(/\._metadata/, '').replace(/\s/g, '') : null;
            if (result == 'parent') {
                return Utils.observableNameFromControl( $(control).parent() );
            }
            return result;
        }

        public static koNameFromControl = Utils.observableNameFromControl;

        public static parseDate(d: any): Date {
            if (Utils.isJsonDateTicks(d)) {
                return Utils.parseJsonDate(d);
            }
            else if (Utils.isIsoDateString(d)) {
                return Utils.parseIsoDate(d);
            }
            return null;
        }

        public static parseJsonDate(d: any): Date {
            if (!Utils.isJsonDateTicks(d)) { return null; }
            return new Date(parseInt(d.replace(/\D/g, '')));
        }

        public static parseIsoDate(d: any): Date {
            if (!Utils.isIsoDateString(d)) { return null; }
            return new Date(d);
        }

        public static isJsonDateTicks(val: any): boolean {
            // `/Date(1442769001000)/`
            if (!!!val) { return false; }
            return /\/Date\(\d+\)\//.test(val+'');
        }

        public static isIsoDateString(val: any) {
            // `2015-09-23T16:21:24Z`
            if (!!!val) { return false; }
            return /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z/.test(val + '');
        }

        public static getQueryParam(p): string {
            var escape: Function = window["escape"], unescape: Function = window["unescape"];
            p = escape(unescape(p));
            var regex = new RegExp("[?&]" + p + "(?:=([^&]*))?", "i");
            var match = regex.exec(window.location.search);
            return match != null ? match[1] : null;
        }

        // https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/The_structured_clone_algorithm
        public static clone(objectToBeCloned): any {
            // Basis.
            if (!(objectToBeCloned instanceof Object)) {
                return objectToBeCloned;
            }

            var objectClone;
  
            // Filter out special objects.
            var Constructor = objectToBeCloned.constructor;
            switch (Constructor) {
                // Implement other special objects here.
                case RegExp:
                    objectClone = new Constructor(objectToBeCloned);
                    break;
                case Date:
                    objectClone = new Constructor(objectToBeCloned.getTime());
                    break;
                default:
                    objectClone = new Constructor();
            }
  
            // Clone each property.
            for (var prop in objectToBeCloned) {
                objectClone[prop] = this.clone(objectToBeCloned[prop]);
            }

            return objectClone;
        }

        public static logError(msg: string, errorLogListName: string, siteUrl: string = '', debug: boolean = false): void {
            if (debug) {
                console.warn(msg);
                return;
            }

            var loc = window.location.href;
            var errorMsg = '<p>An error occurred at <a href="' + loc + '" target="_blank">' + loc + '</a></p><p>Message: ' + msg + '</p>';

            $.ajax({
                url: siteUrl + "/_vti_bin/listdata.svc/" + errorLogListName.replace(/\s/g, ''),
                type: "POST",
                processData: false,
                contentType: "application/json;odata=verbose",
                data: JSON.stringify({ "Title": "Web Form Error", "Error": errorMsg }),
                headers: {
                    "Accept": "application/json;odata=verbose"
                },
                success: function () {
                    
                },
                error: function (data) {
                    throw data.responseJSON.error;
                }
            });
        }

        /* update a KO observable whether it's an update or text field */
        public static updateKoField(el: HTMLElement, val: any): void {
            if (el.tagName.toLowerCase() == "input") {
                $(el).val(val);
            } else {
                $(el).html(val);
            }
        }

        //validate format ID;#UserName
        public static validateSpPerson(person: string): boolean {
            return person != null && person.toString().match(/^\d*;#/) != null;
        }

        public static isTime(val: string): boolean {
            if (!!!val) { return false; }
            var rx = new RegExp("\\d{1,2}:\\d{2}\\s{0,1}(AM|PM)");
            return rx.test(val);
        }

        public static isDate(val: string): boolean {
            if (!!!val) { return false; }
            var rx = new RegExp("\\d{1,2}\/\\d{1,2}\/\\d{4}");
            return rx.test(val.toString());
        }

        public static dateToLocaleString(d: Date): string {
            try {
                var dd: any = d.getUTCDate();
                dd = dd < 10 ? "0" + dd : dd;
                var mo: any = d.getUTCMonth() + 1;
                mo = mo < 10 ? "0" + mo : mo;
                return mo + '/' + dd + '/' + d.getUTCFullYear();
            }
            catch (e) {
                return 'Invalid Date';
            }
        }

        public static toTimeLocaleObject(d: Date): any {
            var hours: number = 0;
            var minutes: any;
            var tt: string;

            hours = d.getUTCHours();
            minutes = d.getUTCMinutes();
            tt = hours > 11 ? 'PM' : 'AM';

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (hours > 12) {
                hours -= 12;
            }

            return {
                hours: hours,
                minutes: minutes,
                tt: tt
            };
        }

        public static toTimeLocaleString(d): string {
            var str = '12:00 AM';
            var hours = d.getUTCHours();
            var minutes = d.getUTCMinutes();
            var tt = hours > 11 ? 'PM' : 'AM';

            if (minutes < 10) {
                minutes = '0' + minutes;
            }

            if (hours > 12) {
                hours -= 12;
            }
            else if (hours == 0) {
                hours = 12;
            }

            return hours + ':' + minutes + ' ' + tt;
        }

        public static toDateTimeLocaleString(d):string {
            var time = Utils.toTimeLocaleString(d);
            return Utils.dateToLocaleString(d) + ' ' + time;
        }

        /**
        * Addapted from accounting.js library. http://josscrowcroft.github.com/accounting.js/
        * Format a number into currency
        *
        * Usage: accounting.formatMoney(number, symbol, precision, thousandsSep, decimalSep, format)
        * defaults: (0, "$", 2, ",", ".", "%s%v")
        *
        * Localise by overriding the symbol, precision, thousand / decimal separators and format
        * Second param can be an object matching `settings.currency` which is the easiest way.
        *
        * To do: tidy up the parameters
        */
        public static formatMoney(value: any, symbol: string = '$', precision: number = 2): string {
            // Clean up number:
            var num: number = Utils.unformatNumber(value),
                format: string = '%s%v',
                neg: string = format.replace('%v', '-%v'),
                useFormat: string = num > 0 ? format : num < 0 ? neg : format, // Choose which format to use for this value:
                numFormat: string = Utils.formatNumber(Math.abs(num), Utils.checkPrecision(precision))
            ;

            // Return with currency symbol added:
            return useFormat
                .replace('%s', symbol)
                .replace('%v', numFormat);
        }

        /**
        * Addapted from accounting.js library. http://josscrowcroft.github.com/accounting.js/
        * Takes a string/array of strings, removes all formatting/cruft and returns the raw float value
        * alias: accounting.`parse(string)`
        *
        * Decimal must be included in the regular expression to match floats (defaults to
        * accounting.settings.number.decimal), so if the number uses a non-standard decimal 
        * separator, provide it as the second argument.
        *
        * Also matches bracketed negatives (eg. "$ (1.99)" => -1.99)
        *
        * Doesn't throw any errors (`NaN`s become 0) but this may change in future
        */
        public static unformatNumber(value: any): number {
            // Return the value as-is if it's already a number:
            if (typeof value === "number") return value;

            // Build regex to strip out everything except digits, decimal point and minus sign:
            var unformatted = parseFloat(
                (value + '')
                    .replace(/\((.*)\)/, '-$1') // replace parenthesis for negative numbers
                    .replace(/[^0-9-.]/g, '')
                );

            return !isNaN(unformatted) ? unformatted : 0;
        }

        /**
        * Addapted from accounting.js library. http://josscrowcroft.github.com/accounting.js/
        * Format a number, with comma-separated thousands and custom precision/decimal places
        *
        * Localise by overriding the precision and thousand / decimal separators
        * 2nd parameter `precision` can be an object matching `settings.number`
        */
        public static formatNumber(value: any, precision: number = 0): string {
            // Build options object from second param (if object) or all params, extending defaults:
            var num: number = Utils.unformatNumber(value),
                usePrecision = Utils.checkPrecision(precision),
                negative: string = num < 0 ? "-" : "",
                base = parseInt(Utils.toFixed(Math.abs(num || 0), usePrecision), 10) + "",
                mod = base.length > 3 ? base.length % 3 : 0
            ;

            // Format the number:
            return negative + (mod ? base.substr(0, mod) + ',' : '') + base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1,') + (usePrecision ? '.' + Utils.toFixed(Math.abs(num), usePrecision).split('.')[1] : "");
        }

        /**
	     * Tests whether supplied parameter is a string
	     * from underscore.js
	     */
	    public static isString(obj): boolean {
            return !!(obj === '' || (obj && obj.charCodeAt && obj.substr));
        }

        /**
        * Addapted from accounting.js library.
        * Implementation of toFixed() that treats floats more like decimals
        *
        * Fixes binary rounding issues (eg. (0.615).toFixed(2) === "0.61") that present
        * problems for accounting- and finance-related software.
        */
        public static toFixed(value: any, precision: number = 0): string {
            precision = Utils.checkPrecision(precision);
            var power = Math.pow(10, precision);

            // Multiply up by precision, round accurately, then divide and use native toFixed():
            return (Math.round(Utils.unformatNumber(value) * power) / power).toFixed(precision);
        }

        /**
        * Addapted from accounting.js library. http://josscrowcroft.github.com/accounting.js/
        * Check and normalise the value of precision (must be positive integer)
        */
        public static checkPrecision(val): number {
            val = Math.round(Math.abs(val));
            return isNaN(val) ? 0 : val;
        }

    }
}