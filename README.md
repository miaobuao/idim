# IDIM

## Develop

1. install dependencies

```sh
pnpm i
```

2. prepare

```sh
pnpm prepare
cd ./packages/db
pnpm gen
```

3. start PostgreSQL container [Optional]

```sh
cd docker
docker-compose up -d
```

4. start dev server

```sh
pnpm dev
```


## Build

```
pnpm build
```
