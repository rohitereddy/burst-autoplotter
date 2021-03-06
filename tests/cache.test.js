const fs = require('fs-extra');
const path = require('path');

const {load, update} = require('../src/cache');

const TestCache = path.join(__dirname, "./testcache");

afterEach(() => {
	fs.removeSync(TestCache);
});

test("Load Cache", () => {
	const {accountId, lastNonce} = load(TestCache);
	expect(accountId).toBe("1234567890123456789");
	expect(lastNonce).toBe(0);
});

test("Update Cache", () => {
	
	const testData = {
		notCacheable: "NotCacheable",
		accountId: "123456789"
	};
	
	update(testData, TestCache);
	
	const cacheData = load(TestCache);
	expect(cacheData.notCacheable).not.toBeDefined();
	expect(cacheData.accountId).toBe("123456789");
	expect(cacheData.lastNonce).toBe(0);
	
});
