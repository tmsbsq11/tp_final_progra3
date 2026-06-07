package com.grupo3.oficio.service.users;

import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.repository.users.TrabajadorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class TrabajadorService {
    private TrabajadorRepository trabajadorRepository;

    public TrabajadorService(TrabajadorRepository trabajadorRepository) { this.trabajadorRepository = trabajadorRepository; }

    //CRUD
        //create
    public Trabajador crear(Trabajador trabajador) {
        //validaciones
        trabajador.setId(null);
        trabajador.setFechaCreacion(LocalDateTime.now());
        trabajadorRepository.save(trabajador);
        return trabajador;
    }

    //read
    public List<Trabajador> mostrarTodos(){ return trabajadorRepository.findAll(); }

    public Trabajador buscarPorId(Integer id) {
        return trabajadorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ERROR TrabajadorService/buscarPorId, NO " + id));
    }

    //update
    public Trabajador actualizar(Integer id, Trabajador trabajador) {
        //validaciones
        trabajador.setId(id);
        trabajadorRepository.save(trabajador);
        return trabajador;
    }

    //delete
    public void borrar(Integer id) {
        trabajadorRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ERROR TrabajadorService/borrar, NO " + id));
        if (id == null) {
            throw new NullPointerException("ERROR TrabajadorService/borrar, ID nulo");
        }

        trabajadorRepository.deleteById(id);
    }
}
