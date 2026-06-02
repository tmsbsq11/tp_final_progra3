package com.grupo3.oficio.service.servicio;

import com.grupo3.oficio.repository.servicio.ServicioRepository;
import org.springframework.stereotype.Service;

@Service
public class ServicioService {
    private ServicioRepository servicioRepository;

    public ServicioService(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }
}
