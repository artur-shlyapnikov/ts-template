SHELL := /bin/bash

.PHONY: build test typecheck lint lint-fix deadcode coverage hooks

build:
	bun run build

test:
	bun run test

typecheck:
	bun run typecheck

lint:
	bun run lint

lint-fix:
	bun run lint:fix

deadcode:
	bun run deadcode

coverage:
	bun test --coverage --threshold=70

hooks:
	bun run prepare
