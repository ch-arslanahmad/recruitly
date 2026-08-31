package com.recruitly.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JWTFilter jwtFilter;

    public SecurityConfig(JWTFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth ->
                auth
                    .requestMatchers("/", "/health", "/api/auth/**") // auth & public endpoints
                    .permitAll()
                    .requestMatchers(HttpMethod.GET, "/api/jobs") // browse jobs (public)
                    .permitAll()

                    .requestMatchers("/api/jobs/my", "/api/jobs/stats") // my jobs & stats (recruiter) — BEFORE the {id} pattern
                    .hasRole("RECRUITER")
                    .requestMatchers(HttpMethod.GET, "/api/jobs/{id}") // job detail (public)
                    .permitAll()

                    .requestMatchers(HttpMethod.POST, "/api/jobs") // create job (recruiter)
                    .hasRole("RECRUITER")
                    .requestMatchers(HttpMethod.PUT, "/api/jobs/**") // update job (recruiter)
                    .hasRole("RECRUITER")
                    .requestMatchers(HttpMethod.DELETE, "/api/jobs/**") // delete job (recruiter)
                    .hasRole("RECRUITER")

                    .requestMatchers(HttpMethod.POST, "/api/applications") // apply to job (applicant)
                    .hasRole("APPLICANT")
                    .requestMatchers(HttpMethod.GET, "/api/applications/my") // my applications (applicant)
                    .hasRole("APPLICANT")
                    .requestMatchers(HttpMethod.PUT, "/api/applications/**") // status update (recruiter)
                    .hasRole("RECRUITER")
                    .requestMatchers("/api/saved-jobs/**") // saved jobs (applicant)
                    .hasRole("APPLICANT")
                    .requestMatchers(
                        "/api/applications/applicants",
                        "/api/applications/job/**"
                    )
                    .hasRole("RECRUITER") // applicants & applications (recruiter)
                    .anyRequest()
                    .authenticated()
            )
            // applying the JWT filter before the UsernamePasswordAuthenticationFilter
            .addFilterBefore(
                jwtFilter,
                UsernamePasswordAuthenticationFilter.class
            );
        return http.build();
    }
}
