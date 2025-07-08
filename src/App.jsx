import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Upload, Camera, Search, CheckCircle, AlertCircle, Puzzle } from 'lucide-react'
import './App.css'

function App() {
  const [referenceImage, setReferenceImage] = useState(null)
  const [pieceImage, setPieceImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [referenceUploaded, setReferenceUploaded] = useState(false)
  
  const referenceInputRef = useRef(null)
  const pieceInputRef = useRef(null)

  const handleImageUpload = (file, setImage, isReference = false) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImage(e.target.result)
        if (isReference) {
          uploadReferenceImage(e.target.result)
        }
      }
      reader.readAsDataURL(file)
    }
  }

const API_BASE_URL = 'https://5000-ibih5qjh5utbvvlgeg07p-23d6e28a.manusvm.computer';

  const uploadReferenceImage = async (imageData) => {
    setIsProcessing(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/puzzle/upload_reference`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setReferenceUploaded(true)
        setError(null)
      } else {
        setError(data.error || 'Erro ao fazer upload da imagem de referência')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor')
    } finally {
      setIsProcessing(false)
    }
  }

  const findPieceLocation = async () => {
    if (!pieceImage) {
      setError('Por favor, selecione uma imagem da peça primeiro')
      return
    }

    if (!referenceUploaded) {
      setError('Por favor, faça upload da imagem de referência primeiro')
      return
    }

    setIsProcessing(true)
    setError(null)
    setResult(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/puzzle/find_piece`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ piece_image: pieceImage }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
        setError(null)
      } else {
        setError(data.error || 'Erro ao processar a imagem')
      }
    } catch (err) {
      setError('Erro de conexão com o servidor')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Puzzle className="h-12 w-12 text-indigo-600" />
            <h1 className="text-4xl font-bold text-gray-900">Puzzle Solver</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Identifique peças de quebra-cabeça e descubra onde elas se encaixam na imagem de referência usando inteligência artificial
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Reference Image Upload */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                1. Imagem de Referência (Caixa)
                {referenceUploaded && <Badge variant="secondary" className="bg-green-100 text-green-800">✓ Carregada</Badge>}
              </CardTitle>
              <CardDescription>
                Faça upload da imagem da caixa do quebra-cabeça que servirá como referência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                onClick={() => referenceInputRef.current?.click()}
              >
                {referenceImage ? (
                  <div className="space-y-4">
                    <img 
                      src={referenceImage} 
                      alt="Imagem de referência" 
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600">Clique para alterar a imagem</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Clique para fazer upload</p>
                      <p className="text-sm text-gray-500">PNG, JPG até 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={referenceInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], setReferenceImage, true)}
                className="hidden"
              />
            </CardContent>
          </Card>

          {/* Piece Image Upload */}
          <Card className="border-2 border-dashed border-gray-300 hover:border-indigo-400 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                2. Foto da Peça
              </CardTitle>
              <CardDescription>
                Tire uma foto da peça ou grupo de peças que deseja localizar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-400 transition-colors"
                onClick={() => pieceInputRef.current?.click()}
              >
                {pieceImage ? (
                  <div className="space-y-4">
                    <img 
                      src={pieceImage} 
                      alt="Imagem da peça" 
                      className="max-h-48 mx-auto rounded-lg shadow-md"
                    />
                    <p className="text-sm text-gray-600">Clique para alterar a imagem</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="text-lg font-medium text-gray-700">Clique para fazer upload</p>
                      <p className="text-sm text-gray-500">PNG, JPG até 10MB</p>
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={pieceInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], setPieceImage)}
                className="hidden"
              />
            </CardContent>
          </Card>
        </div>

        {/* Process Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={findPieceLocation}
            disabled={!referenceUploaded || !pieceImage || isProcessing}
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 text-lg"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processando...
              </>
            ) : (
              <>
                <Search className="h-5 w-5 mr-2" />
                Encontrar Localização da Peça
              </>
            )}
          </Button>
        </div>

        {/* Results */}
        {result && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result.found ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Peça Encontrada!
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Peça Não Encontrada
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result.found ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Localização Encontrada:</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p><strong>Centro X:</strong> {Math.round(result.location.center_x)} pixels</p>
                        <p><strong>Centro Y:</strong> {Math.round(result.location.center_y)} pixels</p>
                        <p><strong>Confiança:</strong> {result.location.confidence} correspondências</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Status:</h4>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✓ Correspondência encontrada com sucesso
                      </Badge>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-blue-800">
                      <strong>Dica:</strong> A peça foi localizada na imagem de referência. 
                      As coordenadas indicam onde a peça se encaixa no quebra-cabeça completo.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-gray-700">{result.message}</p>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-orange-800">
                      <strong>Dicas para melhorar o resultado:</strong>
                    </p>
                    <ul className="list-disc list-inside mt-2 text-orange-700">
                      <li>Certifique-se de que a peça está bem iluminada</li>
                      <li>Tire a foto com boa qualidade e foco</li>
                      <li>Verifique se a peça realmente pertence ao quebra-cabeça da referência</li>
                      <li>Evite sombras ou reflexos na imagem</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Como Usar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <h3 className="font-semibold mb-2">Upload da Referência</h3>
                <p className="text-sm text-gray-600">
                  Faça upload de uma foto clara da caixa do quebra-cabeça
                </p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <h3 className="font-semibold mb-2">Foto da Peça</h3>
                <p className="text-sm text-gray-600">
                  Tire uma foto da peça que você quer localizar
                </p>
              </div>
              <div className="text-center">
                <div className="bg-indigo-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <h3 className="font-semibold mb-2">Encontrar Localização</h3>
                <p className="text-sm text-gray-600">
                  Clique no botão para descobrir onde a peça se encaixa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App

