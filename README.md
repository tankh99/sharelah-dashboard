# ShareLah Dashboard

A comprehensive dashboard for managing umbrella rental operations, built with Next.js, React Hook Form, Zod validation, and Tailwind CSS.

## Features

### 🔐 Authentication
- User login system with role-based access control
- Secure session management
- Demo credentials: `admin@example.com` / `password`

### 👥 User Management
- **CRUD Operations**: Create, Read, Update, Delete users
- **User Properties**:
  - Personal information (name, date of birth, gender)
  - Contact details (phone, email)
  - Authentication (password with verification)
  - Role management (Admin, User, Moderator)
  - Device and social media integration
  - Status tracking (Active, Inactive, Suspended)

### 🏪 Stall Management
- **CRUD Operations**: Manage umbrella rental stalls
- **Stall Properties**:
  - Basic information (name, code, device name)
  - Location coordinates (latitude/longitude)
  - Capacity (umbrella count)
  - Status management (Draft, Approved, Rejected)
- **Location Support**: Manual coordinate input with future Google Maps integration

### 💰 Transaction Management
- **CRUD Operations**: Track umbrella rentals
- **Transaction Properties**:
  - User and stall associations
  - Financial tracking (amount)
  - Time management (borrow/return dates)
  - Audit trail (creation/update timestamps)

### 🎨 UI Components
- **Responsive Design**: Mobile-first approach with responsive tables
- **Modern Interface**: Clean, professional dashboard layout
- **Form Components**: Reusable form inputs with validation
- **Data Tables**: Sortable, searchable data presentation
- **Status Badges**: Visual status indicators with color coding

## Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling
- **Icons**: Lucide React
- **State Management**: React Context API
- **Date Handling**: date-fns, react-day-picker

## Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── dashboard/         # Dashboard pages
│   │   ├── users/        # User management
│   │   ├── stalls/       # Stall management
│   │   └── transactions/ # Transaction management
│   ├── layout.tsx        # Root layout with AuthProvider
│   └── page.tsx          # Home page with login/dashboard
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard layout components
│   ├── forms/            # Form components
│   └── ui/               # Base UI components
├── contexts/              # React contexts
│   └── AuthContext.tsx   # Authentication state management
└── lib/                   # Utility libraries
    ├── enums.ts          # TypeScript enums
    ├── types.ts          # TypeScript interfaces
    └── validations.ts    # Zod validation schemas
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sharelah-dashboard-new
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run the development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Login
- **Email**: `admin@example.com`
- **Password**: `password`

## Usage

### Dashboard Navigation
- **Home**: Overview with statistics and recent activity
- **Users**: Manage user accounts and permissions
- **Stalls**: Configure rental locations and devices
- **Transactions**: Track umbrella rentals and payments

### Form Operations
- **Create**: Add new records using intuitive forms
- **Edit**: Modify existing records inline
- **Delete**: Remove records with confirmation
- **View**: Browse data in organized tables

### Data Management
- **Real-time Updates**: Changes reflect immediately in the UI
- **Validation**: Form inputs validated with Zod schemas
- **Error Handling**: User-friendly error messages
- **Loading States**: Visual feedback during operations

## Form Components

The dashboard utilizes a comprehensive set of form components:

- **FormTextInput**: Text, email, password inputs
- **FormSelect**: Dropdown selections
- **FormDatePicker**: Date and time selection
- **FormCheckboxes**: Multi-select options
- **FormRadioButtons**: Single-choice selections

All components include:
- Built-in validation
- Error message display
- Loading states
- Accessibility features

## Validation

Data validation is handled by Zod schemas:

- **User Validation**: Personal info, contact details, authentication
- **Stall Validation**: Location coordinates, capacity limits
- **Transaction Validation**: Date logic, amount validation

## Future Enhancements

- **Google Maps Integration**: Visual location picker for stalls
- **Real-time Updates**: WebSocket integration for live data
- **Advanced Filtering**: Search and filter capabilities
- **Export Functionality**: Data export to CSV/PDF
- **Analytics Dashboard**: Charts and reporting
- **Mobile App**: React Native companion app
- **API Integration**: Backend service integration
- **Multi-language Support**: Internationalization

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
