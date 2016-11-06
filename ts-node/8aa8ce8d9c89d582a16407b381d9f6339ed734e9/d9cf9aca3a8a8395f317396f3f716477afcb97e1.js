"use strict";
var app_po_1 = require('./app.po');
describe('quran-together App', function () {
    var page;
    beforeEach(function () {
        page = new app_po_1.QuranTogetherPage();
    });
    it('should display message saying app works', function () {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
//# sourceMappingURL=/Users/Amin/WebstormProjects/quran-together/ts-node/8aa8ce8d9c89d582a16407b381d9f6339ed734e9/d9cf9aca3a8a8395f317396f3f716477afcb97e1.js.map