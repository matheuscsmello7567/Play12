/**
 * EXEMPLO DE IMPLEMENTAÇÃO DE ENDPOINTS DO BACKEND
 * 
 * Este arquivo demonstra como os endpoints devem ser implementados
 * no backend (Java/Spring Boot) para que o frontend funcione corretamente.
 * 
 * Os dados devem ser retornados no formato especificado.
 */

// ============================================================================
// EXEMPLO PARA JAVA/SPRING BOOT
// ============================================================================

/*
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class ApiController {

  @Autowired
  private EventoService eventoService;
  
  @Autowired
  private OperadorService operadorService;
  
  @Autowired
  private TimeService timeService;

  // ========== EVENTOS ==========
  
  @GetMapping("/eventos")
  public ResponseEntity<ApiResponse<List<EventoDTO>>> getAllEventos() {
    try {
      List<EventoDTO> eventos = eventoService.findAll();
      return ResponseEntity.ok(
        new ApiResponse<>(true, eventos, "Eventos carregados com sucesso")
      );
    } catch (Exception e) {
      return ResponseEntity.status(500)
        .body(new ApiResponse<>(false, null, "Erro ao carregar eventos"));
    }
  }

  @GetMapping("/eventos/{id}")
  public ResponseEntity<ApiResponse<EventoDTO>> getEventoById(@PathVariable String id) {
    try {
      EventoDTO evento = eventoService.findById(id);
      if (evento != null) {
        return ResponseEntity.ok(
          new ApiResponse<>(true, evento, "Evento carregado com sucesso")
        );
      }
      return ResponseEntity.status(404)
        .body(new ApiResponse<>(false, null, "Evento não encontrado"));
    } catch (Exception e) {
      return ResponseEntity.status(500)
        .body(new ApiResponse<>(false, null, "Erro ao carregar evento"));
    }
  }

  @PostMapping("/eventos")
  public ResponseEntity<ApiResponse<EventoDTO>> createEvento(@RequestBody EventoDTO eventoDTO) {
    try {
      EventoDTO created = eventoService.save(eventoDTO);
      return ResponseEntity.status(201)
        .body(new ApiResponse<>(true, created, "Evento criado com sucesso"));
    } catch (Exception e) {
      return ResponseEntity.status(400)
        .body(new ApiResponse<>(false, null, "Erro ao criar evento"));
    }
  }

  @PutMapping("/eventos/{id}")
  public ResponseEntity<ApiResponse<EventoDTO>> updateEvento(
    @PathVariable String id,
    @RequestBody EventoDTO eventoDTO
  ) {
    try {
      EventoDTO updated = eventoService.update(id, eventoDTO);
      return ResponseEntity.ok(
        new ApiResponse<>(true, updated, "Evento atualizado com sucesso")
      );
    } catch (Exception e) {
      return ResponseEntity.status(400)
        .body(new ApiResponse<>(false, null, "Erro ao atualizar evento"));
    }
  }

  // ========== OPERADORES ==========
  
  @GetMapping("/operadores")
  public ResponseEntity<ApiResponse<List<OperadorDTO>>> getAllOperadores() {
    try {
      List<OperadorDTO> operadores = operadorService.findAll();
      return ResponseEntity.ok(
        new ApiResponse<>(true, operadores, "Operadores carregados com sucesso")
      );
    } catch (Exception e) {
      return ResponseEntity.status(500)
        .body(new ApiResponse<>(false, null, "Erro ao carregar operadores"));
    }
  }

  @GetMapping("/operadores/{id}")
  public ResponseEntity<ApiResponse<OperadorDTO>> getOperadorById(@PathVariable String id) {
    try {
      OperadorDTO operador = operadorService.findById(id);
      if (operador != null) {
        return ResponseEntity.ok(
          new ApiResponse<>(true, operador, "Operador carregado com sucesso")
        );
      }
      return ResponseEntity.status(404)
        .body(new ApiResponse<>(false, null, "Operador não encontrado"));
    } catch (Exception e) {
      return ResponseEntity.status(500)
        .body(new ApiResponse<>(false, null, "Erro ao carregar operador"));
    }
  }

  @GetMapping("/times/{timeId}/operadores")
  public ResponseEntity<ApiResponse<List<OperadorDTO>>> getOperadoresByTime(
    @PathVariable String timeId
  ) {
    try {
      List<OperadorDTO> operadores = operadorService.findByTimeId(timeId);
      return ResponseEntity.ok(
        new ApiResponse<>(true, operadores, "Operadores do time carregados com sucesso")
      );
    } catch (Exception e) {
      return ResponseEntity.status(500)
        .body(new ApiResponse<>(false, null, "Erro ao carregar operadores do time"));
    }
  }

  @PostMapping("/operadores")
  public ResponseEntity<ApiResponse<OperadorDTO>> createOperador(
    @RequestBody OperadorDTO operadorDTO
  ) {
    try {
      OperadorDTO created = operadorService.save(operadorDTO);
      return ResponseEntity.status(201)
        .body(new ApiResponse<>(true, created, "Operador criado com sucesso"));
    } catch (Exception e) {
      return ResponseEntity.status(400)
        .body(new ApiResponse<>(false, null, "Erro ao criar operador"));
    }
  }

  // ========== TIMES ==========
  
  @GetMapping("/times")
  public ResponseEntity<ApiResponse<List<TimeDTO>>> getAllTimes() {
    try {
      List<TimeDTO> times = timeService.findAll();
      return ResponseEntity.ok(
        new ApiResponse<>(true, times, "Times carregados com sucesso")
      );
    } catch (Exception e) {
      return ResponseEntity.status(500)
        .body(new ApiResponse<>(false, null, "Erro ao carregar times"));
    }
  }

  @GetMapping("/times/{id}")
  public ResponseEntity<ApiResponse<TimeDTO>> getTimeById(@PathVariable String id) {
    try {
      TimeDTO time = timeService.findById(id);
      if (time != null) {
        return ResponseEntity.ok(
          new ApiResponse<>(true, time, "Time carregado com sucesso")
        );
      }
      return ResponseEntity.status(404)
        .body(new ApiResponse<>(false, null, "Time não encontrado"));
    } catch (Exception e) {
      return ResponseEntity.status(500)
        .body(new ApiResponse<>(false, null, "Erro ao carregar time"));
    }
  }

  @PostMapping("/times")
  public ResponseEntity<ApiResponse<TimeDTO>> createTime(@RequestBody TimeDTO timeDTO) {
    try {
      TimeDTO created = timeService.save(timeDTO);
      return ResponseEntity.status(201)
        .body(new ApiResponse<>(true, created, "Time criado com sucesso"));
    } catch (Exception e) {
      return ResponseEntity.status(400)
        .body(new ApiResponse<>(false, null, "Erro ao criar time"));
    }
  }

  // ========== RANKING ==========
  
  @GetMapping("/ranking")
  public ResponseEntity<ApiResponse<List<RankingEntryDTO>>> getRanking() {
    try {
      List<RankingEntryDTO> ranking = timeService.getRanking();
      return ResponseEntity.ok(
        new ApiResponse<>(true, ranking, "Ranking carregado com sucesso")
      );
    } catch (Exception e) {
      return ResponseEntity.status(500)
        .body(new ApiResponse<>(false, null, "Erro ao carregar ranking"));
    }
  }
}

// ============================================================================
// CLASSES DE RESPOSTA
// ============================================================================

@Data
@AllArgsConstructor
public class ApiResponse<T> {
  private boolean success;
  private T data;
  private String message;
}

// ============================================================================
// DTOs ESPERADOS
// ============================================================================

@Data
public class EventoDTO {
  private String id;
  private String nome;
  private String data;          // ISO format: YYYY-MM-DD
  private String horario;       // Formato: 0100H
  private String tipo;          // MILSIM, CQB, WOODLAND
  private String status;        // BRIEFING, MOBILIZAÇÃO, EM COMBATE, DEBRIEFING
  private LocalDTO local;
  private Integer confirmados;
  private Integer total;
  private String intel;
}

@Data
public class LocalDTO {
  private String endereco;
  private String coords;
  private String mapsUrl;
}

@Data
public class OperadorDTO {
  private String id;
  private String apelido;
  private String nomeCompleto;
  private String patente;
  private String squadId;
  private String squadNome;
  private Integer jogosParticipados;
  private Integer pontos;
  private String email;
  private String dataCadastro;
  private List<String> loadout;
  private String status;        // ONLINE, OFFLINE, EM_COMBATE
}

@Data
public class TimeDTO {
  private String id;
  private String nome;
  private String tag;
  private String descricao;
  private Integer membrosCount;
  private Integer pontosTotais;
  private Integer jogosParticipados;
  private String liderID;
}

@Data
public class RankingEntryDTO {
  private Integer posicao;
  private TimeDTO time;
  private Integer operadoresCount;
  private Integer jogosJogados;
  private Integer pontos;
}
*/

