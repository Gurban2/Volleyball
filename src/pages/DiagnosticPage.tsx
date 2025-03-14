import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { auth, db, storage } from '../firebase/config';
import { getDoc, doc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';

const DiagnosticPage: React.FC = () => {
  const { currentUser, userData, authError } = useAuth();
  const [diagnosticResults, setDiagnosticResults] = useState<{
    authState: 'success' | 'warning' | 'error';
    authMessage: string;
    dbState: 'success' | 'warning' | 'error';
    dbMessage: string;
    storageState: 'success' | 'warning' | 'error';
    storageMessage: string;
    photoUrl: string | null;
  }>({
    authState: 'warning',
    authMessage: 'Проверка аутентификации...',
    dbState: 'warning',
    dbMessage: 'Проверка базы данных...',
    storageState: 'warning',
    storageMessage: 'Проверка хранилища...',
    photoUrl: null
  });
  
  const [isRunningTests, setIsRunningTests] = useState(false);

  useEffect(() => {
    // Проверка состояния аутентификации
    if (currentUser) {
      setDiagnosticResults(prev => ({
        ...prev,
        authState: 'success',
        authMessage: `Аутентификация работает. Пользователь: ${currentUser.email}`
      }));
    } else if (authError) {
      setDiagnosticResults(prev => ({
        ...prev,
        authState: 'error',
        authMessage: `Ошибка аутентификации: ${authError}`
      }));
    } else {
      setDiagnosticResults(prev => ({
        ...prev,
        authState: 'warning',
        authMessage: 'Пользователь не авторизован'
      }));
    }
    
    // Проверка данных пользователя
    if (userData) {
      setDiagnosticResults(prev => ({
        ...prev,
        dbState: 'success',
        dbMessage: 'База данных работает, данные пользователя загружены'
      }));
    } else if (currentUser) {
      setDiagnosticResults(prev => ({
        ...prev,
        dbState: 'error',
        dbMessage: 'Данные пользователя не загружены, хотя пользователь авторизован'
      }));
    }
  }, [currentUser, userData, authError]);

  const runDiagnostics = async () => {
    setIsRunningTests(true);
    
    try {
      // Проверка Firestore
      setDiagnosticResults(prev => ({
        ...prev,
        dbState: 'warning',
        dbMessage: 'Проверка подключения к Firestore...'
      }));
      
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (docSnap.exists()) {
            setDiagnosticResults(prev => ({
              ...prev,
              dbState: 'success',
              dbMessage: 'Firestore работает, документ пользователя найден'
            }));
          } else {
            setDiagnosticResults(prev => ({
              ...prev,
              dbState: 'error',
              dbMessage: 'Документ пользователя не найден в Firestore'
            }));
          }
        } catch (error: any) {
          setDiagnosticResults(prev => ({
            ...prev,
            dbState: 'error',
            dbMessage: `Ошибка при обращении к Firestore: ${error.message}`
          }));
        }
      }
      
      // Проверка Storage
      setDiagnosticResults(prev => ({
        ...prev,
        storageState: 'warning',
        storageMessage: 'Проверка Firebase Storage...'
      }));
      
      if (currentUser) {
        try {
          // Создаем тестовое изображение (маленький base64 PNG)
          const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
          const storageRef = ref(storage, `test-uploads/${currentUser.uid}/test-image.png`);
          
          // Загружаем изображение
          await uploadString(storageRef, testImage, 'data_url');
          
          // Получаем URL
          const downloadURL = await getDownloadURL(storageRef);
          
          setDiagnosticResults(prev => ({
            ...prev,
            storageState: 'success',
            storageMessage: 'Firebase Storage работает, тестовая загрузка выполнена успешно',
            photoUrl: downloadURL
          }));
        } catch (error: any) {
          setDiagnosticResults(prev => ({
            ...prev,
            storageState: 'error',
            storageMessage: `Ошибка при тестировании Firebase Storage: ${error.message}`
          }));
        }
      }
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <PageContainer>
      <div className="container">
        <PageHeader>
          <PageTitle>Диагностика Firebase</PageTitle>
          <PageDescription>
            Эта страница показывает состояние подключения к Firebase и помогает диагностировать проблемы
          </PageDescription>
        </PageHeader>

        <DiagnosticContainer
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <DiagnosticSection>
            <SectionTitle>Состояние Firebase</SectionTitle>
            
            <ResultItem state={diagnosticResults.authState}>
              {diagnosticResults.authState === 'success' && <FiCheckCircle />}
              {diagnosticResults.authState === 'warning' && <FiInfo />}
              {diagnosticResults.authState === 'error' && <FiAlertCircle />}
              <ResultText>{diagnosticResults.authMessage}</ResultText>
            </ResultItem>
            
            <ResultItem state={diagnosticResults.dbState}>
              {diagnosticResults.dbState === 'success' && <FiCheckCircle />}
              {diagnosticResults.dbState === 'warning' && <FiInfo />}
              {diagnosticResults.dbState === 'error' && <FiAlertCircle />}
              <ResultText>{diagnosticResults.dbMessage}</ResultText>
            </ResultItem>
            
            <ResultItem state={diagnosticResults.storageState}>
              {diagnosticResults.storageState === 'success' && <FiCheckCircle />}
              {diagnosticResults.storageState === 'warning' && <FiInfo />}
              {diagnosticResults.storageState === 'error' && <FiAlertCircle />}
              <ResultText>{diagnosticResults.storageMessage}</ResultText>
            </ResultItem>
            
            {diagnosticResults.photoUrl && (
              <TestImageContainer>
                <TestImage src={diagnosticResults.photoUrl} alt="Тестовое изображение" />
                <TestImageCaption>
                  Успешно загруженное тестовое изображение из Firebase Storage
                </TestImageCaption>
              </TestImageContainer>
            )}
          </DiagnosticSection>

          <DiagnosticSection>
            <SectionTitle>Диагностика</SectionTitle>
            
            <DiagnosticActions>
              <Button
                onClick={runDiagnostics}
                variant="primary"
                disabled={isRunningTests}
              >
                {isRunningTests ? 'Выполнение тестов...' : 'Запустить тесты'}
              </Button>
              
              <Button 
                as={Link} 
                to="/login" 
                variant="outlined"
              >
                Перейти на страницу входа
              </Button>
              
              <Button
                onClick={() => {
                  localStorage.clear();
                  sessionStorage.clear();
                  window.location.reload();
                }}
                variant="danger"
              >
                Очистить хранилище и перезагрузить
              </Button>
            </DiagnosticActions>
            
            {currentUser && userData && (
              <UserDataSection>
                <SectionTitle>Данные пользователя</SectionTitle>
                <UserDataList>
                  <UserDataItem>
                    <UserDataLabel>ID:</UserDataLabel>
                    <UserDataValue>{currentUser.uid}</UserDataValue>
                  </UserDataItem>
                  <UserDataItem>
                    <UserDataLabel>Email:</UserDataLabel>
                    <UserDataValue>{currentUser.email}</UserDataValue>
                  </UserDataItem>
                  <UserDataItem>
                    <UserDataLabel>Имя:</UserDataLabel>
                    <UserDataValue>{userData.displayName || 'Не указано'}</UserDataValue>
                  </UserDataItem>
                  <UserDataItem>
                    <UserDataLabel>Роль:</UserDataLabel>
                    <UserDataValue>{userData.role}</UserDataValue>
                  </UserDataItem>
                  <UserDataItem>
                    <UserDataLabel>Профиль заполнен:</UserDataLabel>
                    <UserDataValue>{userData.profileCompleted ? 'Да' : 'Нет'}</UserDataValue>
                  </UserDataItem>
                  {userData.nickname && (
                    <UserDataItem>
                      <UserDataLabel>Никнейм:</UserDataLabel>
                      <UserDataValue>{userData.nickname}</UserDataValue>
                    </UserDataItem>
                  )}
                  {userData.age && (
                    <UserDataItem>
                      <UserDataLabel>Возраст:</UserDataLabel>
                      <UserDataValue>{userData.age}</UserDataValue>
                    </UserDataItem>
                  )}
                  {userData.height && (
                    <UserDataItem>
                      <UserDataLabel>Рост:</UserDataLabel>
                      <UserDataValue>{userData.height} см</UserDataValue>
                    </UserDataItem>
                  )}
                </UserDataList>
              </UserDataSection>
            )}
          </DiagnosticSection>
        </DiagnosticContainer>
      </div>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  padding: ${({ theme }) => theme.space.xl} 0;
`;

const PageHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.space.xl};
  text-align: center;
`;

const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const PageDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto;
`;

const DiagnosticContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: ${({ theme }) => theme.radii.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  max-width: 800px;
  margin: 0 auto;
`;

const DiagnosticSection = styled.div`
  padding: ${({ theme }) => theme.space.xl};
  border-bottom: 1px solid ${({ theme }) => theme.colors.backgroundDark};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: ${({ theme }) => theme.fontWeights.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const ResultItem = styled.div<{ state: 'success' | 'warning' | 'error' }>`
  display: flex;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background-color: ${({ state, theme }) => 
    state === 'success' ? theme.colors.successLight : 
    state === 'warning' ? theme.colors.warningLight : 
    theme.colors.dangerLight};
  color: ${({ state, theme }) => 
    state === 'success' ? theme.colors.success : 
    state === 'warning' ? theme.colors.warning : 
    theme.colors.danger};
  
  svg {
    margin-right: ${({ theme }) => theme.space.sm};
    min-width: 20px;
    margin-top: 3px;
  }
`;

const ResultText = styled.div`
  flex: 1;
`;

const TestImageContainer = styled.div`
  margin-top: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const TestImage = styled.img`
  max-width: 100px;
  max-height: 100px;
  object-fit: contain;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: white;
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const TestImageCaption = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const DiagnosticActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.md};
`;

const UserDataSection = styled.div`
  margin-top: ${({ theme }) => theme.space.xl};
  padding-top: ${({ theme }) => theme.space.xl};
  border-top: 1px dashed ${({ theme }) => theme.colors.border};
`;

const UserDataList = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space.md};
`;

const UserDataItem = styled.div`
  padding: ${({ theme }) => theme.space.sm};
  background-color: ${({ theme }) => theme.colors.backgroundDark};
  border-radius: ${({ theme }) => theme.radii.md};
`;

const UserDataLabel = styled.dt`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const UserDataValue = styled.dd`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  word-break: break-all;
  margin: 0;
`;

export default DiagnosticPage; 