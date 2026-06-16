package com.grupo3.oficio.utils.geo;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.reactive.function.client.WebClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;



//public class GeocodingService {
//
////    @Value("${google.maps.api.key}")
////    private String apiKey;
////
////    private final WebClient webClient = WebClient.create();
////
////    public double[] obtenerCoordenadas(String direccion) {
////        String url = "https://maps.googleapis.com/maps/api/geocode/json?address="
////                + direccion.replace(" ", "+")
////                + "&key=" + apiKey;
////
////        String response = webClient.get()
////                .uri(url)
////                .retrieve()
////                .bodyToMono(String.class)
////                .block();
////
////        System.out.println("GOOGLE RESPONSE: " + response);
////
////        try {
////            ObjectMapper mapper = new ObjectMapper();
////            JsonNode root = mapper.readTree(response);
////            JsonNode location = root
////                    .path("results")
////                    .get(0)
////                    .path("geometry")
////                    .path("location");
////
////            double lat = location.path("lat").asDouble();
////            double lng = location.path("lng").asDouble();
////            return new double[]{lat, lng};
////
////        } catch (Exception e) {
////            throw new RuntimeException("No se pudo obtener las coordenadas para: " + direccion);
////        }
//
//    public double[] obtenerCoordenadas(String direccion) {
//        String url = "https://nominatim.openstreetmap.org/search?q="
//                + direccion.replace(" ", "+")
//                + "&format=json&limit=1";
//
//
//        try {
//            ObjectMapper mapper = new ObjectMapper();
//            JsonNode root = mapper.readTree(response);
//            double lat = root.get(0).path("lat").asDouble();
//            double lon = root.get(0).path("lon").asDouble();
//            return new double[]{lat, lon};
//        } catch (Exception e) {
//            throw new RuntimeException("No se pudo obtener las coordenadas para: " + direccion);
//        }
//    }
//
//
//}


import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;


@Service
public class GeocodingService {

    private final RestTemplate restTemplate = new RestTemplate();

    public double[] obtenerCoordenadas(String direccion) {
        String url = "https://nominatim.openstreetmap.org/search?q="
                + direccion.replace(" ", "+")
                + "&format=json&limit=1";

        HttpHeaders headers = new HttpHeaders();
        headers.set("User-Agent", "oficio-app");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<String> response = restTemplate.exchange(
                url, HttpMethod.GET, entity, String.class);

        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            if (root.isEmpty()) {
                throw new RuntimeException("No se encontró la dirección: " + direccion);
            }

            double lat = root.get(0).path("lat").asDouble();
            double lon = root.get(0).path("lon").asDouble();
            return new double[]{lat, lon};

        } catch (RuntimeException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("No se pudo obtener las coordenadas para: " + direccion);
        }
    }
}
