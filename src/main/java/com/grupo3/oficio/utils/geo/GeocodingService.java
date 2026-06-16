package com.grupo3.oficio.utils.geo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class GeocodingService {

    @Value("&{google.maps.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.create();

    public double[] obtenerCoordenadas(String direccion) {
        String url = "https://maps.googleapis.com/maps/api/geocode/json?address="
                + direccion.replace(" ", "+")
                + "&key=" + apiKey;

        String response = webClient.get()
                .uri(url)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response);
            JsonNode location = root
                    .path("results")
                    .get(0)
                    .path("geometry")
                    .path("location");

            double lat = location.path("lat").asDouble();
            double lng = location.path("lng").asDouble();
            return new double[]{lat, lng};

        } catch (Exception e) {
            throw new RuntimeException("No se pudo obtener las coordenadas para: " + direccion);
        }
    }
}
