import { EnIconBtn } from '@/components';
import { TaskListLayout, stateTaskList } from '@/state';
import { EnIcon } from '@ennv/components';
import { Dropdown, MenuProps } from 'antd';
import { observer } from 'mobx-react'
import styled from 'styled-components';
import { statusColor } from './_tools';
import { TaskStatus } from '@/utils/task';

const TaskBtnGroupContainer = styled.div`
    flex: 0 0 auto;
    border-left: 1px solid rgb(238, 238, 238);
    padding: 2px;
`


const ClearMenuIcon = ({ count, color, icon }: {
    color: string,
    count: number,
    icon: [string, string]
}) => {
    const outterStyle = {
        color, width: "24px", marginRight: '4px', marginLeft: '-8px', textAlign: 'center' as 'center'
    }
    const countStyle = {
        fontSize: '12px',
    }

    return count <= 0
        ? <div style={outterStyle}>
            <EnIcon kind={icon}></EnIcon>
        </div>
        : <div style={outterStyle}>
            <div style={countStyle}>{count > 99 ? '99+' : count}</div>
        </div>
}


const ClearMenuIconComplete = observer(() => <><ClearMenuIcon
    icon={['i_ennv', 'done-outline']}
    count={stateTaskList.list.filter(v => v.status === TaskStatus.completed).length}
    color={statusColor(TaskStatus.completed)} />
</>)
const ClearMenuIconError = observer(() => <><ClearMenuIcon
    icon={['i_ennv', 'error-outline']}
    count={stateTaskList.list.filter(v => v.status === TaskStatus.error).length}
    color={statusColor(TaskStatus.error)} />
</>)
const ClearMenuIconCancel = observer(() => <><ClearMenuIcon
    icon={['i_ennv', 'forbidden']}
    count={stateTaskList.list.filter(v => v.status === TaskStatus.canceled).length}
    color={statusColor(TaskStatus.canceled)} />
</>)
const ClearMenuIconDone = observer(() => <><ClearMenuIcon
    icon={['i_ennv', 'split-hor']}
    count={stateTaskList.list.filter(v =>
        v.status === TaskStatus.completed ||
        v.status === TaskStatus.canceled ||
        v.status === TaskStatus.error).length}
    color={'#000'} />
</>)


const items: MenuProps['items'] = [
    {
        key: TaskStatus.completed,
        icon: <ClearMenuIconComplete />,
        label: '清空已完成',
    },
    {
        key: TaskStatus.error,
        icon: <ClearMenuIconError />,
        label: '清空已失败',
    },
    {
        key: TaskStatus.canceled,
        icon: <ClearMenuIconCancel />,
        label: '清空已取消',
    },
    {
        key: 'done',
        icon: <ClearMenuIconDone />,
        label: '清空已结束',
    },
];



export const TaskBtnGroup = observer(() => {
    return (
        <TaskBtnGroupContainer style={{ float: "right" }}>
            <div>
                <EnIconBtn icon={['i_ennv', 'minimize']} onClick={() => { stateTaskList.min() }}></EnIconBtn>{
                    stateTaskList.status === TaskListLayout.brief
                        ? <EnIconBtn icon={['i_ennv', 'unfold-more']} onClick={() => { stateTaskList.max() }}></EnIconBtn>
                        : <EnIconBtn icon={['i_ennv', 'unfold-less']} onClick={() => { stateTaskList.brief() }}></EnIconBtn>
                }
            </div>
            <div>

                <Dropdown menu={{ items,onClick:({key})=>{
                    if(key === TaskStatus.completed){
                        stateTaskList.clear(TaskStatus.completed)
                    }else if(key === TaskStatus.canceled){
                        stateTaskList.clear(TaskStatus.canceled)
                    }else if(key === TaskStatus.error){
                        stateTaskList.clear(TaskStatus.error)
                    }else{
                        stateTaskList.clear(TaskStatus.completed,TaskStatus.canceled,TaskStatus.error)
                    }
                }}} >
                    <div style={{ display: 'inline-block' }}>
                        <EnIconBtn icon={['i_ennv', 'delete-outline']} onClick={() => { }}></EnIconBtn>
                    </div>
                </Dropdown>
                <EnIconBtn icon={['i_ennv', 'more-hor']} onClick={() => { }}></EnIconBtn>
            </div>
        </TaskBtnGroupContainer>
    )
})