// ============================================================================
// EXAMPLE FOR NODE.JS/EXPRESS
// ============================================================================

/*
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const ApiResponse = (success, data = null, message = '') => ({
  success,
  data,
  message
});

// Events Routes
app.get('/api/eventos', (req, res) => {
  try {
    const eventos = []; // Get from database
    res.json(ApiResponse(true, eventos, 'Eventos carregados com sucesso'));
  } catch (error) {
    res.status(500).json(ApiResponse(false, null, 'Erro ao carregar eventos'));
  }
});

app.get('/api/eventos/:id', (req, res) => {
  try {
    const evento = {}; // Get from database
    res.json(ApiResponse(true, evento, 'Evento carregado com sucesso'));
  } catch (error) {
    res.status(500).json(ApiResponse(false, null, 'Erro ao carregar evento'));
  }
});

app.post('/api/eventos', (req, res) => {
  try {
    const novoEvento = req.body;
    // Save to database
    res.status(201).json(ApiResponse(true, novoEvento, 'Evento criado com sucesso'));
  } catch (error) {
    res.status(400).json(ApiResponse(false, null, 'Erro ao criar evento'));
  }
});

// Operators Routes
app.get('/api/operadores', (req, res) => {
  try {
    const operadores = []; // Get from database
    res.json(ApiResponse(true, operadores, 'Operadores carregados com sucesso'));
  } catch (error) {
    res.status(500).json(ApiResponse(false, null, 'Erro ao carregar operadores'));
  }
});

// Teams Routes
app.get('/api/times', (req, res) => {
  try {
    const times = []; // Get from database
    res.json(ApiResponse(true, times, 'Times carregados com sucesso'));
  } catch (error) {
    res.status(500).json(ApiResponse(false, null, 'Erro ao carregar times'));
  }
});

// Ranking Route
app.get('/api/ranking', (req, res) => {
  try {
    const ranking = []; // Calculate and get from database
    res.json(ApiResponse(true, ranking, 'Ranking carregado com sucesso'));
  } catch (error) {
    res.status(500).json(ApiResponse(false, null, 'Erro ao carregar ranking'));
  }
});

app.listen(8080, () => {
  console.log('API running on http://localhost:8080');
});
*/
