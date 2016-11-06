import { QuranTogetherPage } from './app.po';

describe('quran-together App', function() {
  let page: QuranTogetherPage;

  beforeEach(() => {
    page = new QuranTogetherPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
