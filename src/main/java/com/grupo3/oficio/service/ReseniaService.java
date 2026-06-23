package com.grupo3.oficio.service;

import com.grupo3.oficio.model.CrearNotificacionDTO;
import com.grupo3.oficio.model.resenias.CrearReseniaDTO;
import com.grupo3.oficio.model.resenias.Resenia;
import com.grupo3.oficio.model.resenias.ReseniaDTO;
import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.repository.ReseniaRepository;
import com.grupo3.oficio.service.users.ClienteService;
import com.grupo3.oficio.service.users.TrabajadorService;
import com.grupo3.oficio.utils.enums.DireccionResenia;
import com.grupo3.oficio.utils.enums.Rol;
import com.grupo3.oficio.utils.enums.TipoNotificacion;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
@Service
public class ReseniaService {
    ReseniaRepository reseniaRepo;
    ClienteService clienteService;
    TrabajadorService trabajadorService;
    NotificacionService notificacionService;

    public ReseniaService(ReseniaRepository reseniaRepo,ClienteService clienteService, TrabajadorService trabajadorService, NotificacionService notificacionService) {
        this.reseniaRepo = reseniaRepo;
        this.clienteService = clienteService;
        this.trabajadorService = trabajadorService;
        this.notificacionService = notificacionService;
    }

    //CRUD
    //create
    public Resenia crearResenia(CrearReseniaDTO reseniaDTO) {
        Trabajador trabajador = trabajadorService.buscarPorId(reseniaDTO.getIdTrabajador());
        Cliente cliente = clienteService.buscarPorId(reseniaDTO.getIdCliente());
        if(cliente == null){
            throw new IllegalArgumentException("El cliente no puede ser null");
        }
        if(trabajador == null){
            throw new IllegalArgumentException("El trabajador no puede ser null");
        }
        if(reseniaDTO.getPuntaje() == null || reseniaDTO.getPuntaje().isNaN()){
            throw new IllegalArgumentException("El puntaje es obligatorio");
        }
        if(reseniaDTO.getPuntaje()>5||reseniaDTO.getPuntaje()<1){
            throw new IllegalArgumentException("El puntaje debe ser entre 1 y 5");
        }
        if(reseniaDTO.getComentario() == null ||reseniaDTO.getComentario().isBlank()  ){
            throw new IllegalArgumentException("El mensaje es obligatorio");
        }
        if(reseniaDTO.getDireccionResenia()== null){
            throw new IllegalArgumentException("La resenia debe contener la direccion en la que va");
        }
        Resenia resenia = new Resenia();
        resenia.setPuntaje(reseniaDTO.getPuntaje());
        resenia.setCliente(cliente);
        resenia.setTrabajador(trabajador);
        resenia.setComentario(reseniaDTO.getComentario());
        resenia.setFechaCreacion(LocalDateTime.now());
        resenia.setDireccionResenia(reseniaDTO.getDireccionResenia());
        Resenia reseniaGuardada = reseniaRepo.saveAndFlush(resenia);
        if(resenia.getDireccionResenia().equals(DireccionResenia.CLIENTEATRABAJADOR)) {//Si el trabajador es el destinatario le avisa de la nueva resenia porq es publica
            notificacionService.crearNotificacion(
                    new CrearNotificacionDTO(
                            "Nueva reseña",
                            "Has recibido una nueva reseña",
                            TipoNotificacion.RESENIA,
                            trabajador.getId(),
                            Rol.TRABAJADOR
                    )
            );
            actualizarPuntajeTrabajador(trabajador);
        }

        return reseniaGuardada;
    }

    //read
    public List<Resenia> mostrarResenias() {
        return reseniaRepo.findAll();
    }

    public Resenia buscarPorId(Integer id) {
        return reseniaRepo.findById(id).orElseThrow(() -> new NoSuchElementException("No se encontro el id de la resenia que se quizo buscar"));
    }
    public List<Resenia> mostrarReseniaATrabajador(Integer idTrabajador){
        return reseniaRepo.findByTrabajadorIdAndDireccionResenia(idTrabajador,DireccionResenia.CLIENTEATRABAJADOR);// listar las resenias de los clientes al trabajador que se busca
    }
    public List<Resenia>mostrarReseniaACliente(Integer idCliente){
        return reseniaRepo.findByClienteIdAndDireccionResenia(idCliente,DireccionResenia.TRABAJADORACLIENTE);//listar las resenias de los trabajadores al cliente
    }
    //calculo de promedio, elegir si hacerlo desde la bdd o calcularlo cada vez
    public Double promedioPuntajeTrabajador(Integer idTrabajador) {
        return mostrarReseniaATrabajador(idTrabajador)
                .stream()
                .mapToDouble(Resenia::getPuntaje)
                .average()
                .orElse(0.0);//valor por defecto
    }

    public Double promedioPuntajeCliente(Integer idCliente) {
        return mostrarReseniaACliente(idCliente)
                .stream()
                .mapToDouble(Resenia::getPuntaje)
                .average()
                .orElse(0.0);//valor por defecto
    }

    private void actualizarPuntajeTrabajador(Trabajador trabajador) {
        Double promedio = promedioPuntajeTrabajador(trabajador.getId());
        trabajador.setPuntaje(promedio);
        trabajadorService.actualizar(trabajador.getId(), trabajador); // ver nota abajo
    }

    //update
    public Resenia actualizarResenia( ReseniaDTO reseniaDTO, Integer id) {
        Resenia resenia=buscarPorId(id);
        Trabajador trabajador = trabajadorService.buscarPorId(reseniaDTO.getIdTrabajador());
        if(trabajador==null){
            throw new IllegalArgumentException("El trabajador no puede ser null");
        }
        Cliente cliente = clienteService.buscarPorId(reseniaDTO.getIdCliente());
        if(cliente==null){
            throw new IllegalArgumentException("El cliene no puede ser null");
        }
        if(reseniaDTO.getPuntaje() == null || reseniaDTO.getPuntaje().isNaN()){
            throw new IllegalArgumentException("El puntaje es obligatorio");
        }
        if(reseniaDTO.getPuntaje()>5||reseniaDTO.getPuntaje()<1){
            throw new IllegalArgumentException("El puntaje debe ser entre 1 y 5");
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
        Resenia actualizada = reseniaRepo.save(resenia);
        if(resenia.getDireccionResenia().equals(DireccionResenia.CLIENTEATRABAJADOR)) {
            actualizarPuntajeTrabajador(trabajador);
        }
        return actualizada;
    }

    //delete
    public void eliminarResenia(Integer id) {
        Resenia resenia = buscarPorId(id);
        reseniaRepo.delete(resenia);
        if(resenia.getDireccionResenia().equals(DireccionResenia.CLIENTEATRABAJADOR)) {
            actualizarPuntajeTrabajador(resenia.getTrabajador());
        }
    }
}
