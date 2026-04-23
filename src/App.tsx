import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Loader2, Sparkles, Send, Copy, Check, Coins, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_INSTRUCTION = `你要扮演一位顶级的AI Prompt工程师。你的任务是专门并且仅仅为【电商图像生成类、商品视觉展示类、模特换装渲染类】的应用或Agent编写提示词。

【核心限制，最高优先级指令】：
如果用户输入的想法与电商生图、商品展示、服饰模特换装、产品视觉渲染等电商视觉场景无关（例如：用户想写文章、做健身计划、写代码、做数学题等），你必须委婉但明确地拒绝，并直接回复：“抱歉，本系统专精于电商类生图（如宠物模特换装、商品场景渲染等）应用的提示词架构生成。请提供与电商视觉相关的需求。” 不要为无关内容生成任何角色的提示词。

如果用户的想法符合上述电商生图范围，你需要遵循以下优化方向来提升特征指令的可执行性和精确度：
1. 角色与专业性明确化：加入如“物理渲染”、“布料仿真”、“光影映射”等技术描述。
2. 核心功能转化为执行动作：不仅停留在概念，要转化为具体生成动作（如材质如何产生阴影或光泽、印花如何贴合褶皱）。
3. 场景描述细化光线氛围：增加光源方向、色温、环境反射描述。
4. 输出规格标准化：明确所需生成的像素分辨率（如 2048x2048）和留白区域位置。
5. 约束可控：明确列出负面指令（如“不得遮挡花纹”、“保持图案一致”）。
6. 分离独立逻辑：如不需要特定界面，在UI描述外保持生成动作指令的高纯度和聚焦。

请根据用户的想法，保留以下经典的结构框架的同时，融入上述专业细节来生成提示词：
====参考样例开始====
你是一位"资深宠物时尚摄影师与场景建模专家"。你不仅精通各种宠物(猫、狗等)的解剖结构与毛发质感处理，更深入理解布料材质的物理光泽、褶皱逻辑与光影映射。你的任务是协助淘宝卖家将平凡的宠物衣服平铺图转化为极具购买欲、逼真自然的"宠物实穿生活化场景大片"。

### 目标用户与场景
**目标用户**: 淘宝、小红书宠物服饰卖家,缺乏专业摄影器材和宠物模特的个人店主。
**使用场景**: 卖家上传一张宠物衣服的平铺图或挂拍图,Agent自动生成该衣服穿在特定品种宠物身上、处于特定光线场景的高清展示图。

### 核心功能列表
1. **衣物材质分析与物理仿真**: 自动分析原图材质。羊毛材质：生成蓬松纤维感、自然堆积褶皱和柔和阴影；光滑材质：生成水波纹光泽和轻盈飘动感；对于设计印花：必须自动贴合布料褶皱扭曲、保持图案清晰度，拒绝生硬的"P图感"。
2. **虚拟模特匹配与动作绑定**: 提供多品种宠物选择(法斗、金毛、柯基等)，支持选择宠物体型毛色，并支持用户直接上传自有模特/宠物实拍图进行定向换装。支持绑定特定动作（如宠物趴伏时衣服的领口自然下坠）。
3. **多角度展示生成**: 支持选择生成单张图或多张套图（包含正面展示、背面展示、侧面展示、以及局部细节特写图），全方位展现商品特点。

### 场景光线一键切换
- **户外生活**: 从左上方打下明亮暖黄自然光，草地的微弱环境绿光反射在衣物侧边(强调活泼感)。
- **居家温馨**: 柔和日光从窗户一侧射入，勾勒布料边缘透亮感，配置温暖的焦外散景(强调舒适感)。
- **专业棚拍**: 布置高级单色纯背景，使用顶光与强烈轮廓边缘光，剥离环境杂色以凸显(强调高级感与细节)。

### 生成约束与可控性保障
- 必须严格保持衣物原始颜色和花纹设计不变。
- 宠物表情自然，不遮挡衣物主要花纹。
- 避免背景中出现杂乱物体抢夺视觉焦点。

### 电商规格与像素适配
- **淘宝主图**: 生成 1:1 图像，尺寸 2048x2048 像素，主体居中，右上角留白用于添加Logo或推广文字。
- **详情页长图**: 生成 3:4 比例长图，分辨率 1080x1440 像素。
- **小红书封面**: 生成 9:16 短视频封面画幅，分辨率 1080x1920 像素。
- **图像清晰度选择**: 支持选择生成1K、2K、4K超清画质,满足不同展示场景与物料打印需求。

### UI/UX设计建议
1. **视觉引导布局**: 采用"三段式"界面。左侧为【素材上传区】,中间为【实时效果预览区】,右侧为【宠物与场景参数调节区】。
2. **可视化选择器**: 宠物种类和场景风格不使用纯文字下拉框,而是使用高清缩略图卡片,让用户通过视觉直观选择。
3. **配色方案**: 采用暖白与清新薄荷绿的组合,营造宠物行业的亲和力与洁净感。
4. **一键对比功能**: 在预览区设置"查看原图"悬浮按钮,方便用户随时对比衣服原样与生成效果,确保细节不失真。
5. **进度反馈**: 在生成高精图像时,显示趣味性的宠物动效(如:小狗跑动)作为加载动画,缓解等待焦虑。
====参考样例结束====

请根据用户的具体需求，构思高维度的角色设定、精确的可执行动作指令、生动的光影场景、明确的约束与输出标准。严格使用中文输出，直接返回生成的Prompt内容（使用统一规范的Markdown排版），不需要多余的问候语或解释。`;

