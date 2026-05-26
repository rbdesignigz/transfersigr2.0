import React, { useState, useEffect } from 'react';
import { Destination, User, ContactMessage } from '../types';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import {
  Settings,
  Trash2,
  PlusCircle,
  Edit,
  RefreshCw,
  Save,
  Unlock,
  Lock,
  X,
  Layers,
  Image as ImageIcon,
  Users,
  Menu,
  LogOut,
  ShieldAlert,
  UserPlus,
  KeyRound,
  Mail,
  UploadCloud,
  Printer
} from 'lucide-react';

interface AdminPanelProps {
  destinations: Destination[];
  onRefresh: () => void;
}

export default function AdminPanel({ destinations, onRefresh }: AdminPanelProps) {
  // Authentication status
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Tab switcher inside Admin Workspace: 'destinations' | 'users' | 'messages'
  const [currentTab, setCurrentTab] = useState<'destinations' | 'users' | 'messages'>('destinations');

  // Mobile sidebar menu drawer state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // USER persistence list
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  // MESSAGES state
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);

  // Form State for editing / creating direct users
  const [isUserEditing, setIsUserEditing] = useState<boolean>(false);
  const [activeUser, setActiveUser] = useState<Partial<User> | null>(null);

  // Form State for editing / creating destination cards
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeDest, setActiveDest] = useState<Partial<Destination> | null>(null);

  // Global Toast notifier
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Push floating message status auto-clear
  const triggerMessage = (text: string, type: 'success' | 'error') => {
    setStatusMsg({ text, type });
    setTimeout(() => {
      setStatusMsg({ text: '', type: null });
    }, 4500);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB to keep things light, though Firebase allows more)
    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen es demasiado grande. Por favor, sube una imagen menor a 2MB.");
      return;
    }

    try {
      setUploadingImage(true);
      setUploadProgress(0);

      const fileExt = file.name.split('.').pop();
      const fileName = `dest_${Date.now()}.${fileExt}`;
      const storageRef = ref(storage, `destinos/${fileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error al subir imagen:", error);
          alert("No se pudo subir la imagen. Verifica los permisos de Storage en Firebase.");
          setUploadingImage(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          if (activeDest) {
            handleChange('imageUrl', downloadURL);
          }
          setUploadingImage(false);
        }
      );
    } catch (error) {
      console.error("Error iniciando subida:", error);
      setUploadingImage(false);
    }
  };

  // -------------------------------------------------------------
  // AUTH ROUTINES
  // -------------------------------------------------------------
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const q = query(
        collection(db, 'users'),
        where('username', '==', usernameInput.toLowerCase()),
        where('password', '==', passwordInput)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        const user = { id: userDoc.id, ...userDoc.data() } as User;
        setCurrentUser(user);
        triggerMessage(`¡Bienvenido, ${user.fullName}!`, 'success');

        if (user.role === 'admin') {
          fetchUsers();
        }
      } else {
        // First-time setup fallback
        if (usernameInput.toLowerCase() === 'admin' && passwordInput === 'admin') {
          const allUsers = await getDocs(collection(db, 'users'));
          if (allUsers.empty) {
            const newUser = { username: 'admin', password: 'admin', role: 'admin', fullName: 'Administrador Principal' };
            const docRef = await addDoc(collection(db, 'users'), newUser);
            const createdUser = { id: docRef.id, ...newUser } as User;
            setCurrentUser(createdUser);
            triggerMessage(`¡Bienvenido, ${createdUser.fullName}! (Configuración Inicial)`, 'success');
            fetchUsers();
            return;
          }
        }
        setAuthError('Clave o usuario incorrectos. Pruebe admin/admin o operador/123');
      }
    } catch (err: any) {
      setAuthError('Fallo al conectar con el servidor.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUsernameInput('admin');
    setPasswordInput('admin');
    setIsEditing(false);
    setIsUserEditing(false);
    setActiveDest(null);
    setActiveUser(null);
    setCurrentTab('destinations');
    triggerMessage('Sesión cerrada correctamente.', 'success');
  };

  // -------------------------------------------------------------
  // USER MANAGEMENT CRUD ROUTINES
  // -------------------------------------------------------------
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const data: User[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as User);
      });
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const data: ContactMessage[] = [];
      querySnapshot.forEach((docSnap) => {
        data.push({ id: docSnap.id, ...docSnap.data() } as ContactMessage);
      });
      // Sort by newest first
      data.sort((a, b) => b.createdAt - a.createdAt);
      setMessages(data);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleAddNewUser = () => {
    setActiveUser({
      fullName: '',
      username: '',
      password: '',
      role: 'usuario'
    });
    setIsUserEditing(true);
  };

  const handleEditUser = (user: User) => {
    // Fill user state for editing, password defaults to empty for optional blanqueo
    setActiveUser({ ...user, password: '' });
    setIsUserEditing(true);
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;

    if (!activeUser.fullName || !activeUser.username) {
      triggerMessage('Por favor, complete el nombre de login y apodo del integrante.', 'error');
      return;
    }

    const isNew = !activeUser.id;
    if (isNew && !activeUser.password) {
      triggerMessage('Debe ingresar una contraseña inicial para el nuevo usuario.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const bodyData: any = {
        fullName: activeUser.fullName,
        username: activeUser.username,
        role: activeUser.role,
      };

      if (activeUser.password && activeUser.password.trim().length > 0) {
        bodyData.password = activeUser.password.trim();
      }

      if (isNew) {
        await addDoc(collection(db, 'users'), bodyData);
        triggerMessage('Usuario dado de alta exitosamente.', 'success');
      } else {
        await updateDoc(doc(db, 'users', activeUser.id as string), bodyData);
        triggerMessage('Datos del usuario / Blanqueo de clave completado con éxito.', 'success');
      }

      setIsUserEditing(false);
      setActiveUser(null);
      fetchUsers();
    } catch (err: any) {
      triggerMessage(`Error en servidor: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === currentUser?.id) {
      triggerMessage('No se puede dar de baja a sí mismo desde la sesión activa.', 'error');
      return;
    }

    if (!window.confirm('⚠️ ¿Está seguro que desea dar de baja este usuario? Esta acción es irreversible.')) return;

    try {
      await deleteDoc(doc(db, 'users', id));
      triggerMessage('Usuario eliminado correctamente de la terminal.', 'success');
      fetchUsers();
    } catch (err: any) {
      triggerMessage(`Error de comunicación: ${err.message}`, 'error');
    }
  };

  const handleResetUsersToDefaults = async () => {
    triggerMessage('Función de reseteo deshabilitada en Firebase.', 'error');
  };

  // -------------------------------------------------------------
  // DESTINATIONS CRUD OPERATIONS
  // -------------------------------------------------------------
  const handleAddNew = () => {
    setActiveDest({
      title: '',
      country: 'Argentina',
      code: 'AR',
      status: 'Activo',
      description: '',
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      price4Pax: 50000,
      price6Pax: 70000,
      price4PaxUsd: 45,
      price6PaxUsd: 65,
    });
    setIsEditing(true);
  };

  const handleEdit = (dest: Destination) => {
    setActiveDest({ ...dest });
    setIsEditing(true);
  };

  const handleChange = (field: keyof Destination, val: any) => {
    if (!activeDest) return;
    const updated = { ...activeDest, [field]: val };

    if (field === 'country') {
      if (val === 'Argentina') updated.code = 'AR';
      else if (val === 'Brasil') updated.code = 'BR';
      else if (val === 'Paraguay') updated.code = 'PY';
    }

    if (field === 'price4Pax') {
      const numVal = Number(val) || 0;
      updated.price6Pax = Math.round(numVal * 1.5);
    }
    
    if (field === 'price4PaxUsd') {
      const numVal = Number(val) || 0;
      updated.price6PaxUsd = Math.round(numVal * 1.5);
    }

    setActiveDest(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDest) return;

    if (!activeDest.title || !activeDest.description) {
      triggerMessage('Por favor complete el título y la descripción.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const isNew = !activeDest.id;
      const dataToSave = { ...activeDest };
      delete dataToSave.id;

      if (isNew) {
        await addDoc(collection(db, 'destinations'), dataToSave);
        triggerMessage('Nuevo destino agregado con éxito.', 'success');
      } else {
        await updateDoc(doc(db, 'destinations', activeDest.id as string), dataToSave);
        triggerMessage('Destino actualizado con éxito.', 'success');
      }

      setIsEditing(false);
      setActiveDest(null);
      onRefresh();
    } catch (err: any) {
      triggerMessage(`Error de servidor: ${err.message}`, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este destino? Esta acción es irreversible.')) return;

    try {
      await deleteDoc(doc(db, 'destinations', id));
      triggerMessage('Destino eliminado de la plataforma.', 'success');
      onRefresh();
    } catch (err: any) {
      triggerMessage(`Error al conectar con servidor: ${err.message}`, 'error');
    }
  };

  const handleResetToDefaults = async () => {
    triggerMessage('Función de reseteo deshabilitada en Firebase.', 'error');
  };

  const handleDeleteMessage = async (id: string) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este mensaje de la bandeja de entrada?')) return;
    try {
      await deleteDoc(doc(db, 'messages', id));
      triggerMessage('Mensaje eliminado.', 'success');
      fetchMessages();
    } catch (err: any) {
      triggerMessage('Error al eliminar mensaje.', 'error');
    }
  };

  // -------------------------------------------------------------
  // UNSERIALIZED RENDER DRAWER MENU
  // -------------------------------------------------------------
  const sidebarNavContent = (
    <div className="flex flex-col h-full bg-[#0f1214] border border-[#65d6e9]/10 rounded-xl text-white p-5 justify-between space-y-8 select-none">
      <div className="space-y-6">

        {/* User administrative profile details block */}
        <div className="p-4 bg-[#0a0c0d] rounded-lg border border-[#65d6e9]/15 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#65d6e9] to-transparent"></div>

          <div className="w-12 h-12 rounded-full bg-[#65d6e9]/5 border border-[#65d6e9]/30 flex items-center justify-center mx-auto mb-2.5">
            <Unlock className="h-5.5 w-5.5 text-[#65d6e9]" />
          </div>

          <h4 className="text-xs font-semibold text-white uppercase tracking-tight truncate">
            {currentUser?.fullName}
          </h4>
          <span className="text-[10px] font-mono text-[#65d6e9]/65 lowercase mt-0.5 block">
            @{currentUser?.username}
          </span>

          <div className="mt-3.5 inline-block px-2.5 py-1 text-[8px] font-mono tracking-widest uppercase font-bold rounded bg-[#65d6e9]/10 text-[#65d6e9] border border-[#65d6e9]/15">
            {currentUser?.role === 'admin' ? '🛡️ Administrador' : '👥 Cooperador'}
          </div>
        </div>

        {/* Dynamic Nav Menu links */}
        <div className="space-y-2 font-mono text-[10px] uppercase tracking-widest">

          <button
            onClick={() => {
              setCurrentTab('destinations');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 p-3.5 rounded-lg transition-all text-left cursor-pointer border ${currentTab === 'destinations'
              ? 'bg-[#65d6e9]/10 text-[#65d6e9] border-[#65d6e9]/30 font-bold shadow-[0_0_12px_rgba(101,214,233,0.05)]'
              : 'text-gray-400 border-transparent hover:text-white hover:bg-[#111415]'
              }`}
          >
            <Layers className="h-4 w-4 text-[#65d6e9]/80" />
            <span>Gestión Tarjetas</span>
          </button>

          <button
            onClick={() => {
              setCurrentTab('messages');
              setSidebarOpen(false);
              fetchMessages();
            }}
            className={`w-full flex items-center gap-3 p-3.5 rounded-lg transition-all text-left cursor-pointer border ${currentTab === 'messages'
              ? 'bg-[#65d6e9]/10 text-[#65d6e9] border-[#65d6e9]/30 font-bold shadow-[0_0_12px_rgba(101,214,233,0.05)]'
              : 'text-gray-400 border-transparent hover:text-white hover:bg-[#111415]'
              }`}
          >
            <Mail className="h-4 w-4 text-[#65d6e9]/80" />
            <span>Bandeja de Entrada</span>
          </button>

          {/* Render ONLY if role === admin */}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                setCurrentTab('users');
                setSidebarOpen(false);
                fetchUsers();
              }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-lg transition-all text-left cursor-pointer border ${currentTab === 'users'
                ? 'bg-[#65d6e9]/10 text-[#65d6e9] border-[#65d6e9]/30 font-bold shadow-[0_0_12px_rgba(101,214,233,0.05)]'
                : 'text-gray-400 border-transparent hover:text-white hover:bg-[#111415]'
                }`}
            >
              <Users className="h-4 w-4 text-[#65d6e9]/80" />
              <span>Gestión Usuarios</span>
            </button>
          )}

        </div>
      </div>

      {/* Logout red execution */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 p-3 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500/50 bg-red-500/5 font-mono text-[9px] tracking-widest uppercase rounded-lg hover:bg-red-500/10 transition-all cursor-pointer"
      >
        <LogOut className="h-3.5 w-3.5" />
        <span>Cerrar Sesión</span>
      </button>
    </div>
  );

  // -------------------------------------------------------------
  // NOT AUTHENTICATED LOG-IN SCREEN
  // -------------------------------------------------------------
  if (!currentUser) {
    return (
      <section className="py-16 max-w-sm mx-auto px-4">
        <div className="bg-[#0f1214] border border-[#65d6e9]/25 rounded-xl p-8 shadow-[0_0_35px_rgba(101,214,233,0.12)] text-center relative space-y-6 overflow-hidden">

          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#65d6e9] to-transparent"></div>

          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full border border-[#65d6e9]/30 bg-[#0a0c0d] flex items-center justify-center">
              <Lock className="h-5.5 w-5.5 text-[#65d6e9] animate-pulse" />
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-display font-black text-white uppercase tracking-tight">
              SISTEMA GERENCIAL INTEGRAL
            </h2>
            <p className="text-[9px] font-mono text-[#65d6e9]/60 uppercase tracking-widest leading-none">
              Control de Accesos // Estación de Datos
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="bg-red-500/10 border border-red-500/30 p-2.5 text-red-400 text-[10px] font-mono rounded text-center leading-normal">
                ⚠ {authError}
              </div>
            )}

            <div className="text-left space-y-3">
              {/* Username field */}
              <div className="space-y-1">
                <label className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                  Usuario o Concesionario:
                </label>
                <input
                  type="text"
                  required
                  className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] p-3 text-white text-center font-mono text-xs rounded focus:outline-none"
                  placeholder="Tu nombre de usuario"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
              </div>

              {/* Password field */}
              <div className="space-y-1">
                <label className="text-[8px] font-mono text-gray-500 uppercase tracking-widest">
                  Contraseña Autorizada:
                </label>
                <input
                  type="password"
                  required
                  className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] p-3 text-white text-center font-mono text-xs rounded focus:outline-none"
                  placeholder="Tu contraseña secreta"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#65d6e9] text-[#0a0c0d] font-mono font-bold uppercase py-3.5 text-xs tracking-widest hover:shadow-[0_0_15px_rgba(101,214,233,0.4)] hover:bg-white transition-all cursor-pointer rounded mt-6"
            >
              CONECTAR AL SISTEMA
            </button>

            {/* Quick Helper guidelines */}

          </form>
        </div>
      </section>
    );
  }

  // -------------------------------------------------------------
  // REPORTING / TARIFF GENERATOR
  // -------------------------------------------------------------
  const generatePricingReport = () => {
    const activeDestinations = destinations.filter(d => d.status === 'Activo');

    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const now = new Date();
    const month = months[now.getMonth()];
    const year = now.getFullYear();

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Tarifario Transfers Aeropuerto</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"></script>
        <style>
          body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            color: #111;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 40px;
          }
          /* Modern Header */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 4px solid #65d6e9;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header-left {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }
          .header-left img {
            max-height: 55px;
            object-fit: contain;
          }
          .header-left .tagline {
            font-weight: 700;
            font-style: italic;
            color: #005f73;
            font-size: 16px;
          }
          .header-left .phone {
            font-weight: 900;
            font-size: 19px;
            display: flex;
            align-items: center;
            gap: 5px;
            color: #111;
          }
          .header-center {
            text-align: center;
            background: #005f73;
            color: white;
            padding: 12px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          }
          .header-center #qrcode {
            background: white;
            padding: 6px;
            border-radius: 6px;
            margin-bottom: 6px;
          }
          .header-center span {
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 0.5px;
          }
          .header-right {
            font-size: 13px;
            font-weight: 700;
            line-height: 1.7;
            color: #005f73;
            text-align: right;
          }
          .header-right .social-item {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 6px;
            color: #111;
          }
          .title-banner {
            background: linear-gradient(90deg, #005f73 0%, #0a9396 100%);
            color: white;
            text-align: center;
            padding: 16px;
            font-size: 20px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 25px;
            border-radius: 6px;
            box-shadow: 0 4px 15px rgba(10, 147, 150, 0.2);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
          }
          th, td {
            border-bottom: 1px solid #e2e8f0;
            padding: 10px 12px;
            text-align: right;
          }
          th {
            background-color: #f8fafc;
            color: #475569;
            font-size: 11px;
            text-transform: uppercase;
            text-align: center;
            border-bottom: 2px solid #cbd5e1;
          }
          td:first-child, th:first-child {
            text-align: left;
            font-weight: 700;
            font-size: 12px;
            color: #334155;
          }
          tr:nth-child(even) {
            background-color: #f8fafc;
          }
          .controls {
            text-align: center;
            margin-bottom: 20px;
            padding: 20px;
            background: #f1f5f9;
            border-bottom: 1px solid #e2e8f0;
          }
          .controls button {
            background: #0ea5e9;
            color: white;
            border: none;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            margin: 0 10px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            transition: all 0.2s;
          }
          .controls button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
          }
          @media print {
            body { margin: 0; background: white; }
            .container { padding: 10px; max-width: 100%; }
            .controls { display: none; }
            .title-banner { 
              background: #005f73 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .header-center {
              background: #005f73 !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        </style>
      </head>
      <body>
        <div class="controls">
          <button onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
          <button onclick="shareLink()" style="background: #10b981;">📲 Compartir Enlace Web</button>
        </div>
        
        <div class="container">
          <div class="header">
            <div class="header-left">
              <img src="/logo.png" alt="Transfers Aeropuerto" onerror="this.style.display='none'" />
              <div class="tagline">40 años de experiencia</div>
              <div class="phone">📞 +54 9 3757 368041</div>
            </div>
            
            <div class="header-center">
              <div id="qrcode"></div>
              <span>www.transfersigr.com</span>
            </div>
            
            <div class="header-right">
              <div style="color: #005f73; margin-bottom: 5px;">Seguinos en nuestras Redes</div>
              <div class="social-item">📷 @transfersaeropuerto</div>
              <div class="social-item">📘 Transfer Aeropuerto</div>
              <div class="social-item">🎵 transfers.aero</div>
            </div>
          </div>

          <div class="title-banner">
            TARIFARIO DESDE ${month.toUpperCase()} ${year}
          </div>

          <table>
            <thead>
              <tr>
                <th>DESTINO / SERVICIO</th>
                <th>HASTA 4 PAX (ARS)</th>
                <th>HASTA 6 PAX (ARS)</th>
                <th>HASTA 4 PAX (USD)</th>
                <th>HASTA 6 PAX (USD)</th>
              </tr>
            </thead>
            <tbody>
              ${activeDestinations.map(d => `
                <tr>
                  <td>${d.title}</td>
                  <td>$ ${d.price4Pax.toLocaleString()}</td>
                  <td>$ ${d.price6Pax.toLocaleString()}</td>
                  <td>$ ${d.price4PaxUsd}</td>
                  <td>$ ${d.price6PaxUsd}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <script>
          // Build QR code visually
          try {
            var qr = qrcode(4, 'L');
            qr.addData('https://www.transfersigr.com');
            qr.make();
            document.getElementById('qrcode').innerHTML = qr.createImgTag(3, 0);
          } catch(e) { console.error('QR Error', e); }

          function shareLink() {
            if (navigator.share) {
              navigator.share({
                title: 'Tarifario Transfers Aeropuerto',
                text: 'Mirá nuestros precios de traslados y excursiones actualizados.',
                url: 'https://www.transfersigr.com'
              }).catch((error) => console.log('Error compartiendo', error));
            } else {
              alert('Copia este enlace para enviarlo: https://www.transfersigr.com');
            }
          }
        </script>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      alert('Por favor, permite las ventanas emergentes (pop-ups) en tu navegador para generar el tarifario.');
    }
  };

  // -------------------------------------------------------------
  // MASTER ADMINISTRATIVE VIEW LAYOUT (LOGGED IN)
  // -------------------------------------------------------------
  return (
    <section className="py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6">

      {/* Toast notifications pop-up */}
      {statusMsg.text && (
        <div className={`fixed bottom-4 right-4 z-50 p-4 rounded-xl border shadow-2xl font-mono text-[10px] uppercase tracking-wider flex justify-between items-center gap-4 transition-all duration-300 ${statusMsg.type === 'success'
          ? 'bg-[#0f1214] border-emerald-500/40 text-emerald-400 shadow-emerald-500/10'
          : 'bg-[#0f1214] border-red-500/40 text-red-500 shadow-red-500/10'
          }`}>
          <span>✔ {statusMsg.text}</span>
          <button onClick={() => setStatusMsg({ text: '', type: null })} className="text-gray-500 hover:text-white cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* TOP HEADER STATUS ROW (MOBILE NAVIGATION BAR COALESCING) */}
      <div className="flex lg:hidden justify-between items-center bg-[#0f1214] border border-[#65d6e9]/10 p-4 rounded-xl mb-6 gap-3 shadow-lg">
        <div className="flex items-center gap-2.5">
          <Settings className="h-5 w-5 text-[#65d6e9] animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <h3 className="text-xs font-display font-extrabold text-white uppercase tracking-tight">Consola Administrativa</h3>
            <p className="text-[8px] font-mono text-gray-500 uppercase leading-none block">
              {currentUser.fullName} // {currentUser.role === 'admin' ? 'ADMIN' : 'COOPERADOR'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-[#65d6e9]/10 border border-[#65d6e9]/25 text-[#65d6e9] hover:bg-[#65d6e9] hover:text-[#0a0c0d] px-3.5 py-2 rounded text-[10px] font-mono tracking-wider font-bold transition-all cursor-pointer flex items-center gap-1.5"
        >
          <Menu className="h-3.5 w-3.5" />
          <span>MENÚ APPARATUS</span>
        </button>
      </div>

      {/* CORESIDE DOUBLE LAYOUT WORKSPACE */}
      <div className="flex flex-col lg:flex-row gap-6 items-start relative min-h-[550px]">

        {/* Mobile slide drawer overlay backdrop background */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/80 z-40 lg:hidden transition-all duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* PERSISTENT SIDEBAR IN DESKTOP, SWIPABLE DRAWER ON MOBILE DEVICES */}
        <aside className={`
          fixed top-[88px] bottom-0 left-0 w-64 z-50 p-4 lg:p-0 
          lg:static lg:h-auto lg:top-auto lg:block shrink-0
          transition-transform duration-300 ease-out-back
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {sidebarNavContent}
        </aside>

        {/* SECOND SECTION PANEL: WORKSPACE MAIN ACTIONS */}
        <div className="flex-grow w-full space-y-6">

          {/* ========================================================= */}
          {/* TAB 1: DESTINATIONS CARDS CONFIGURATION MANAGEMENT */}
          {/* ========================================================= */}
          {currentTab === 'destinations' && (
            <div className="space-y-6 animate-fade-in text-left">

              {/* Cards Control Dashboard Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0f1214] border border-gray-800 p-5 rounded-xl gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-display font-extrabold text-white uppercase tracking-tight">
                    GESTIÓN DE TARJETAS DE DESTINO
                  </h3>
                  <p className="text-[9px] font-mono text-gray-500 uppercase mt-1 tracking-wider">
                    Permite agregar, editar y eliminar destinos mostrados automáticamente de manera sincronizada.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 sm:pt-0 w-full sm:w-auto">
                  <button
                    onClick={generatePricingReport}
                    type="button"
                    className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] hover:border-emerald-400 hover:bg-emerald-500 hover:text-black px-3.5 py-2 rounded transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-widest mr-auto sm:mr-0"
                    title="Generar Tarifario PDF/Imprimible"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Generar Tarifario
                  </button>

                  <button
                    onClick={handleResetToDefaults}
                    type="button"
                    className="bg-transparent border border-gray-800 text-gray-400 font-mono text-[9px] hover:text-red-400 hover:border-red-500/20 px-3.5 py-2 rounded hover:bg-gray-900 transition-all cursor-pointer uppercase tracking-widest"
                  >
                    Fábrica
                  </button>

                  <button
                    onClick={onRefresh}
                    type="button"
                    className="bg-transparent border border-gray-800 text-gray-300 font-mono text-[9px] hover:border-[#65d6e9]/30 hover:text-[#65d6e9] px-3.5 py-2 rounded transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-widest"
                    title="Actualizar del servidor"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Re-Sync
                  </button>

                  <button
                    onClick={handleAddNew}
                    type="button"
                    className="bg-[#65d6e9] text-[#0a0c0d] font-mono text-[9px] font-bold uppercase px-4 py-2 rounded hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(101,214,233,0.3)] tracking-widest ml-auto"
                  >
                    <PlusCircle className="h-3.5 w-3.5" />
                    Alta Destino
                  </button>
                </div>
              </div>

              {/* DESTINATIONS CARD FORM DRAWER */}
              {isEditing && activeDest && (
                <div className="bg-[#0f1214] border border-[#65d6e9]/30 rounded-xl p-5 sm:p-6 md:p-8 space-y-6 shadow-2xl relative animate-slide-up">

                  <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-800">
                    <h3 className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-tight">
                      {activeDest.id ? `Editar Destino: "${activeDest.title}"` : 'Crear Nueva Tarjeta de Destino'}
                    </h3>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                      <span className="bg-[#65d6e9]/10 text-[#65d6e9] border border-[#65d6e9]/30 text-[9px] font-mono px-3 py-1 rounded">
                        RECURSO INTERNO DE ENTRADAS
                      </span>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setActiveDest(null);
                        }}
                        className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded cursor-pointer"
                        title="Cerrar editor"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

                      {/* Card Title */}
                      <div>
                        <label className="block text-gray-400 font-mono text-[9px] uppercase tracking-widest mb-1.5">
                          Título del destino *
                        </label>
                        <input
                          required
                          type="text"
                          className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 text-white font-sans text-xs focus:outline-none"
                          placeholder="Ej. Cataratas del Lado Argentino"
                          value={activeDest.title || ''}
                          onChange={(e) => handleChange('title', e.target.value)}
                        />
                      </div>

                      {/* Country Selector */}
                      <div>
                        <label className="block text-gray-400 font-mono text-[9px] uppercase tracking-widest mb-1.5">
                          País de Destino *
                        </label>
                        <select
                          required
                          className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 text-white font-mono text-xs focus:outline-none"
                          value={activeDest.country || 'Argentina'}
                          onChange={(e) => handleChange('country', e.target.value)}
                        >
                          <option value="Argentina">Argentina (Código AR)</option>
                          <option value="Brasil">Brasil (Código BR)</option>
                          <option value="Paraguay">Paraguay (Código PY)</option>
                        </select>
                      </div>

                      {/* Status Selector */}
                      <div>
                        <label className="block text-gray-400 font-mono text-[9px] uppercase tracking-widest mb-1.5">
                          Estado de Tarjeta *
                        </label>
                        <select
                          required
                          className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 text-white font-mono text-xs focus:outline-none"
                          value={activeDest.status || 'Activo'}
                          onChange={(e) => handleChange('status', e.target.value)}
                        >
                          <option value="Activo">Activo (Visible en portada)</option>
                          <option value="Inactivo">Inactivo (Inhabilitado / Oculto)</option>
                        </select>
                      </div>

                    </div>

                    {/* Description Text area */}
                    <div>
                      <label className="block text-gray-400 font-mono text-[9px] uppercase tracking-widest mb-1.5">
                        Descripción descriptiva del trayecto e hitos turísticos *
                      </label>
                      <textarea
                        required
                        rows={3}
                        className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 text-white font-sans text-xs focus:outline-none"
                        placeholder="Visite las majestuosas cataratas del lado argentino con su famosa pasarela a la Garganta del Diablo..."
                        value={activeDest.description || ''}
                        onChange={(e) => handleChange('description', e.target.value)}
                      />
                    </div>

                    {/* Image URL with Visual Preview */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">

                      <div className="md:col-span-3">
                        <label className="block text-gray-400 font-mono text-[9px] uppercase tracking-widest mb-1.5 flex justify-between">
                          <span>Imagen del Destino</span>
                          <span className="text-[#65d6e9]/50 lower text-[8px]">Se recomiendan horizontales</span>
                        </label>
                        
                        <div className="flex gap-2 items-center">
                          <div className="relative flex-grow">
                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#65d6e9]/70" />
                            <input
                              type="url"
                              className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 pl-10 pr-2 text-white font-mono text-xs focus:outline-none"
                              placeholder="https://... o sube una imagen 👉"
                              value={activeDest.imageUrl || ''}
                              onChange={(e) => handleChange('imageUrl', e.target.value)}
                            />
                          </div>
                          
                          <div className="relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageUpload}
                              disabled={uploadingImage}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <button 
                              type="button"
                              disabled={uploadingImage}
                              className="h-11 px-4 bg-[#0a0c0d] border border-[#65d6e9]/40 hover:border-[#65d6e9] hover:bg-[#65d6e9]/10 text-[#65d6e9] rounded flex items-center justify-center gap-2 transition-all min-w-[120px]"
                            >
                              {uploadingImage ? (
                                <span className="font-mono text-xs">{uploadProgress}%</span>
                              ) : (
                                <>
                                  <UploadCloud className="h-4 w-4" />
                                  <span className="font-mono text-[10px] tracking-widest uppercase">Subir</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Visual Tiny Image preview */}
                      <div className="h-11 bg-[#0a0c0d] border border-gray-800 rounded overflow-hidden flex items-center justify-center p-0.5">
                        {activeDest.imageUrl ? (
                          <img
                            src={activeDest.imageUrl}
                            alt="Pre-vista"
                            className="w-full h-full object-cover rounded-sm"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80';
                            }}
                          />
                        ) : (
                          <span className="text-[8px] font-mono text-gray-600 uppercase">Sin Imagen</span>
                        )}
                      </div>

                    </div>

                    {/* Prices Section */}
                    <div className="border-t border-gray-800 pt-6 space-y-4">
                      <h4 className="text-white font-mono text-[10px] font-bold uppercase tracking-widest text-[#65d6e9]/80">
                        💵 LISTADO DE PRECIOS REGULADOS POR CAPACIDAD
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">

                        <div>
                          <label className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">
                            Auto ≤ 4 Pax (ARS $)
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 font-mono text-xs text-white text-right focus:outline-none"
                            value={activeDest.price4Pax || 0}
                            onChange={(e) => handleChange('price4Pax', Number(e.target.value))}
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">
                            Van ≤ 6 Pax (ARS $)
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 font-mono text-xs text-white text-right focus:outline-none"
                            value={activeDest.price6Pax || 0}
                            onChange={(e) => handleChange('price6Pax', Number(e.target.value))}
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">
                            Auto ≤ 4 Pax (USD $)
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 font-mono text-xs text-white text-right focus:outline-none"
                            value={activeDest.price4PaxUsd || 0}
                            onChange={(e) => handleChange('price4PaxUsd', Number(e.target.value))}
                          />
                        </div>

                        <div>
                          <label className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-1.5">
                            Van ≤ 6 Pax (USD $)
                          </label>
                          <input
                            type="number"
                            required
                            min={0}
                            className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 font-mono text-xs text-white text-right focus:outline-none"
                            value={activeDest.price6PaxUsd || 0}
                            onChange={(e) => handleChange('price6PaxUsd', Number(e.target.value))}
                          />
                        </div>

                      </div>
                    </div>

                    {/* Back action and Save */}
                    <div className="flex justify-end gap-3 pt-5 border-t border-gray-800 font-mono text-[10px] uppercase tracking-wider">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setActiveDest(null);
                        }}
                        className="px-5 py-3 border border-transparent hover:border-gray-800 rounded text-gray-400 hover:text-white transition-all cursor-pointer font-bold"
                        disabled={submitting}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#65d6e9] text-[#0a0c0d] font-bold px-7 py-3 rounded hover:shadow-[0_0_20px_rgba(101,214,233,0.5)] hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                        {submitting ? 'Guardando...' : 'Grabar y Sincronizar'}
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* LISTING TABLE GRID OF DESTIONATIONS */}
              <div className="bg-[#0f1214] border border-gray-800 rounded-xl overflow-hidden shadow-xl text-left">
                <div className="p-4 bg-[#111415] border-b border-gray-800 flex justify-between items-center font-mono">
                  <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">
                    📂 Tarjetas Sincronizadas ({destinations.length})
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase">
                    Triple Frontera Argentina - Brasil - Paraguay
                  </span>
                </div>

                <div className="overflow-x-auto">
                  {destinations.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 font-mono text-xs uppercase">
                      No hay destinos cargados en la base de datos.
                    </div>
                  ) : (
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="bg-[#0a0c0d] text-gray-500 uppercase text-[9px] tracking-widest border-b border-gray-800">
                          <th className="p-4 text-left">ACCIONES</th>
                          <th className="p-4">IMAGEN</th>
                          <th className="p-4">TÍTULO / DESTINO</th>
                          <th className="p-4">PAÍS / FILTRO</th>
                          <th className="p-4">ARS (4 PAX / 6 PAX)</th>
                          <th className="p-4">USD (4 PAX / 6 PAX)</th>
                          <th className="p-4">ESTADO</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {destinations.map((dest) => (
                          <tr key={dest.id} className="hover:bg-[#111415]/50 transition-colors">

                            {/* Actions Column (pencil and bin only - labels are hidden on mobile) */}
                            <td className="p-4 text-left">
                              <div className="flex gap-2 justify-start items-center">
                                <button
                                  onClick={() => handleEdit(dest)}
                                  className="p-2 sm:px-3 border border-gray-800 text-gray-300 hover:text-[#65d6e9] hover:border-[#65d6e9]/40 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer bg-gray-900/40"
                                  title="Modificar destino"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline text-[9px] uppercase tracking-wider font-bold">Editar</span>
                                </button>

                                <button
                                  onClick={() => handleDelete(dest.id)}
                                  className="p-2 sm:px-3 border border-transparent text-gray-500 hover:text-red-400 hover:border-red-500/25 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                                  title="Eliminar tarjeta"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline text-[9px] uppercase tracking-wider font-bold">Borrar</span>
                                </button>
                              </div>
                            </td>

                            {/* Visual Tiny Image preview */}
                            <td className="p-4">
                              <div className="w-12 h-10 rounded bg-[#0a0c0d] overflow-hidden border border-gray-800">
                                <img
                                  src={dest.imageUrl}
                                  alt={dest.title}
                                  className="w-full h-full object-cover animate-fade-in"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=60&q=80';
                                  }}
                                />
                              </div>
                            </td>

                            {/* Title / Description info */}
                            <td className="p-4 max-w-xs">
                              <div className="text-white font-semibold text-xs sm:text-sm truncate leading-snug">{dest.title}</div>
                              <div className="text-[9px] text-gray-500 font-sans line-clamp-1 mt-0.5">{dest.description}</div>
                            </td>

                            {/* Country and filter categorization */}
                            <td className="p-4">
                              <span className="text-gray-300 block text-[11px] font-semibold leading-tight">{dest.country}</span>
                              <span className="text-[8px] text-[#65d6e9] bg-[#65d6e9]/10 px-2 py-0.5 rounded border border-[#65d6e9]/20 font-bold inline-block mt-0.5">
                                {dest.code}
                              </span>
                            </td>

                            {/* ARS pricing */}
                            <td className="p-4 text-[10px] sm:text-xs">
                              <div className="text-gray-300">4 pax: <strong className="text-white">${dest.price4Pax?.toLocaleString()}</strong></div>
                              <div className="text-gray-500 mt-0.5">6 pax: ${dest.price6Pax?.toLocaleString()}</div>
                            </td>

                            {/* USD pricing */}
                            <td className="p-4 text-[10px] sm:text-xs text-emerald-400">
                              <div>4 pax: <strong className="text-emerald-300">${dest.price4PaxUsd}</strong></div>
                              <div className="text-emerald-600 mt-0.5">6 pax: ${dest.price6PaxUsd}</div>
                            </td>

                            {/* Card Visibility Tag Status */}
                            <td className="p-4">
                              <span className={`px-2 py-0.5 text-[8px] font-extrabold rounded uppercase tracking-wider ${dest.status === 'Activo'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                }`}>
                                {dest.status}
                              </span>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: USER CREDENTIALS & PRIVILEGE STATUS (restricted roles) */}
          {/* ========================================================= */}
          {currentTab === 'users' && currentUser.role === 'admin' && (
            <div className="space-y-6 animate-fade-in text-left">

              {/* User management control dashboard bar */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0f1214] border border-gray-800 p-5 rounded-xl gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-display font-extrabold text-white uppercase tracking-tight">
                    INTEGRANTES Y CREDENCIALES DE ACCESO
                  </h3>
                  <p className="text-[9px] font-mono text-gray-500 uppercase mt-1 tracking-wider">
                    Exclusivo Administrador: blanqueo de claves, asignación de roles de cooperación y altas de personal.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 sm:pt-0 w-full sm:w-auto">
                  <button
                    onClick={handleResetUsersToDefaults}
                    type="button"
                    className="bg-transparent border border-gray-800 text-gray-400 font-mono text-[9px] hover:text-red-400 hover:border-red-500/20 px-3.5 py-2 rounded hover:bg-gray-900 transition-all cursor-pointer uppercase tracking-widest"
                  >
                    Resetear
                  </button>

                  <button
                    onClick={fetchUsers}
                    type="button"
                    className="bg-transparent border border-gray-800 text-gray-300 font-mono text-[9px] hover:border-[#65d6e9]/30 hover:text-[#65d6e9] px-3.5 py-2 rounded transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-widest"
                    title="Actualizar listado de integrantes"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Re-Sync
                  </button>

                  <button
                    onClick={handleAddNewUser}
                    type="button"
                    className="bg-[#65d6e9] text-[#0a0c0d] font-mono text-[9px] font-bold uppercase px-4 py-2 rounded hover:bg-white transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(101,214,233,0.3)] tracking-widest ml-auto"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Alta Usuario
                  </button>
                </div>
              </div>

              {/* USER REGISTRATION / MODIFICATION AND PASSWORD RESET BLANQUEO MODAL */}
              {isUserEditing && activeUser && (
                <div className="bg-[#0f1214] border border-[#65d6e9]/25 rounded-xl p-5 sm:p-6 md:p-8 space-y-6 shadow-2xl relative animate-slide-up">

                  <div className="flex flex-col-reverse sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-800">
                    <h3 className="text-sm sm:text-base font-display font-bold text-white uppercase tracking-tight">
                      {activeUser.id ? `Modificar Usuario: "${activeUser.fullName}" // Blanqueo` : 'Registrar Nuevo Cooperador'}
                    </h3>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-3">
                      <span className="bg-[#65d6e9]/10 text-[#65d6e9] border border-[#65d6e9]/30 text-[9px] font-mono px-3 py-1 rounded">
                        GESTIÓN DE PRIVILEGIOS DE ACCESOS
                      </span>
                      <button
                        onClick={() => {
                          setIsUserEditing(false);
                          setActiveUser(null);
                        }}
                        className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded cursor-pointer"
                        title="Cerrar editor de usuario"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSubmitUser} className="space-y-6 text-left font-mono">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sans">

                      {/* Name of the system member */}
                      <div className="font-sans">
                        <label className="block text-gray-400 font-mono text-[9px] uppercase tracking-widest mb-1.5">
                          Nombre Completo del Operador *
                        </label>
                        <input
                          required
                          type="text"
                          className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 text-white font-sans text-xs focus:outline-none"
                          placeholder="Ej. Juan de Iguazú"
                          value={activeUser.fullName || ''}
                          onChange={(e) => setActiveUser({ ...activeUser, fullName: e.target.value })}
                        />
                      </div>

                      {/* Login username identification */}
                      <div>
                        <label className="block text-gray-400 font-mono text-[9px] uppercase tracking-widest mb-1.5">
                          Nombre de Usuario (Login Identifier) *
                        </label>
                        <input
                          required
                          type="text"
                          disabled={!!activeUser.id}
                          className={`w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 text-white font-mono text-xs focus:outline-none ${activeUser.id ? 'opacity-55 cursor-not-allowed' : ''
                            }`}
                          placeholder="Ej. juan.iguazu"
                          value={activeUser.username || ''}
                          onChange={(e) => setActiveUser({ ...activeUser, username: e.target.value })}
                        />
                        {activeUser.id && (
                          <span className="text-[8px] text-gray-600 block mt-1.5">Los identificadores de usuario no se pueden renombrar una vez fijados.</span>
                        )}
                      </div>

                      {/* User Password / Optional Blanqueo Reset keys */}
                      <div>
                        <label className="block text-gray-400 font-mono text-[9px] uppercase tracking-widest mb-1.5">
                          Contraseña / Clave de Acceso *
                        </label>
                        <input
                          required={!activeUser.id}
                          type="text"
                          className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 text-white font-mono text-xs focus:outline-none"
                          placeholder={activeUser.id ? 'Escriba nueva clave para blanquear contraseña' : 'Ej. juanClave456'}
                          value={activeUser.password || ''}
                          onChange={(e) => setActiveUser({ ...activeUser, password: e.target.value })}
                        />
                        {activeUser.id && (
                          <span className="text-[8px] text-[#65d6e9]/50 block mt-1.5">Deje vacío si solo desea actualizar datos complementarios sin blanquear su contraseña.</span>
                        )}
                      </div>

                      {/* User privilege roles picker */}
                      <div>
                        <label className="block text-gray-400 font-mono text-[9px] uppercase tracking-widest mb-1.5">
                          Rol Operativo Asignado *
                        </label>
                        <select
                          required
                          className="w-full bg-[#0a0c0d] border border-gray-800 focus:border-[#65d6e9] rounded p-2.5 text-white font-mono text-xs focus:outline-none"
                          value={activeUser.role || 'usuario'}
                          onChange={(e) => setActiveUser({ ...activeUser, role: e.target.value as 'admin' | 'usuario' })}
                        >
                          <option value="usuario">Rol Usuario (Creación y edición de tarjetas únicamente)</option>
                          <option value="admin">Rol Admin (Control total de tarjetas, claves e integrantes)</option>
                        </select>
                      </div>

                    </div>

                    {/* Submit or cancel user buttons section */}
                    <div className="flex justify-end gap-3 pt-5 border-t border-gray-800 font-mono text-[10px] uppercase tracking-wider">
                      <button
                        type="button"
                        onClick={() => {
                          setIsUserEditing(false);
                          setActiveUser(null);
                        }}
                        className="px-5 py-3 border border-transparent hover:border-gray-800 rounded text-gray-400 hover:text-white transition-all cursor-pointer font-bold"
                        disabled={submitting}
                      >
                        Cancelar
                      </button>

                      <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#65d6e9] text-[#0a0c0d] font-bold px-7 py-3 rounded hover:shadow-[0_0_20px_rgba(101,214,233,0.5)] hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Save className="h-4 w-4" />
                        {submitting ? 'Guardando...' : 'Fijar Credenciales y Grabar'}
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* LISTING DATATABLE FOR COOPERATIVE USERS */}
              <div className="bg-[#0f1214] border border-gray-800 rounded-xl overflow-hidden shadow-xl text-left">
                <div className="p-4 bg-[#111415] border-b border-gray-800 flex justify-between items-center font-mono">
                  <span className="text-gray-400 text-[10px] sm:text-xs uppercase tracking-widest">
                    📂 Integrantes de la Plataforma ({users.length})
                  </span>
                  <span className="text-[8px] sm:text-[9px] text-gray-500 uppercase">
                    Terminal Internacional Iguazú (Triple Frontera)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  {loadingUsers ? (
                    <div className="p-12 text-center text-gray-500 font-mono text-xs uppercase animate-pulse">
                      Consultando base de datos segura de integrantes...
                    </div>
                  ) : users.length === 0 ? (
                    <div className="p-12 text-center text-gray-500 font-mono text-xs uppercase">
                      No hay usuarios cargados en este momento.
                    </div>
                  ) : (
                    <table className="w-full text-left font-mono text-xs">
                      <thead>
                        <tr className="bg-[#0a0c0d] text-gray-500 uppercase text-[9px] tracking-widest border-b border-gray-800">
                          <th className="p-4">ACCIONES DE CONTROL</th>
                          <th className="p-4">APODO / NOMBRE</th>
                          <th className="p-4">IDENTIFICADOR (LOGIN)</th>
                          <th className="p-4">CLAVE ORIGINAL</th>
                          <th className="p-4">ROL ASIGNADO</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-800">
                        {users.map((item) => (
                          <tr key={item.id} className="hover:bg-[#111415]/50 transition-colors">

                            {/* Controls Column (pencil and bin only - labels are hidden on mobile) */}
                            <td className="p-4">
                              <div className="flex gap-2 justify-start items-center">
                                <button
                                  onClick={() => handleEditUser(item)}
                                  className="p-2 sm:px-3 border border-gray-800 text-gray-300 hover:text-[#65d6e9] hover:border-[#65d6e9]/40 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer bg-gray-900/40"
                                  title="Blanquear contraseña // Editar apodo"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline text-[9px] uppercase tracking-wider font-bold">Blanquear / Editar</span>
                                </button>

                                <button
                                  onClick={() => handleDeleteUser(item.id)}
                                  className="p-2 sm:px-3 border border-transparent text-gray-500 hover:text-red-400 hover:border-red-500/25 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                                  title="Dar de baja este integrante"
                                  disabled={item.id === 'u-1' || item.id === 'u-admin'}
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span className="hidden sm:inline text-[9px] uppercase tracking-wider font-bold">Baja</span>
                                </button>
                              </div>
                            </td>

                            {/* Full Name */}
                            <td className="p-4">
                              <div className="text-white font-semibold text-xs sm:text-sm">{item.fullName}</div>
                            </td>

                            {/* Login details */}
                            <td className="p-4 text-emerald-400 font-mono text-xs">
                              @{item.username}
                            </td>

                            {/* Visible password string for simple blanqueo operations review */}
                            <td className="p-4 text-gray-400 font-mono text-xs">
                              <code>{item.password || '••••••'}</code>
                            </td>

                            {/* Privilege Role Tag */}
                            <td className="p-4">
                              <span className={`px-2.5 py-1 text-[8px] sm:text-[9px] font-extrabold rounded uppercase tracking-wider inline-block ${item.role === 'admin'
                                ? 'bg-[#65d6e9]/10 text-[#65d6e9] border border-[#65d6e9]/20'
                                : 'bg-gray-800 text-gray-400 border border-gray-700'
                                }`}>
                                {item.role === 'admin' ? '🛡️ Administrador' : '👥 Cooperador'}
                              </span>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: CONTACT MESSAGES INBOX */}
          {/* ========================================================= */}
          {currentTab === 'messages' && (
            <div className="space-y-6 animate-fade-in text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#0f1214] border border-gray-800 p-5 rounded-xl gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-display font-extrabold text-white uppercase tracking-tight">
                    Bandeja de Entrada
                  </h3>
                  <p className="text-[9px] font-mono text-gray-500 uppercase mt-1 tracking-wider">
                    Consultas recibidas desde el formulario de contacto público.
                  </p>
                </div>
                <button
                  onClick={fetchMessages}
                  type="button"
                  className="bg-transparent border border-gray-800 text-gray-300 font-mono text-[9px] hover:border-[#65d6e9]/30 hover:text-[#65d6e9] px-3.5 py-2 rounded transition-all cursor-pointer flex items-center gap-1.5 uppercase tracking-widest"
                >
                  <RefreshCw className="h-3 w-3" />
                  Actualizar
                </button>
              </div>

              {loadingMessages ? (
                <div className="p-12 text-center text-gray-500 font-mono text-xs uppercase animate-pulse bg-[#0f1214] border border-gray-800 rounded-xl">
                  Buscando mensajes nuevos...
                </div>
              ) : messages.length === 0 ? (
                <div className="p-12 text-center text-gray-500 font-mono text-xs uppercase bg-[#0f1214] border border-gray-800 rounded-xl">
                  La bandeja de entrada está vacía.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="bg-[#0f1214] border border-gray-800 rounded-xl p-5 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-[#65d6e9]/50"></div>

                      <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                        <div>
                          <h4 className="text-white font-bold text-sm">{msg.name}</h4>
                          <p className="text-[#65d6e9] text-xs font-mono">{msg.email}</p>
                          <p className="text-gray-400 text-xs font-mono">{msg.phone || 'Sin teléfono'}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-gray-800 text-gray-300 text-[10px] font-mono px-2 py-1 rounded uppercase tracking-wider">
                            Asunto: {msg.subject}
                          </span>
                          <p className="text-gray-500 text-[9px] font-mono uppercase mt-2">
                            {new Date(msg.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#0a0c0d] border border-gray-800 rounded p-4 text-gray-300 text-sm font-sans whitespace-pre-wrap">
                        {msg.message}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => handleDeleteMessage(msg.id!)}
                          className="text-gray-500 hover:text-red-400 border border-transparent hover:border-red-500/30 px-3 py-1.5 rounded flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[10px] uppercase"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
