package com.grupo3.oficio.service;

import com.grupo3.oficio.model.CrearNotificacionDTO;
import com.grupo3.oficio.model.Notificacion;
import com.grupo3.oficio.model.NotificacionDTO;
import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.model.users.Trabajador;
import com.grupo3.oficio.repository.NotificacionRepository;
import com.grupo3.oficio.service.users.ClienteService;
import com.grupo3.oficio.service.users.TrabajadorService;
import com.grupo3.oficio.utils.enums.Rol;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class NotificacionService {
    private final NotificacionRepository notificacionRepo;
    private final EmailService emailService;
    private final ClienteService clienteService;
    private final TrabajadorService trabajadorService;

    public NotificacionService(
            NotificacionRepository notificacionRepo,
            EmailService emailService, ClienteService clienteService, TrabajadorService trabajadorService) {

        this.notificacionRepo = notificacionRepo;
        this.emailService = emailService;
        this.clienteService = clienteService;
        this.trabajadorService = trabajadorService;
    }

    //CRUD
    //read
    public List<Notificacion> mostrarNotificaciones() {
        return notificacionRepo.findAll();
    }

    public Notificacion mostrarNotificacionPorId(Integer id) {
        return notificacionRepo.findById(id).orElseThrow(() -> new NoSuchElementException("El id de la notificacion que se quiso buscar no existe"));
    }

    //create
    public Notificacion crearNotificacion(CrearNotificacionDTO crearNotificacionDTO) {
        if(crearNotificacionDTO==null){
            throw new IllegalArgumentException("La notificacion no puede ser null");
        }
        if (crearNotificacionDTO.getTipoNotificacion() == null) {
            throw new IllegalArgumentException("La notificacion debe decir que tipo de notificacion es");
        }
        if (crearNotificacionDTO.getMensaje() == null || crearNotificacionDTO.getMensaje().isBlank()) {
            throw new IllegalArgumentException("La notificacion debe tener un mensaje");
        }
        if (crearNotificacionDTO.getIdUserDestino() == null) {
            throw new IllegalArgumentException("La notificacion debe tener el id destino");
        }
        if (crearNotificacionDTO.getTitulo() == null || crearNotificacionDTO.getTitulo().isBlank()) {
            throw new IllegalArgumentException("La notificacion debe tener titulo");
        }
        if(crearNotificacionDTO.getRol()==null){
            throw new IllegalArgumentException("La notificacion debe tener el rol al que se le manda la notificacion");
        }
        Notificacion notificacion = new Notificacion();
        notificacion.setTipoNotificacion(crearNotificacionDTO.getTipoNotificacion());
        notificacion.setMensaje(crearNotificacionDTO.getMensaje());
        notificacion.setTitulo(crearNotificacionDTO.getTitulo());
        notificacion.setIdDestino(crearNotificacionDTO.getIdUserDestino());
        notificacion.setLeida(false);
        notificacion.setFechaCreacion(LocalDateTime.now());
        notificacion.setRol(crearNotificacionDTO.getRol());
        notificacion.setId(null);

        Notificacion notificacionGuardada = notificacionRepo.save(notificacion);
        String mail = "";
        if(notificacionGuardada.getRol().equals(Rol.CLIENTE)){
            Cliente cliente= clienteService.buscarPorId(notificacionGuardada.getIdDestino());
            mail=cliente.getCorreo();
        }
        if (notificacionGuardada.getRol().equals(Rol.TRABAJADOR)) {
            Trabajador trabajador= trabajadorService.buscarPorId(notificacionGuardada.getIdDestino());
            mail=trabajador.getCorreo();
        }
        //Falta el admin
        emailService.enviarMail(
                mail,//buscar el cliente o trabajador y mandar el mail
                crearNotificacionDTO.getTitulo(),
                crearNotificacionDTO.getMensaje()
        );
        return notificacionGuardada;
    }

    //update
    public Notificacion actualizarNotificacion(NotificacionDTO actualizarNotificacionDTO, Integer id) {

        Notificacion notificacion = notificacionRepo.findById(id).orElseThrow(() -> new NoSuchElementException("No se encontro el id de la notificacion que se quiere modificar"));
        if (actualizarNotificacionDTO.getTipoNotificacion() == null) {
            throw new IllegalArgumentException("La notificacion debe decir que tipo de notificacion es");
        }
        if (actualizarNotificacionDTO.getMensaje() == null || actualizarNotificacionDTO.getMensaje().isEmpty()) {
            throw new IllegalArgumentException("La notificacion debe tener un mensaje");
        }
        if (actualizarNotificacionDTO.getIdUserDestino() == null) {
            throw new IllegalArgumentException("La notificacion debe tener el id destino");
        }
        if (actualizarNotificacionDTO.getTitulo() == null || actualizarNotificacionDTO.getTitulo().isEmpty()) {
            throw new IllegalArgumentException("La notificacion debe tener titulo");
        }
        notificacion.setIdDestino(actualizarNotificacionDTO.getIdUserDestino());
        notificacion.setTipoNotificacion(actualizarNotificacionDTO.getTipoNotificacion());
        notificacion.setMensaje(actualizarNotificacionDTO.getMensaje());
        notificacion.setRol(notificacion.getRol());
        notificacion.setLeida(false);//actualiza el estado?
        return notificacionRepo.save(notificacion);
    }

    //delete
    public void eliminarNotificacion(Integer id) {
        Notificacion notificacion = notificacionRepo.findById(id).orElseThrow(() -> new NoSuchElementException("No se encontro el id de la notificacion que se quiere eliminar"));
        notificacionRepo.delete(notificacion);
    }
}
