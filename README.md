# Inventory Management System

Sistema de controle de estoque desenvolvido para gerenciar produtos, matérias-primas e calcular sugestões de produção baseadas no estoque disponível, conforme solicitado no teste técnico da Autoflex.

## 📋 Descrição

Este sistema permite o controle completo de:

- **Produtos**: Cadastro com código, nome e valor
- **Matérias-Primas**: Cadastro com código, nome e quantidade em estoque
- **Associação Produto-Matéria-Prima**: Relacionamento entre produtos e as matérias-primas necessárias para sua produção, com quantidades requeridas
- **Sugestão de Produção**: Algoritmo que calcula quais produtos podem ser produzidos com o estoque disponível, priorizando produtos de maior valor

## 🏗️ Arquitetura

O sistema foi desenvolvido seguindo o padrão de **API REST**, separando completamente o backend do frontend:

- **Backend**: API REST desenvolvida com Spring Boot
- **Frontend**: Interface web desenvolvida com React e TypeScript
- **Banco de Dados**: PostgreSQL

## 🛠️ Tecnologias Utilizadas

### Backend

- **Java 17**
- **Spring Boot 3.5.10**
  - Spring Data JPA
  - Spring Web
  - Spring Validation
- **PostgreSQL 16**
- **Lombok**
- **Maven**

### Frontend

- **React 19.2.0**
- **TypeScript 5.9.3**
- **Material-UI (MUI) 7.3.7**
- **React Router DOM 7.13.0**
- **Axios 1.13.4**
- **Vite 7.2.4**
- **Vitest 4.0.18** (para testes)

### Banco de Dados

- **PostgreSQL 16** (via Docker Compose)

## 📁 Estrutura do Projeto

```
autoflex/
├── autoflex-backend/
│   ├── docker-compose.yml          # Configuração do PostgreSQL
│   └── inventory-api/
│       └── inventory-api/
│           ├── src/
│           │   ├── main/
│           │   │   ├── java/com/yago/inventory_api/
│           │   │   │   ├── bom/                    # Bill of Materials (Produto-Matéria-Prima)
│           │   │   │   ├── product/                # Entidade e CRUD de Produtos
│           │   │   │   ├── rawmaterial/            # Entidade e CRUD de Matérias-Primas
│           │   │   │   ├── production/             # Lógica de sugestão de produção
│           │   │   │   ├── common/                 # Exceções e utilitários
│           │   │   │   └── config/                 # Configurações (CORS)
│           │   │   └── resources/
│           │   │       └── application.yml         # Configurações da aplicação
│           │   └── test/                           # Testes unitários e de integração
│           └── pom.xml
└── autoflex-frontend/
    └── inventory-frontend/
        ├── src/
        │   ├── api/                                # Clientes HTTP para a API
        │   ├── components/                         # Componentes reutilizáveis
        │   ├── pages/                              # Páginas da aplicação
        │   │   ├── products/                      # CRUD de Produtos
        │   │   ├── raw-materials/                 # CRUD de Matérias-Primas
        │   │   └── production/                     # Sugestões de Produção
        │   └── App.tsx
        ├── package.json
        └── vite.config.ts
```

## 🗄️ Estrutura do Banco de Dados

### Tabelas

#### `products`

- `id` (BIGINT, PK, AUTO_INCREMENT)
- `code` (VARCHAR, UNIQUE, NOT NULL)
- `name` (VARCHAR, NOT NULL)
- `price` (DECIMAL(12,2), NOT NULL)

#### `raw_materials`

- `id` (BIGINT, PK, AUTO_INCREMENT)
- `code` (VARCHAR, UNIQUE, NOT NULL)
- `name` (VARCHAR, NOT NULL)
- `stock_quantity` (DECIMAL(18,3), NOT NULL)

#### `product_materials`

- `id` (BIGINT, PK, AUTO_INCREMENT)
- `product_id` (BIGINT, FK → products.id, NOT NULL)
- `raw_material_id` (BIGINT, FK → raw_materials.id, NOT NULL)
- `required_quantity` (DECIMAL(18,3), NOT NULL)
- UNIQUE(product_id, raw_material_id)

## 🚀 Como Executar

### Pré-requisitos

- Java 17 ou superior
- Maven 3.6+
- Node.js 18+ e npm
- Docker e Docker Compose (para o banco de dados)

### 1. Iniciar o Banco de Dados

```bash
cd autoflex-backend
docker-compose up -d
```

Isso iniciará um container PostgreSQL na porta **5433** com:

- Database: `inventory`
- Username: `inventory`
- Password: `inventory`

### 2. Executar o Backend

```bash
cd autoflex-backend/inventory-api/inventory-api
mvn spring-boot:run
```

O backend estará disponível em: `http://localhost:8080`

### 3. Executar o Frontend

```bash
cd autoflex-frontend/inventory-frontend
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173` (ou outra porta indicada pelo Vite)

## 📡 API Endpoints

### Products

- `GET /api/products` - Lista todos os produtos
- `GET /api/products/{id}` - Busca produto por ID
- `POST /api/products` - Cria um novo produto
- `PUT /api/products/{id}` - Atualiza um produto
- `DELETE /api/products/{id}` - Remove um produto

### Raw Materials

