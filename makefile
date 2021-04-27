.PHONY:  build  default


default: build


build:
	sam build -b dist -t template.yaml -u
