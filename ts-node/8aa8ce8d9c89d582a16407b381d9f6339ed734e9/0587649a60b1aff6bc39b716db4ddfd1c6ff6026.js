"use strict";
var protractor_1 = require('protractor');
var QuranTogetherPage = (function () {
    function QuranTogetherPage() {
    }
    QuranTogetherPage.prototype.navigateTo = function () {
        return protractor_1.browser.get('/');
    };
    QuranTogetherPage.prototype.getParagraphText = function () {
        return protractor_1.element(protractor_1.by.css('app-root h1')).getText();
    };
    return QuranTogetherPage;
}());
exports.QuranTogetherPage = QuranTogetherPage;
//# sourceMappingURL=/Users/Amin/WebstormProjects/quran-together/ts-node/8aa8ce8d9c89d582a16407b381d9f6339ed734e9/0587649a60b1aff6bc39b716db4ddfd1c6ff6026.js.map