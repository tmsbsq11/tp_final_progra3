package com.grupo3.oficio.utils.auth;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String secretKey;

    private static final long EXPIRACION_MS = 1000 * 60 * 60 * 24; //24hs

    public String generarToken(UserDetails user) {
        System.out.println("SECRET KEY: " + secretKey);
        return Jwts.builder()
                .subject(user.getUsername())
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRACION_MS))
                .signWith(getSigningKey())
                .compact();
    }

    public String extraerEmail(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public boolean esTokenValido(String token, UserDetails user) {
        return extraerEmail(token).equals(user.getUsername())
                && !estaExpirado(token);
    }

    public boolean estaExpirado(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration()
                .before(new Date());
    }

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }
}
