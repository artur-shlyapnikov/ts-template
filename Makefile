SHELL := /bin/bash

.PHONY: build test typecheck lint lint-fix deadcode coverage hooks check ci install


install:
	bun install

build:
	bun run build

test:
	bun run test

typecheck:
	bunx tsc --noEmit

lint:
	bun run lint:base
	bun run lint:ts

lint-fix:
	bun run lint:fix

deadcode:
	bun run deadcode

coverage:
	bun test --coverage --threshold=70

check: typecheck lint deadcode

ci: build check test

hooks:
	bun run prepare
