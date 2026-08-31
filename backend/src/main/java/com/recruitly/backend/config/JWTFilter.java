package com.recruitly.backend.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class JWTFilter extends OncePerRequestFilter {

    private final JWTUtil jwtUtil;

    public JWTFilter(JWTUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterchain
    ) throws ServletException, IOException {
        // 1. get request header
        String header = request.getHeader("Authorization");

        // 2. verify header

        if (header == null || !header.startsWith("Bearer ")) {
            filterchain.doFilter(request, response);
            return;
        }
        // 3. extract token from header
        String token = header.substring(7);

        // 4. validate token
        if (!jwtUtil.validateToken(token)) {
            response.sendError(
                HttpServletResponse.SC_UNAUTHORIZED,
                "Invalid token"
            );
            return;
        }

        Long userId = jwtUtil.getUserID(token); // get user id from token
        var role = jwtUtil.getRole(token); // get role from token

        // password nulll, due to the fact that we are not using it for authentication rather for authorization (role based access control)
        var auth = new UsernamePasswordAuthenticationToken(
            // create authentication object
            userId, // userId
            null,
            List.of(
                new SimpleGrantedAuthority("ROLE_" + role.name().toUpperCase())
            ) // role
        );
        SecurityContextHolder.getContext().setAuthentication(auth);

        // continue with the request
        filterchain.doFilter(request, response);
    }
}