interface SaasUser {
  name: string;
  enterprise?: string;
  integral: number;
}

export default function App() {
  const [idea, setIdea] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  // SaaS Integration State
  const [userId, setUserId] = useState<string>("");
  const [toolId, setToolId] = useState<string>("");
  const [saasUser, setSaasUser] = useState<SaasUser | null>(null);

  useEffect(() => {
    // 1. Initial Launch
    const handleSaaSMessages = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.type === 'SAAS_INIT') {
        const uId = data.userId && data.userId !== "null" && data.userId !== "undefined" ? data.userId : "";
        const tId = data.toolId && data.toolId !== "null" && data.toolId !== "undefined" ? data.toolId : "";
        
        setUserId(uId);
        setToolId(tId);
        
        if (data.context) setIdea(data.context);
        
        if (uId && tId) {
          fetchLaunchInfo(uId, tId);
        }
      }
    };

    window.addEventListener('message', handleSaaSMessages);
    return () => window.removeEventListener('message', handleSaaSMessages);
  }, []);

  const fetchLaunchInfo = async (uId: string, tId: string) => {
    try {
      const response = await fetch("/api/tool/launch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uId, toolId: tId })
      });
      const result = await response.json();
      if (result.success && result.data.user) {
        setSaasUser(result.data.user);
      }
    } catch (err) {
      console.error("SaaS Launch Error:", err);
    }
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt("");
    setIsCopied(false);

    try {
      // 2. Verification Step
      if (userId && toolId) {
        const verifyRes = await fetch("/api/tool/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, toolId })
        });
        const verifyResult = await verifyRes.json();
        
        if (!verifyResult.success) {
          setError(verifyResult.message || "积分不足，无法生成。");
          setIsLoading(false);
          return;
        }
      }

      // 3. Gemini Generation (Original Logic)
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.1-pro-preview",
        contents: `用户想要做的应用/Agent想法是：${idea}`,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });
      
      let fullPrompt = "";
      for await (const chunk of responseStream) {
        const chunkText = chunk.text || "";
        fullPrompt += chunkText;
        setGeneratedPrompt((prev) => prev + chunkText);
      }

      // 4. Consumption Step
      if (fullPrompt && userId && toolId) {
        const consumeRes = await fetch("/api/tool/consume", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, toolId })
        });
        const consumeResult = await consumeRes.json();
        if (consumeResult.success && consumeResult.data) {
          setSaasUser(prev => prev ? { ...prev, integral: consumeResult.data.currentIntegral } : null);
        }
      }

    } catch (err: any) {
      console.error(err);
      setError("生成期间出现错误，请检查网络或刷新页面。");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#2C3E50] antialiased font-sans flex flex-col">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#E0E4E7] flex items-center justify-between px-6 lg:px-8 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#26A69A] rounded flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="font-bold text-lg tracking-tight ml-2">电商生图应用提示词</span>
        </div>
        
        {/* User Stats Display */}
        <div className="flex items-center gap-4">
          {saasUser && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-[#F1F5F9] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">{saasUser.name}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#FFF8E1] px-3 py-1.5 rounded-lg border border-[#FFE082]">
                <Coins className="w-3.5 h-3.5 text-[#FBC02D]" />
                <span className="text-xs font-bold text-[#F57F17]">{saasUser.integral} <span className="font-normal text-[0.65rem] opacity-70">积分</span></span>
              </div>
            </div>
          )}
          <div className="h-4 w-[1px] bg-slate-200 hidden md:block"></div>
          <div className="bg-[#E0F2F1] text-[#00796B] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest hidden md:block">
            SaaS 系统对接中
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col gap-6 p-6 overflow-y-auto max-w-4xl mx-auto w-full">
        {/* Top Panel: Input Area */}
        <main className="bg-white border border-[#E0E4E7] rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col shrink-0">
          <div className="mb-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">智能体角色定义</h3>
            <div className="flex items-center gap-3 p-3 bg-[#F1F5F9] rounded-lg">
              <div className="w-12 h-12 bg-[#B2DFDB] text-[#00796B] rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                PA
              </div>
              <div>
                <div className="font-bold text-sm text-[#2C3E50]">电商视觉架构专家</div>
                <div className="text-xs text-slate-500">仅支持电商/换装生图场景</div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-[#E0F2F1] rounded-lg text-xs text-[#00796B] leading-relaxed">
              <span className="font-bold">专家提示：</span> 描述您想要构建的<span className="font-bold underline underline-offset-2">电商图像生成</span>应用的核心功能与目标场景（例如：模特换装、商品融合），AI 将为您精心打造一份专业且高转化率的系统级提示词。非电商生图需求将被拒绝。
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="relative flex flex-col">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                1. 用户输入电商生图应用需求
              </label>
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="描述你想让 Agent 实现的电商图像生成功能... 例如：我想构建一个淘宝女装模特自动换装试衣的AI，支持选光线和姿态。"
                className="w-full min-h-[160px] p-4 text-[0.95rem] bg-white border-[1.5px] border-[#E0E4E7] rounded-lg resize-none outline-none focus:border-[#26A69A] transition-colors"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-3">
             {error && (
              <p className="text-red-500 text-xs px-2">
                {error}
              </p>
            )}
            <button
              onClick={handleGenerate}
              disabled={isLoading || !idea.trim()}
              className="group relative w-full flex items-center justify-center gap-2 bg-[#26A69A] text-white px-6 py-4 rounded-lg font-bold tracking-wide transition-all hover:bg-[#208d83] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isLoading ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin" />
                   生成设定中...
                 </>
              ) : (
                 <>
                   立即生成专业提示词 <Send className="w-5 h-5 ml-2 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                 </>
              )}
            </button>
          </div>
        </main>

        {/* Bottom Panel: Output Area */}
        <aside className="bg-white border border-[#E0E4E7] rounded-xl p-6 shadow-[0_2px_4px_rgba(0,0,0,0.02)] flex flex-col min-h-[400px]">
           <div className="flex justify-between items-center mb-4">
             <label className="text-xs font-bold text-slate-500 uppercase">
               2. 生成的系统提示词
             </label>
             {generatedPrompt && (
               <button
                 onClick={handleCopy}
                 className="flex items-center text-xs text-[#00796B] hover:text-[#005A4E] transition-colors"
                 title="一键复制"
               >
                 {isCopied ? (
                   <>
                     <Check className="w-4 h-4 mr-1" /> 已复制
                   </>
                 ) : (
                   <>
                     <Copy className="w-4 h-4 mr-1" /> 一键复制
                   </>
                 )}
               </button>
             )}
           </div>

           {generatedPrompt ? (
             <div className="flex-1 bg-[#FDFCFB] border-[1.5px] border-dashed border-[#B2DFDB] rounded-lg p-5 overflow-y-auto">
               <div className="markdown-body font-sans text-[#2C3E50]">
                 <ReactMarkdown>{generatedPrompt}</ReactMarkdown>
               </div>
             </div>
           ) : (
              <div className="flex-1 bg-[#FDFCFB] border-[1.5px] border-dashed border-[#B2DFDB] rounded-lg p-5 flex flex-col items-center justify-center text-center opacity-70">
                 <div className="w-16 h-16 bg-[#E0F2F1] rounded-full flex items-center justify-center mb-4 text-[#00796B]">
                    <Sparkles className="w-6 h-6" />
                 </div>
                 <p className="text-sm font-bold text-[#00796B]">等待灵感唤醒...</p>
                 <p className="text-xs text-slate-500 mt-2">在上方填入电商/商品渲染相关的创意即可自动生成模板。</p>
              </div>
           )}
        </aside>
      </div>
    </div>
  );
}
