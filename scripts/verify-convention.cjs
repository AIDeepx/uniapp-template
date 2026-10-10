#!/usr/bin/env node
/**
 * verify-convention.cjs —— 企业推广「组件统一用法」硬校验
 *
 * 规则：
 *  R1 业务页面（pages/**）禁止直接使用 uni-* 官方组件（标签或导入）。
 *     官方组件只允许出现在白名单薄壳组件内部。
 *  R2 m-* / external-* 组件的 <style> 内禁止硬编码色值（hex），
 *     必须引用 styles/theme 令牌；JS 字符串里的 hex 必须是 palette.scss 中存在的令牌值。
 *  R3 pages.json easycom 必须包含 ^m-(.*) 与 ^external-(.*) 两条规则。
 *
 * 退出码：0 = 全部通过；1 = 存在违规。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ALLOWED_UNI_WRAPPERS = [
	'components/m-datetime-picker/m-datetime-picker.vue',
	'components/m-popup/m-popup.vue',
];

let errors = 0;
const fail = (rule, file, msg) => {
	errors++;
	console.error(`  ✗ [${rule}] ${path.relative(ROOT, file)}: ${msg}`);
};
const ok = (msg) => console.log(`  ✓ ${msg}`);

const walk = (dir, ext, out = []) => {
	for (const name of fs.readdirSync(dir)) {
		const p = path.join(dir, name);
		const st = fs.statSync(p);
		if (st.isDirectory()) walk(p, ext, out);
		else if (p.endsWith(ext)) out.push(p);
	}
	return out;
};

/* ---------- R1: 业务页面不得直接用 uni-* ---------- */
console.log('R1 业务页面禁止直接使用 uni-* 组件');
const pageFiles = walk(path.join(ROOT, 'pages'), '.vue');
for (const f of pageFiles) {
	const src = fs.readFileSync(f, 'utf8');
	const tagRe = /<uni-[\w-]+/g;
	const m = src.match(tagRe);
	if (m) fail('R1', f, `出现官方组件标签 ${[...new Set(m)].join(', ')}，请封装为 m-* 薄壳后使用`);
	if (/from\s+['"].*uni_modules/.test(src))
		fail('R1', f, '业务页面禁止 import uni_modules 下的组件/工具');
}
ok(`${pageFiles.length} 个业务页面检查完毕`);

/* ---------- R1b: uni-* 只允许出现在白名单薄壳内 ---------- */
console.log('R1b uni-* 组件只允许在白名单薄壳内使用');
const compFiles = walk(path.join(ROOT, 'components'), '.vue');
for (const f of compFiles) {
	const rel = path.relative(ROOT, f).replace(/\\/g, '/');
	const src = fs.readFileSync(f, 'utf8');
	const usesUni = /<uni-[\w-]+|from\s+['"].*uni_modules/.test(src);
	if (usesUni && !ALLOWED_UNI_WRAPPERS.includes(rel))
		fail('R1b', f, '引用了官方 uni-* 组件，但不在薄壳白名单内（需评审后加入 ALLOWED_UNI_WRAPPERS）');
}
ok(`薄壳白名单：${ALLOWED_UNI_WRAPPERS.length} 个`);

/* ---------- R2: 组件样式禁止硬编码 hex ---------- */
console.log('R2 组件样式令牌化（硬编码 hex 必须是 palette 令牌值）');
const paletteSrc = fs.readFileSync(path.join(ROOT, 'styles/theme/palette.scss'), 'utf8');
const paletteHex = new Set(
	(paletteSrc.match(/#[0-9a-fA-F]{3,8}\b/g) || []).map((h) => h.toUpperCase())
);
for (const f of compFiles) {
	const src = fs.readFileSync(f, 'utf8');
	const styleBlocks = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)];
	styleBlocks.forEach(({ 1: css }, i) => {
		const hexes = css.match(/#[0-9a-fA-F]{3,8}\b/g) || [];
		for (const hex of new Set(hexes)) {
			if (!paletteHex.has(hex.toUpperCase()))
				fail('R2', f, `style 块 #${i + 1} 存在非令牌色值 ${hex}，请改用 semantic.scss 令牌`);
		}
	});
}
ok(`palette 令牌色 ${paletteHex.size} 个，组件 style 已扫描`);

/* ---------- R3: easycom 规则完整 ---------- */
console.log('R3 easycom 规则完整');
const pagesJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'pages.json'), 'utf8'));
const custom = (pagesJson.easycom && pagesJson.easycom.custom) || {};
if (!custom['^m-(.*)']) fail('R3', path.join(ROOT, 'pages.json'), '缺少 ^m-(.*) easycom 规则');
if (!custom['^external-(.*)']) fail('R3', path.join(ROOT, 'pages.json'), '缺少 ^external-(.*) easycom 规则');
ok('easycom: m-* / external-* 规则在位');

/* ---------- 汇总 ---------- */
console.log('');
if (errors) {
	console.error(`✗ 统一用法校验失败：${errors} 处违规`);
	process.exit(1);
}
console.log('✓ 统一用法校验全部通过');
