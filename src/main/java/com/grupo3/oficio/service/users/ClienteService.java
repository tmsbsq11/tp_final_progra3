package com.grupo3.oficio.service.users;

import com.grupo3.oficio.model.users.Cliente;
import com.grupo3.oficio.repository.users.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ClienteService {
    private ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) { this.clienteRepository = clienteRepository; }

    //CRUD
        //create
    public Cliente crear(Cliente cliente) {
        //validaciones
        cliente.setId(null);
        clienteRepository.save(cliente);
        return cliente;
    }

        //read
    public List<Cliente> mostrarTodos(){ return clienteRepository.findAll(); }

    public Cliente buscarPorId(Integer id) {
        return clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ERROR ClienteService/buscarPorId, NO " + id));
    }

        //update
    public Cliente actualizar(Integer id, Cliente cliente) {
        //validaciones
        cliente.setId(id);
        clienteRepository.save(cliente);
        return cliente;
    }

        //delete
    public void borrar(Integer id) {
        clienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ERROR ClienteService/borrar, NO " + id));
        if (id == null) {
            throw new NullPointerException("ERROR ClienteService/borrar, ID nulo");
        }

        clienteRepository.deleteById(id);
    }
}
