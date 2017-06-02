import { GigabytePage } from './app.po';

describe('gigabyte App', () => {
  let page: GigabytePage;

  beforeEach(() => {
    page = new GigabytePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
