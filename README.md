# Sistema de Consultas Mobile

Aplicativo mobile para gerenciamento de consultas médicas desenvolvido com React Native, Expo e TypeScript.

## 📱 Sobre o Projeto

Este é um aplicativo mobile desenvolvido como parte das aulas de React Native. O sistema permite:
- Visualizar lista de consultas médicas
- Ver detalhes de cada consulta
- Confirmar consultas agendadas
- Cancelar consultas
- Agendar novas consultas (em desenvolvimento)

## 🏗️ Estrutura do Projeto

```
sistema-consultas-mobile/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ConsultaCard.tsx
│   │   ├── Loading.tsx
│   │   ├── EmptyState.tsx
│   │   └── index.ts
│   │
│   ├── screens/             # Telas da aplicação
│   │   ├── HomeScreen.tsx
│   │   ├── ConsultasListScreen.tsx
│   │   ├── ConsultaDetalhesScreen.tsx
│   │   ├── NovaConsultaScreen.tsx
│   │   └── index.ts
│   │
│   ├── navigation/          # Configuração de rotas
│   │   └── index.tsx
│   │
│   ├── services/            # Lógica de negócio e API
│   │   ├── consultasService.ts
│   │   ├── apiService.ts
│   │   ├── storageService.ts
│   │   ├── mockData.ts
│   │   └── index.ts
│   │
│   ├── types/               # Modelagem TypeScript
│   │   └── index.ts
│   │
│   └── utils/               # Funções utilitárias
│       ├── formatters.ts
│       └── validators.ts
│
├── App.tsx                  # Componente raiz
├── index.ts                 # Ponto de entrada
├── app.json                 # Configuração do Expo
├── package.json
└── tsconfig.json
```

## 🎯 Conceitos Aplicados

### TypeScript
- ✅ Type Alias
- ✅ Union Types
- ✅ Literal Types
- ✅ Omit e Partial
- ✅ Record
- ✅ Generics (preparado em apiService)

### React Native
- ✅ Componentes funcionais
- ✅ Hooks (useState, useEffect)
- ✅ StyleSheet
- ✅ FlatList
- ✅ TouchableOpacity
- ✅ Alert

### React Navigation
- ✅ Stack Navigator
- ✅ Navegação entre telas
- ✅ Passagem de parâmetros
- ✅ Tipagem de rotas

### Arquitetura
- ✅ Separação de responsabilidades
- ✅ Services para lógica de negócio
- ✅ Componentes reutilizáveis
- ✅ Mock data para desenvolvimento
- ✅ Preparado para API real

## 🚀 Como Executar

### Instalar Dependências
```bash
npm install
```

### Iniciar o Servidor de Desenvolvimento
```bash
npm start
```

### Executar no Navegador (Web)
```bash
npm run web
```
Ou pressione `w` no terminal após executar `npm start`.

### Executar no Android
```bash
npm run android
```
Ou pressione `a` no terminal após executar `npm start`.

### Executar no iOS (macOS apenas)
```bash
npm run ios
```
Ou pressione `i` no terminal após executar `npm start`.

### Executar com Expo Go
1. Instale o app **Expo Go** no seu celular
2. Execute `npm start`
3. Escaneie o QR Code com a câmera (iOS) ou com o app Expo Go (Android)

## 📦 Dependências Principais

- **React Native**: Framework mobile
- **Expo**: Plataforma e ferramentas
- **TypeScript**: Tipagem estática
- **React Navigation**: Navegação entre telas
- **@react-native-async-storage/async-storage**: Persistência local (preparado)

## 📚 Histórico de Aulas

### Aula 26/02/2026 - MVP Inicial
- ✅ Criação do projeto com Expo
- ✅ Configuração do TypeScript
- ✅ Primeiro componente com estado
- ✅ Estilização com StyleSheet
- ✅ Versionamento no GitHub

### Aula 04/03/2026 - Arquitetura e Navegação
- ✅ Criação da estrutura de pastas `src/`
- ✅ Separação de types, components, screens, services e utils
- ✅ Implementação do React Navigation
- ✅ Criação de componentes reutilizáveis
- ✅ Service layer com mock data
- ✅ Preparação para AsyncStorage e API

## 🎨 Telas Implementadas

### 1. HomeScreen
Tela inicial com menu de navegação em cards coloridos.

### 2. ConsultasListScreen
Lista de consultas com filtros por status (Todas, Agendadas, Confirmadas).

### 3. ConsultaDetalhesScreen
Visualização detalhada de uma consulta com opções de confirmar/cancelar.

### 4. NovaConsultaScreen
Formulário para agendar nova consulta (stub - em desenvolvimento).

## 🔄 Próximos Passos

- [ ] Instalar e integrar AsyncStorage
- [ ] Implementar formulário de nova consulta
- [ ] Criar tela de perfil do usuário
- [ ] Implementar autenticação
- [ ] Integrar com API real
- [ ] Adicionar testes unitários
- [ ] Implementar notificações push

## 👨‍💻 Desenvolvimento

Este projeto foi desenvolvido seguindo as melhores práticas de:
- Clean Code
- SOLID principles
- Component-based architecture
- Type safety com TypeScript
- Git workflow profissional

## 📄 Licença

Este projeto é parte de material educacional.

---

**Desenvolvido com ❤️ por [Seu Nome]**
