package com.grupo3.oficio.service;

import com.grupo3.oficio.model.resenias.Resenia;
import com.grupo3.oficio.model.resenias.ReseniaDTO;
import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.repository.ReseniaRepository;
import com.grupo3.oficio.service.users.ClienteService;
import com.grupo3.oficio.service.users.TrabajadorService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
@Service
public class ReseniaService {
    ReseniaRepository reseniaRepo;
    ClienteService clienteService;
    TrabajadorService trabajadorService;

    public ReseniaService(ReseniaRepository reseniaRepo,ClienteService clienteService, TrabajadorService trabajadorService) {
        this.reseniaRepo = reseniaRepo;
        this.clienteService = clienteService;
        this.trabajadorService = trabajadorService;
    }

    //CRUD
    //create
    public Resenia crearResenia(ReseniaDTO reseniaDTO) {
        Resenia resenia = new Resenia();
        Trabajador trabajador = trabajadorService.buscarPorId(reseniaDTO.getIdTrabajador());
        Cliente cliente = clienteService.buscarPorId(reseniaDTO.getIdCliente());
        if(reseniaDTO.getPuntaje().isNaN() || resenia.getPuntaje() == null){
            throw new IllegalArgumentException("El puntaje es obligatorio");
        }
        if(reseniaDTO.getComentario().isBlank() || resenia.getComentario() == null){
            throw new IllegalArgumentException("El mensaje es obligatorio");
        }
        if(reseniaDTO.getDireccionResenia()== null){
            throw new IllegalArgumentException("La resenia debe contener la direccion en la que va");
        }
        resenia.setPuntaje(reseniaDTO.getPuntaje());
        resenia.setCliente(cliente);
        resenia.setTrabajador(trabajador);
        resenia.setComentario(reseniaDTO.getComentario());
        resenia.setFechaCreacion(LocalDateTime.now());
        return reseniaRepo.save(resenia);
    }

    //read
    public List<Resenia> mostrarResenias() {
        return reseniaRepo.findAll();
    }

    public Resenia buscarPorId(Integer id) {
        return reseniaRepo.findById(id).orElseThrow(() -> new NoSuchElementException("No se encontro el id de la resenia que se quizo buscar"));
    }

    //update
    public Resenia actualizarResenia( ReseniaDTO reseniaDTO, Integer id) {
        Resenia resenia= new Resenia();
        Trabajador trabajador = trabajadorService.buscarPorId(reseniaDTO.getIdTrabajador());
        Cliente cliente = clienteService.buscarPorId(reseniaDTO.getIdCliente());
        if(reseniaDTO.getPuntaje().isNaN() || resenia.getPuntaje() == null){
            throw new IllegalArgumentException("El puntaje es obligatorio");
        }
        if(reseniaDTO.getComentario().isBlank() || resenia.getComentario() == null){
            throw new IllegalArgumentException("El mensaje es obligatorio");
        }
        resenia.setId(id);
        resenia.setFechaCreacion(reseniaDTO.getFechaCreacion());
        resenia.setComentario(reseniaDTO.getComentario());
        resenia.setCliente(cliente);
        resenia.setTrabajador(trabajador);
        resenia.setPuntaje(reseniaDTO.getPuntaje());
        resenia.setFechaCreacion(buscarPorId(id).getFechaCreacion());
        return reseniaRepo.save(resenia);
    }

    //delete
    public void eliminarResenia(Integer id) {
        Resenia resenia = buscarPorId(id);
        reseniaRepo.delete(resenia);
    }
}
