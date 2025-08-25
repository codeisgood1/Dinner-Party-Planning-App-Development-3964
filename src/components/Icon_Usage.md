```jsx
// ✅ Always use SafeIcon.jsx for rendering icons.
// ❌ Never import icons directly from react-icons in your components.

// ----------------------------------------------------------------------
// ✅ How to Import Icons (Best Practice)
// ----------------------------------------------------------------------
import * as FiIcons from 'react-icons/fi';
const { FiTarget, FiPlus, FiCheck, FiClock, FiTrendingUp } = FiIcons;
import SafeIcon from './common/SafeIcon';

// ----------------------------------------------------------------------
// ✅ Example Usage in a Component
// ----------------------------------------------------------------------
function App() {
  return (
    <>
      <SafeIcon icon={FiCheck} className="text-2xl text-green-400" />
    </>
  );
}

export default App;
```