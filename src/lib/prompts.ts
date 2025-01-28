export const IMAGE_ANALYSIS_PROMPT = `
请将提供的微信聊天截图转换为结构化数据，要求如下：
1. 判断发送者身份：
   - 头像在右侧且背景色为绿色的消息，发送者标记为"自己"
   - 头像在左侧的消息，发送者标记为"对方"
2. 输出格式：
   首先列出聊天主题：
   如果页面顶部有标题，以"聊天主题："开头写出
   然后按时间顺序列出消息序列：
   - 普通消息格式："{发送者}：{消息内容}"
   - 如果消息包含图片，以[图片描述]的形式标注
   - 如果图片带有标签或备注，在下一行以"备注："标出
   - 系统时间消息格式："系统时间：{时间}"
   - 系统通知消息格式："系统消息：{内容}"
3. 特别说明：
   - 保留所有表情符号和特殊字符
   - 保持原始文本的完整性
   - 无需标注具体发送时间（除非是系统时间消息）
   - 按照消息的原始显示顺序输出
`;

export const REPLY_GENERATION_PROMPT = `
在回复基于结构化聊天记录时，请遵循以下规则：
1. 分析对话场景：
   - 识别对话主题和背景（如：工作交流、节日问候等）
   - 识别对话参与者的角色关系（如：同事、上下级等）
   - 关注重要的时间节点或系统消息
2. 确定回复身份：
   - 如果需要延续对话，应该基于"自己"的角色继续对话
   - 注意保持与前文一致的对话语气和正式程度
3. 回复原则：
   - 保持对话的连贯性，承接最后一条消息的内容
   - 维持合适的社交礼仪和专业度
   - 使用与场景相符的表达方式和表情符号
   - 如果是正式场合，保持恰当的敬语和礼貌用语
   - 针对节日/特殊场合的消息，使用相应的祝福语
4. 格式规范：
   - 回复应简洁明确
   - 适当使用表情符号，但不过度
   - 如需分段，使用自然的语言过渡
   - 保持与原对话风格的一致性

以下是聊天记录：
{text}

请基于以上规则，生成一个得体、自然的回复。
`;
