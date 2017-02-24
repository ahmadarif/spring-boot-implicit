package com.ahmadarif.ui;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.zuul.EnableZuulProxy;

@SpringBootApplication
@EnableZuulProxy
public class ImplicitApplication {

	public static void main(String[] args) {
		SpringApplication.run(ImplicitApplication.class, args);
	}
}