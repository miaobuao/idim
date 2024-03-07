# IDIM

## Develop

1. install dependencies

```sh
pnpm i
```

2. prepare

```sh
pnpm prepare
pnpm run db:migrate:dev
```

3. 创建软链接

创建一个软链接从 `apps/web/.wrangler` 指向项目根目录的 `.wrangler` 文件夹

4. start dev server

```sh
pnpm dev
```

## Build

```
pnpm build
```
