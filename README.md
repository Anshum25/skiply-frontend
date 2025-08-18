# Skiply - Smart Queue Booking Platform

A comprehensive React-based queue management platform that allows users to book spots in queues for local businesses like hospitals, banks, salons, restaurants, and government offices.

## 🚀 Features

### For Customers

- **Smart Queue Booking**: Book your spot in advance and skip physical waiting
- **Real-time Updates**: Live queue tracking with position and estimated wait times
- **Location-based Search**: Find nearby businesses and services
- **Category Filtering**: Browse by business type (hospitals, salons, banks, etc.)
- **Booking Management**: Track active bookings and view history
- **Mobile-responsive Design**: Optimized for all devices

### For Business Owners

- **Queue Management Dashboard**: Manage multiple departments and services
- **Real-time Analytics**: Track bookings, wait times, and customer flow
- **Department Configuration**: Set up services with custom wait times and capacity
- **Booking Approval System**: Option to manually approve or auto-accept bookings
- **Customer Communication**: View customer details and special requests
- **Business Settings**: Configure operating hours and booking preferences

### For Administrators

- **Platform Overview**: Monitor all users, businesses, and bookings
- **User Management**: View and manage customer and business accounts
- **Analytics Dashboard**: Platform-wide statistics and trends
- **Business Approval**: Review and approve new business registrations
- **System Health Monitoring**: Track platform performance and uptime

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router 6
- **UI Components**: ShadCN UI + Radix UI
- **Styling**: TailwindCSS with glassmorphism effects
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form + Zod validation
- **State Management**: React Context API
- **HTTP Client**: Axios (planned)
- **Icons**: Lucide React

## 📱 Pages & Routes

### Public Routes

- `/` - Landing page with hero section and service discovery
- `/login` - Role-based authentication (Customer/Business/Admin)
- `/signup-user` - Customer registration
- `/signup-business` - Business owner registration

### Customer Routes (Protected)

- `/home` - Browse and search businesses
- `/business/:id` - Business detail page with booking
- `/queue/:id` - Live queue tracker
- `/profile` - User profile and booking history

### Business Routes (Protected)

- `/dashboard` - Business management dashboard

### Admin Routes (Protected)

- `/admin` - Platform administration panel

## 🎨 Design System

### Color Palette

- **Primary**: Blue to Purple gradient (#3B82F6 to #8B5CF6)
- **Background**: Glassmorphism with backdrop blur
- **Cards**: Semi-transparent with border highlights
- **Status Colors**: Green (success), Yellow (warning), Red (error), Blue (info)

### Typography

- **Headings**: Bold, gradient text effects
- **Body**: Clean, readable sans-serif
- **UI Elements**: Balanced spacing and contrast

### Components

- **Glassmorphism Cards**: Semi-transparent backgrounds with blur effects
- **Gradient Buttons**: Smooth hover transitions
- **Animated Elements**: Framer Motion for page transitions
- **Responsive Grid**: Mobile-first design approach

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd skiply-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔐 Authentication & Demo Accounts

The app includes mock authentication with demo accounts:

### Customer Account

- **Email**: john@example.com
- **Password**: password123

### Business Owner Account

- **Email**: sarah@cityhospital.com
- **Password**: password123

### Admin Account

- **Email**: admin@skiply.com
- **Password**: admin123

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # ShadCN UI components
│   ├── Navigation.tsx  # Main navigation bar
│   ├── BusinessCard.tsx # Business listing card
│   ├── QueueBookingModal.tsx # Multi-step booking modal
│   └── ...
├── pages/              # Page components
│   ├── Landing.tsx     # Homepage
│   ├── Login.tsx       # Authentication
│   ├── UserHome.tsx    # Customer dashboard
│   ├── BusinessDashboard.tsx # Business management
│   └── ...
├── contexts/           # React Context providers
│   ├── AuthContext.tsx # Authentication state
│   └── AppContext.tsx  # Global app state
├── lib/                # Utilities and services
│   ├── api.ts          # Mock API functions
│   ├── types.ts        # TypeScript definitions
│   ├── constants.ts    # App constants
│   └── utils.ts        # Helper functions
├── hooks/              # Custom React hooks
└── App.tsx             # Main app component
```

## 🔧 Key Features Implementation

### State Management

- **AuthContext**: Handles user authentication, login/logout, and user role management
- **AppContext**: Manages global app state including businesses, bookings, and filters

### Mock API Layer

- Simulates real backend functionality with localStorage persistence
- Includes realistic data for testing all features
- Proper error handling and loading states

### Role-based Access Control

- Protected routes based on user roles (customer, business owner, admin)
- Dynamic navigation based on authentication state
- Route guards to prevent unauthorized access

### Real-time Queue Simulation

- Mock real-time updates for queue positions
- Estimated wait time calculations
- Live status tracking for bookings

## 🎯 Business Logic

### Queue Management

- **Token System**: Sequential numbering for queue positions
- **Capacity Limits**: Maximum queue sizes per department
- **Wait Time Estimation**: Dynamic calculation based on service time
- **Status Tracking**: Waiting → In Progress → Completed/Cancelled

### Booking Flow

1. **Service Discovery**: Browse businesses by location and category
2. **Department Selection**: Choose specific service within business
3. **Information Collection**: Customer details and special requests
4. **Confirmation**: Review and confirm booking details
5. **Queue Tracking**: Real-time position monitoring

### Business Management

- **Multi-department Support**: Different services with individual queues
- **Flexible Scheduling**: Custom wait times and capacity per service
- **Customer Management**: View and approve bookings
- **Analytics**: Track performance metrics and customer satisfaction

## 🔮 Future Enhancements

### Backend Integration

- RESTful API with Node.js + Express
- MongoDB database with Mongoose ODM
- Socket.IO for real-time updates
- JWT authentication with refresh tokens

### Advanced Features

- **GPS Integration**: Accurate location-based search
- **Push Notifications**: Real-time alerts for queue updates
- **Payment Integration**: Booking fees and service charges
- **Review System**: Customer feedback and ratings
- **Multi-language Support**: Internationalization
- **Calendar Integration**: Sync with personal calendars

### Mobile App

- React Native implementation
- Offline queue tracking
- Camera integration for QR code scanning
- Push notifications

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- Email: support@skiply.com
- Documentation: [Project Wiki](link-to-wiki)
- Issues: [GitHub Issues](link-to-issues)

---

**Built with ❤️ using React, TypeScript, and modern web technologies.**
