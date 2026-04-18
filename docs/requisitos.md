# Requisitos

## Requisitos Funcionais

### RF01 - Autenticacao

O sistema deve permitir login com e-mail e senha, emitindo JWT para acesso às áreas protegidas.

### RF02 - Navegacao Protegida

O sistema deve bloquear rotas protegidas sem token valido e redirecionar o usuario para a tela de login.

### RF03 - Dashboard

O sistema deve exibir um painel resumido com informacoes operacionais relevantes para TI hospitalar.

### RF04 - Ativos

O sistema deve listar ativos monitorados com status e resumo operacional.

### RF05 - Incidentes

O sistema deve listar incidentes com status e contexto suficiente para acompanhamento da operação.

### RF06 - Tickets

O sistema deve listar chamados em atendimento com visão simplificada de status.

### RF07 - Checklists

O sistema deve listar execucoes de checklists operacionais e seu estado atual.

### RF08 - SLA

O sistema deve disponibilizar indicadores de SLA com visão consolidada de conformidade.

### RF09 - Status De Servicos

O sistema deve exibir o estado dos servicos críticos monitorados.

### RF10 - Relatorios

O sistema deve listar relatórios e exportações recentes.

### RF11 - Auditoria

O sistema deve listar eventos auditáveis para suporte a rastreabilidade.

### RF12 - Healthcheck

O sistema deve expor um healthcheck público para validação operacional.

## Requisitos Nao Funcionais

### RNF01 - Seguranca

O segredo JWT deve ser obrigatório e o CORS precisa ser restringido por ambiente.

### RNF02 - Manutenibilidade

O projeto deve permanecer modular, com separação clara entre backend, frontend e documentação.

### RNF03 - Testabilidade

O sistema deve possuir build e testes locais executáveis sem infraestrutura externa obrigatória.

### RNF04 - Rastreabilidade

As decisões importantes devem ser documentadas em arquivos próprios dentro de docs/.

### RNF05 - Evolutividade

O desenho atual deve permitir troca gradual dos dados em memória por persistência real sem ruptura de contrato.

## Regras Atuais Importantes

1. O login de demonstração usa a conta <admin@infracare.local>.
2. O frontend depende do token local para liberar rotas protegidas.
3. Os módulos exibidos no momento usam dados de demonstração.
4. O backend deve falhar no bootstrap se JWT_SECRET não estiver definido.

## Fora De Escopo Nesta Etapa

- Persistência real com banco em produção.
- Integração com mensageria ou observabilidade externa.
- Notificações em tempo real.
- Workflow completo de aprovação ou escalonamento.
