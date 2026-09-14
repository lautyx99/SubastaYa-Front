import Container from 'react-bootstrap/Container'
import Header from './Header'

function MainLayout({ children }) {
  return (
    <div className="bg-light min-vh-100">
      <Header />
      <Container className="py-4">{children}</Container>
    </div>
  )
}

export default MainLayout