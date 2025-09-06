import React, { useState } from "react";
import { useSpring, animated } from "react-spring";

export default function Page() {

	const [angle, changeAngle] = useState(0);
	const [mouse_init_pos, changeMouseInitPos] = useState(0);
	const [mouse_snap_pos, changeMouseSnapPos] = useState(0);
	const [dragging, changeDragging] = useState(false);

	const Images = ["../src/assets/thormeme.jpg", "../src/assets/school_meme.png"];
	const [firstImg, setImg] = useState(true);


	const handel_drag_start = (e: React.DragEvent<HTMLDivElement>) => {
		changeDragging(true);
		changeMouseInitPos(e.screenX);
		e.dataTransfer.setDragImage(new Image(), 1000, 1000);
	}

	const handel_drag = (e: React.DragEvent<HTMLDivElement>) => {
		if (e.screenX > 20) { // weird bug screenX = 5 for some reason
			let calculated_pos = (mouse_snap_pos + (e.screenX - mouse_init_pos)) % 360;


			if (calculated_pos > 180) {
				calculated_pos -= 360;
			}
			else if (calculated_pos <= -180) {
				calculated_pos += 360;
			}



			changeAngle(calculated_pos);
		}
	}




	const handel_exit_drag = () => {
		changeDragging(false);
		let new_pos;
		if (Math.abs(Math.abs(angle) - Math.abs(mouse_snap_pos)) % 180 > 45) {
			new_pos = (mouse_snap_pos + 180) % 360;
		}
		else {
			new_pos = mouse_snap_pos;
		}



		let mid_point = (angle + 180) % 360;
		if (mid_point < 0) {
			mid_point += 360;
		}

		new_pos = new_pos < 0 ? new_pos + 360 : new_pos;
		if (new_pos > mid_point) // go right
		{
			new_pos -= 360;
		}

		changeAngle(new_pos);
		changeMouseSnapPos(new_pos);





	}

	const handel_start_touch = (e: React.TouchEvent<HTMLDivElement>) => {
		changeDragging(true);
		changeMouseInitPos(e.touches[0]["screenX"]);
	}

	const handel_touch = (e: React.TouchEvent<HTMLDivElement>) => {
		let calculated_pos = (mouse_snap_pos + e.touches[0]["screenX"] - mouse_init_pos) % 360;


		if (calculated_pos > 180) {
			calculated_pos -= 360;
		}
		else if (calculated_pos <= -180) {
			calculated_pos += 360;
		}




		changeAngle(calculated_pos);

		// change Image face
		// moved
	}




	const handel_exit_touch = () => {
		changeDragging(false);
		let new_pos;
		if (Math.abs(Math.abs(angle) - Math.abs(mouse_snap_pos)) % 180 > 45) {
			new_pos = (mouse_snap_pos + 180) % 360;
		}
		else {
			new_pos = mouse_snap_pos;
		}



		let mid_point = (angle + 180) % 360;
		if (mid_point < 0) {
			mid_point += 360;
		}

		new_pos = new_pos < 0 ? new_pos + 360 : new_pos;
		if (new_pos > mid_point) // go right
		{
			new_pos -= 360;
		}

		changeAngle(new_pos);
		changeMouseSnapPos(new_pos);





	}

	const props = useSpring({
		transform: `rotateY(${angle}deg)`,
		config: { duration: 500 },
		immediate: dragging,
		onChange:
			(result) => {
				const angle = result.value.transform;
				const match = angle.match(/\d+/)
				if (match) {
					const a: number = match[0];

					if (a % 180 != 0) {
						if (Math.abs(a) % 180 > 90 && firstImg === true) {
							setImg(false);
						}
						else if (Math.abs(a) % 180 < 90 && firstImg === false) {
							setImg(true);
						}
					}
				}
			}

	});



	return (
		<div className="container">
			<animated.div
				id="card"
				className="card"
				// className={dragging ? "card" : "card released"}
				draggable
				onDrag={(e) => handel_drag(e)}
				onDragStart={(e) => { handel_drag_start(e) }}
				onDragEnd={handel_exit_drag}
				onTouchMove={(e) => handel_touch(e)}
				onTouchStart={(e) => { handel_start_touch(e) }}
				onTouchEnd={handel_exit_touch}
				style={{
					...props
				}}>
				<img
					src={Images[1]}
					className="img img2"
					draggable={false}
				/>

				<img
					src={Images[0]}
					className={firstImg ? "img" : "img hidden"}
					draggable={false}
				/>

			</animated.div>
		</div >
	);
}
