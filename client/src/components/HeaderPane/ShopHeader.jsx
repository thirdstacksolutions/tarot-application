// import { Link } from 'react-router-dom';
// import { useTheme } from '../../pages/Settings/ThemeContext';
// import { useContext } from 'react';
// import { CookieSettingsContext } from '../../pages/Settings/SettingsRight/CookiesSettings';
// import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

// const ShopHeader = () => {
//     const { theme } = useTheme();

//     const { preferences } = useContext(CookieSettingsContext);

//     return (
//         <header
//             style={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 boxSizing: 'border-box',
//                 padding: '.5rem 1rem',
//                 // position: 'fixed',
//                 top: '0',
//                 width: '100%',
//                 zIndex: 1000,
//                 boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
//                 backgroundImage: `url(${theme.headerImage})`,
//                 backgroundSize: 'cover'
//             }}>
//             <div>
//                 <Link to='/'>
//                     <img
//                         src={theme.logo}
//                         alt='Tarot Deck Logo'
//                         style={{
//                             width: '75px',
//                             height: '75px',
//                             borderRadius: '50%',
//                             border: `4px solid ${theme.avatarSettingsBorder}`
//                         }}
//                     />{' '}
//                 </Link>
//             </div>
//             <div
//                 style={{
//                     display: 'flex',
//                     alignItems: 'center',
//                     color: theme.h2TextColor,
//                     fontSize: '1.5rem'
//                 }}
//             >
//                 <span style={{ marginRight: '10px' }}>Cart</span>
//                 <ShoppingCartIcon style={{ fontSize: '2rem', color: theme.h2TextColor }} />
//             </div>
//         </header>
//     );
// };

// export default ShopHeader;
