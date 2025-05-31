// components/layout/Sidebar.jsx
function Sidebar() {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Home', icon: HomeIcon },
    { path: '/dashboard', label: 'Dashboard', icon: ChartIcon },
    { path: '/profile', label: 'Profile', icon: UserIcon }
  ]

  return (
    <nav className="bg-gray-800 text-white w-64 h-screen">
      {navItems.map(item => (
        <Link
          key={item.path}
          to={item.path}
          className={`flex items-center p-4 hover:bg-gray-700 ${
            location.pathname === item.path ? 'bg-gray-700' : ''
          }`}
        >
          <item.icon className="w-5 h-5 mr-3" />
          {item.label}
        </Link>
      ))}
    </nav>
  )
}