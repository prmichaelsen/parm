import Snoowrap, { Submission, Subreddit } from 'snoowrap';
import { reddit } from './reddit';

describe('reddit', () => {
  var originalTimeout;

  beforeEach(function() {
      originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
  it.skip('should work', async () => {
    expect(await (await reddit().getDefaultSubreddits()).length).toBeGreaterThan(0);
  });
  it('should fetch subreddit', async () => {
    const snoo = reddit();
    const wholesome: Subreddit = await (snoo.getSubreddit('WholesomeAsHeck') as any);
    expect(wholesome).not.toBeNull();
  });
  it.skip('should submit', async () => {
    const snoo = reddit();
    const submission: Submission = await (snoo.submitSelfpost({
      subredditName: 'WholesomeAsHeck',
      title: 'test',
      text: 'test',
    }) as any);
    expect(submission).not.toBeNull();
  });
  it.skip('should submit image', async () => {
    const snoo = reddit();
    const wholesome: Subreddit = await (snoo.getSubreddit('WholesomeAsHeck') as any);
    const submission: Submission = await (wholesome.submitLink({
      title: 'test 2',
      url: 'https://firebasestorage.googleapis.com/v0/b/parm-names-not-numbers.appspot.com/o/parm%2Fimages%2Feda049f0-b4fa-11ea-9ad9-af5c0f14df36?alt=media&token=a3d668ec-33d8-45fc-bdf5-8ed387c60c23',
    } as any) as any);
    expect(submission).not.toBeNull();
  });
  it('should get submission', async () => {
    const snoo = reddit();
    const submission: Submission = await (snoo.getSubmission('jnecb9') as any);
    expect(submission).not.toBeNull();
  });
  it.skip('should crosspost submission', async () => {
    const snoo = reddit();
    const submission: Submission = await (snoo.getSubmission('jnecb9') as any);
    console.log(submission);
    const crosspostResult = await (submission as any).submitCrosspost({
      subredditName: 'cute',
      title: 'test',
    });
    expect(crosspostResult).not.toBeNull();
  });
  it('should pull oauth scopes', async (done) => {
    const snoo = reddit();
    const scopes = await (snoo.getOauthScopeList());
    console.log(scopes);
    expect(scopes).not.toBeNull();
    done();
  });
});