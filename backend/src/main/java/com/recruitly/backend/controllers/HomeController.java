package com.recruitly.backend.controllers;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/")
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "Welcome to Recruitly API!";
    }

    @GetMapping("/health")
    public String health() {
        return "API is healthy!";
    }
}
