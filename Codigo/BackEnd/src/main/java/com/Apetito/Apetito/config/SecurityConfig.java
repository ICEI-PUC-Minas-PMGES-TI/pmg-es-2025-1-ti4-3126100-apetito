package com.Apetito.Apetito.config;

import com.Apetito.Apetito.filters.JwtAuthenticationFilter;
import com.Apetito.Apetito.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final CustomUserDetailsService customUserDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter, CustomUserDetailsService customUserDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.customUserDetailsService = customUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
                .cors() // Habilita o suporte ao CORS
                .and()
                .authorizeHttpRequests()
                // Permitir acesso público às rotas de autenticação
                .requestMatchers("/api/auth/**").permitAll()

                // Configuração de permissões para bebidas
                .requestMatchers(HttpMethod.GET, "/api/bebidas", "/api/bebidas/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/bebidas", "/api/bebidas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/bebidas", "/api/bebidas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/bebidas", "/api/bebidas/**").hasRole("ADMIN")

                // Configuração de permissões para comidas
                .requestMatchers(HttpMethod.GET, "/api/comidas", "/api/comidas/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/comidas", "/api/comidas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/comidas", "/api/comidas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/comidas", "/api/comidas/**").hasRole("ADMIN")

                // Configuração de permissões para mesas
                .requestMatchers(HttpMethod.GET, "/api/mesas", "/api/mesas/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/mesas", "/api/mesas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/mesas", "/api/mesas/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/mesas", "/api/mesas/**").hasRole("ADMIN")

                // Configuração de permissões para avaliações
                .requestMatchers("/api/avaliacoes", "/api/avaliacoes/**").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/avaliacoes", "/api/avaliacoes/**").hasRole("ADMIN")

                // Todas as outras requisições precisam estar autenticadas
                .anyRequest().authenticated()
                .and()
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        return http.getSharedObject(AuthenticationManagerBuilder.class)
                .userDetailsService(customUserDetailsService)
                .passwordEncoder(passwordEncoder())
                .and()
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permitir todas as origens
        configuration.addAllowedOriginPattern("*");

        // Permitir todos os métodos HTTP (GET, POST, PUT, DELETE, etc.)
        configuration.addAllowedMethod("*");

        // Permitir todos os cabeçalhos
        configuration.addAllowedHeader("*");

        // Permitir credenciais (cookies, headers de autenticação, etc.)
        configuration.setAllowCredentials(true);

        // Registrar a configuração para todas as rotas da API
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}