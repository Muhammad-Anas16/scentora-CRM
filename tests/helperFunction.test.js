import helperFunction from "@/lib/helperFunction";

describe('helperFunction', () => {
  it('wraps data and message with status', () => {
    const res = helperFunction(200, { ok: true }, false, 'msg');
    expect(res.status).toBe(200);
  });
});


