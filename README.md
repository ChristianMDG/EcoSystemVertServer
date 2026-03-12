# EcoSystemVert

## Description
EcoSystemVert is a project focused on ecological systems and vertical integration. This repository contains code and documentation for sustainable environmental solutions.

## Features
- Modular architecture
- Scalable design
- Environmental monitoring capabilities

## Installation
```bash
git clone https://github.com/yourusername/EcoSystemVert.git
cd EcoSystemVert

creer un ficher .env sur la racine backend
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://username:motdepasse@localhost:5432/nomdelabase"

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="7d"

# CORS
CORS_ORIGIN="http://localhost:5173"
```

creer un fichier .env dans la racine du client 
VITE_API_URL=http://localhost:5000

## Usage
```bash
# Add usage examples here
cd backend
npm install
npx prisma generate
npx prisma migrate dev --init
npm run seed
npm run dev 

cd client 
npm install 
npm run dev 

```

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
MIT

## Contact
For questions or feedback, please open an issue in the repository.