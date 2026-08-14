# Plano: adicionar CPF/CNPJ ao formulário de inscrição

## Objetivo
Incluir no modal/formulário de inscrição um campo para o usuário informar seu CPF ou CNPJ, com máscara dinâmica, validação e envio dos dados ao webhook.

## O que será alterado

### 1. Estado e validação do formulário (`src/routes/index.tsx`)
- Adicionar `documento` e `tipoDocumento` (`cpf` | `cnpj`) no hook `useRegistrationForm`.
- Criar funções de máscara e validação:
  - CPF: `000.000.000-00`, validar dígitos verificadores.
  - CNPJ: `00.000.000/0000-00`, validar dígitos verificadores.
- Incluir `documento` nos erros de validação.

### 2. Layout do campo no `FormFields`
- Adicionar linha com:
  - Select "Documento" (CPF / CNPJ).
  - Input formatado conforme o tipo selecionado.
- Aplicar máscara em tempo real no `onChange`.
- Exibir mensagem de erro quando inválido.

### 3. Envio dos dados
- Incluir `documento` (somente números) e `tipo_documento` no payload enviado ao `WEBHOOK_URL`.

### 4. Verificação
- Rodar o typecheck/build para garantir que não há erros de tipagem.
- Validar visualmente o campo no modal e no formulário inline (se houver).