- `GET /api/raw-materials` - Lista todas as matérias-primas
- `GET /api/raw-materials/{id}` - Busca matéria-prima por ID
- `POST /api/raw-materials` - Cria uma nova matéria-prima
- `PUT /api/raw-materials/{id}` - Atualiza uma matéria-prima
- `DELETE /api/raw-materials/{id}` - Remove uma matéria-prima

### Product Materials (BOM)

- `GET /api/product-materials?productId={productId}` - Lista matérias-primas de um produto
- `POST /api/product-materials` - Associa matéria-prima a um produto
- `PUT /api/product-materials/{id}` - Atualiza associação
- `DELETE /api/product-materials/{id}` - Remove associação

### Production

- `GET /api/production/suggestions` - Retorna sugestões de produção

### Health Check

- `GET /api/health` - Verifica status da API

## ✨ Funcionalidades Implementadas

### ✅ Requisitos Funcionais

- **RF001** ✅ CRUD completo de produtos (Backend)
- **RF002** ✅ CRUD completo de matérias-primas (Backend)
- **RF003** ✅ CRUD completo de associação produto-matéria-prima (Backend)
- **RF004** ✅ Consulta de produtos produzíveis com estoque disponível (Backend)
- **RF005** ✅ Interface gráfica para CRUD de produtos (Frontend)
- **RF006** ✅ Interface gráfica para CRUD de matérias-primas (Frontend)
- **RF007** ✅ Interface gráfica para associar matérias-primas aos produtos (Frontend)
- **RF008** ✅ Interface gráfica para listar sugestões de produção (Frontend)

### ✅ Requisitos Não Funcionais

- **RNF001** ✅ Sistema web compatível com principais navegadores
- **RNF002** ✅ Arquitetura API (Backend/Frontend separados)
- **RNF003** ✅ Interface responsiva (Material-UI)
- **RNF004** ✅ Persistência em PostgreSQL
- **RNF005** ✅ Backend com Spring Boot
- **RNF006** ✅ Frontend com React
- **RNF007** ✅ Código em inglês

### 🎯 Algoritmo de Sugestão de Produção

O sistema implementa um algoritmo inteligente que:

1. **Prioriza produtos por valor**: Ordena produtos do maior para o menor preço
2. **Calcula quantidade produzível**: Para cada produto, calcula quantas unidades podem ser produzidas com base no estoque disponível de cada matéria-prima necessária
3. **Consome estoque**: Ao sugerir a produção de um produto, o estoque das matérias-primas é consumido, evitando que a mesma matéria-prima seja alocada para múltiplos produtos
4. **Retorna valor total**: Calcula o valor total que será obtido com a produção sugerida

**Exemplo:**

- Produto A (R$ 1000) precisa de 2 unidades de Matéria-Prima X
- Produto B (R$ 100) precisa de 1 unidade de Matéria-Prima X
- Estoque disponível: 10 unidades de Matéria-Prima X

**Resultado:** O sistema sugere produzir 5 unidades do Produto A (maior valor), consumindo todas as 10 unidades disponíveis, resultando em R$ 5.000,00.

## 🧪 Testes

### Backend

Testes unitários e de integração implementados:

```bash
cd autoflex-backend/inventory-api/inventory-api
mvn test
```

**Testes implementados:**

- `ProductionServiceTest` - Testes unitários do serviço de produção
- `ProductControllerIT` - Testes de integração do controller de produtos

### Frontend

Testes unitários implementados com Vitest:

```bash
cd autoflex-frontend/inventory-frontend
npm test
```

**Testes implementados:**

- `ProductsPage.test.tsx` - Testes da página de produtos
- `ProductionPage.test.tsx` - Testes da página de produção

## 🎨 Interface do Usuário

A interface foi desenvolvida com Material-UI, oferecendo:

- **Design moderno e responsivo**
- **Navegação intuitiva** com menu superior
- **Formulários modais** para criação/edição
- **Tabelas interativas** com ações de editar/excluir
- **Feedback visual** para operações

### Páginas Disponíveis

1. **Produtos** (`/products`)
   - Lista todos os produtos
   - Criar/Editar/Excluir produtos
   - Gerenciar matérias-primas de cada produto

2. **Matérias-Primas** (`/raw-materials`)
   - Lista todas as matérias-primas
   - Criar/Editar/Excluir matérias-primas
   - Visualizar quantidade em estoque

3. **Produção** (`/production`)
   - Visualiza sugestões de produção
   - Mostra quantidade produzível de cada produto
   - Exibe valor total estimado

## 🔧 Configurações

### Backend

As configurações do backend estão em `application.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:postgresql://localhost:5433/inventory
    username: inventory
    password: inventory
  jpa:
    hibernate:
      ddl-auto: update
```

### Frontend

O frontend está configurado para se comunicar com a API em `http://localhost:8080`. A configuração pode ser ajustada no arquivo de configuração da API.

## 📝 Notas de Desenvolvimento

- O código foi desenvolvido seguindo boas práticas de Clean Code
- Nomenclatura em inglês conforme especificado
- Tratamento de exceções centralizado com `GlobalExceptionHandler`
- Validação de dados com Bean Validation
- CORS configurado para permitir comunicação entre frontend e backend
- Interface responsiva que funciona em diferentes tamanhos de tela

## 👤 Autor

Desenvolvido por Yago Fontanez como teste técnico para Autoflex.

## 📄 Licença

Este projeto foi desenvolvido para fins de avaliação técnica.
