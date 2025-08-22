import { NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const Page404 = () => {
	return (
		<div className="mx-auto max-w-3xl px-4 py-5 overflow-hidden rounded-lg bg-white shadow mt-10">
             <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-2xl">
					<div className="h-full px-4 sm:px-6 lg:px-8">
						<section className="h-full dark:bg-gray-900">
							<div className="h-full py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
								<div className="max-w-screen-sm ">
									<h1 className="mb-6 text-7xl tracking-tight font-bold lg:text-8xl text-orange-200 dark:text-primary-500">
										Ooops!
									</h1>

									<p className="mb-1 text-3xl tracking-tight font-bold text-gray-600 md:text-4xl dark:text-white">
										Error 404
									</p>

									<p className="mb-4 text-lg  text-gray-500 dark:text-gray-400">
										No hemos podido encontrar la página que buscas.
									</p>

									<NavLink to="/">
										<Button type="button" variant={'default'} size={'sm'} className={'w-auto px-4 mt-10 bg-black hover:bg-gray-600'}>
											Regresar a Inicio
										</Button>
									</NavLink>
								</div>   
							</div>
						</section>
					</div>
				</div>
            </div>  
        </div>
	)
}

export default Page404